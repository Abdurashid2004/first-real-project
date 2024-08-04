import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { UpdateDriverDto } from "./dto/update-driver.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Driver } from "./model/driver.entity";
import { LoginDriverDto } from "./dto/login-driver.dto";
import { Op } from "sequelize";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Response } from "express";
import { SummaDto } from "./dto/summa-driver.dto";
import * as otpgen from "otp-generator";
import { TaxiOrder } from "../taxi_order/model/taxi_order.model";
import { FindOrderDto } from "./dto/find-order.dto";
import { SmsService } from "../sms/sms.service";
import { Otp } from "../otp/model/otp.model";
import { AddMinutesToDate } from "../helpers/addMinutes";
import { v4 } from "uuid";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { RegisterDriverDto } from "./dto/register-driver.dto";
import { SendDriverDto } from "./dto/send-driver.dto";
import { Car } from "../car/model/car.entity";

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver) private driverRepo: typeof Driver,
    @InjectModel(Otp) private readonly otpRepo: typeof Otp,
    @InjectModel(TaxiOrder) private orderRepo: typeof TaxiOrder,
    private SmsService: SmsService,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService
  ) {}

  // Get tokens service
  async getTokens(driver: Driver) {
    const payload = {
      id: driver.id,
      isActive: driver.isActive,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY_DRIVER,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY_DRIVER,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  // Otp send

  async otp(sendDriverDto: SendDriverDto) {
    const { phone } = sendDriverDto;

    console.log(phone);

    const existingClient = await this.driverRepo.findOne({ where: { phone } });

    const otp = otpgen.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const resp = await this.SmsService.sendSms(phone, otp);
    if (resp.status !== 200) {
      throw new ServiceUnavailableException("Error in Server sending Otp");
    }

    const message = `Sms has been sent to User at ${phone.slice(-4)}`;
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 2);

    await this.otpRepo.destroy({ where: { check: phone } });

    await this.otpRepo.create({
      id: v4(),
      otp,
      expiration_time,
      check: phone,
      verified: false,
    });

    await this.driverRepo.create({ phone });

    return { status: "Success", message, otp };
  }

  // verify otp

  async checkOtp(verifyOtpDto: VerifyOtpDto) {
    const { check, otp } = verifyOtpDto;

    console.log(check, otp);

    try {
      const otpRecord = await this.otpRepo.findOne({
        where: { check: check.toString() },
      });

      if (!otpRecord) {
        throw new BadRequestException("Invalid Phone Number");
      }

      if (Number(otpRecord.otp) !== Number(otp)) {
        throw new BadRequestException("Invalid OTP");
      }

      const [updateCount, updatedUsers] = await this.driverRepo.update(
        { isActive: true },
        { where: { phone: check.toString() }, returning: true }
      );

      if (updateCount === 0) {
        throw new BadRequestException("User not found");
      }

      const updatedUser = updatedUsers[0];

      await this.otpRepo.update(
        { verified: true },
        { where: { id: otpRecord.id } }
      );

      return { message: "You are now verified!", user: updatedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // register driver

  async register(
    registerDriverDto: RegisterDriverDto,
    photo: Express.Multer.File,
    prava: Express.Multer.File,
    res: Response
  ) {
    console.log("+", registerDriverDto);
    const { phone, password } = registerDriverDto;

    // Check if the driver already exists
    let driver = await this.driverRepo.findOne({
      where: { phone },
    });

    if (!photo || !prava) throw new BadRequestException("Photos are required!");

    const img = (await this.cloudinaryService.uploadImage(photo)).url;
    const img1 = (await this.cloudinaryService.uploadImage(prava)).url;

    const hashedPassword = await bcrypt.hash(password, 7);

    // If driver doesn't exist, create a new one
    if (!driver) {
      driver = await this.driverRepo.create({
        ...registerDriverDto,
        photo: img,
        prava: img1,
        hashed_password: hashedPassword,
        isActive: true,
      });
    } else {
      // If driver exists, update the existing record
      const updatedDriver = await this.driverRepo.update(
        {
          photo: img,
          prava: img1,
          ...registerDriverDto,
          hashed_password: hashedPassword,
          isActive: true,
        },
        {
          where: { id: driver.id },
          returning: true,
        }
      );
      driver = updatedDriver[1][0];
    }

    const tokens = await this.getTokens(driver);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);

    await this.driverRepo.update(
      { hashed_refresh_token: hashedRefreshToken },
      { where: { id: driver.id } }
    );

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 kun
      httpOnly: true,
    });

    return {
      message: "Driver registered successfully",
      driver,
      tokens,
    };
  }

  // login driver

  async login(loginDriverDto: LoginDriverDto, res: Response) {
    const { phone, password } = loginDriverDto;

    const driver = await this.driverRepo.findOne({
      where: { phone },
    });

    if (!driver) throw new BadRequestException("Driver not found!");

    const passwordMatches = await bcrypt.compare(
      password,
      driver.hashed_password
    );
    if (!passwordMatches) throw new BadRequestException("Invalid credentials!");

    const tokens = await this.getTokens(driver);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);

    driver.hashed_refresh_token = hashedRefreshToken;
    await driver.save();

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
    });

    return {
      message: "Login successful",
      id: driver.id,
      tokens,
    };
  }

  // get all admin isActive == false
  async getUADrivers() {
    return this.driverRepo.findAll({ where: { isActive: false } });
  }

  // activate driver

  async activeDriver(id: number) {
    const findDriver = await this.driverRepo.findByPk(id);
    if (!findDriver) throw new NotFoundException("Driver not found!");
    findDriver.isActive = true;
    findDriver.save();

    return { message: "Driver succesfuly activated!" };
  }

  // unactivate driver

  async unactiveDriver(id: number) {
    const findDriver = await this.driverRepo.findByPk(id);
    if (!findDriver) throw new NotFoundException("Driver not found!");
    findDriver.isActive = false;
    findDriver.save();
    console.log(findDriver);

    return findDriver;
  }

  // add balance

  async addMoney(id: number, summaDto: SummaDto) {
    const findDriver = await this.driverRepo.findByPk(id);
    if (!findDriver) throw new NotFoundException("Driver not foudn!");
    if (!summaDto.sum) throw new BadRequestException("Sum is required!");

    findDriver.total_balance = findDriver.total_balance + summaDto.sum;
    await findDriver.save();

    delete findDriver.hashed_password;
    delete findDriver.hashed_refresh_token;

    return {
      message: "Succesfuly added sum",
      data: findDriver,
    };
  }

  // remove balance

  async removeMoney(id: number, summaDto: SummaDto) {
    const findDriver = await this.driverRepo.findByPk(id);
    if (!findDriver) throw new NotFoundException("Driver not found!");
    if (!summaDto.sum) throw new BadRequestException("Sum is required!");

    if (summaDto.sum > findDriver.total_balance)
      throw new BadRequestException(
        "The given amount is more than the balance amount"
      );

    // Balansni kamaytirish
    findDriver.total_balance -= summaDto.sum;
    await findDriver.save();

    // Parol va refresh tokenni javobdan o'chirish
    delete findDriver.hashed_password;
    delete findDriver.hashed_refresh_token;

    return {
      message: "Successfully removed sum",
      data: findDriver,
    };
  }

  async refreshToken(driverId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);
    if (!decodedToken) {
      throw new BadRequestException("Invalid refresh token");
    }

    console.log("Decoded Token:", decodedToken);

    if (driverId !== decodedToken["id"]) {
      throw new BadRequestException("Driver not matched");
    }

    const driver = await this.driverRepo.findByPk(driverId);
    if (!driver || !driver.hashed_refresh_token) {
      throw new BadRequestException("Refresh token not found");
    }

    const isMatchedToken = await bcrypt.compare(
      refreshToken,
      driver.hashed_refresh_token
    );
    if (!isMatchedToken) throw new ForbiddenException("Forbidden");

    const tokens = await this.getTokens(driver);

    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    const updatedDriver = await this.driverRepo.update(
      { hashed_refresh_token },
      { where: { id: driver.id }, returning: true }
    );

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "Driver refreshed",
      driver: updatedDriver[1][0],
      tokens,
    };

    return response;
  }

  // log out

  async logOut(refreshToken: string, res: Response) {
    try {
      const userdata = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY_DRIVER,
      });
      console.log(userdata);

      if (!userdata) {
        throw new ForbiddenException("Invalid token");
      }

      const [numberOfAffectedRows, [updatedUser]] =
        await this.driverRepo.update(
          {
            hashed_refresh_token: null,
            isActive: false,
          },
          {
            where: { id: userdata.id },
            returning: true,
          }
        );

      if (numberOfAffectedRows === 0 || !updatedUser) {
        throw new BadRequestException("Failed to log out user");
      }

      res.clearCookie("refresh_token");

      const response = {
        message: "Driver logged out successfully",
        user_refresh_token: updatedUser.hashed_refresh_token,
      };

      return response;
    } catch (error) {
      throw new ForbiddenException("Invalid token");
    }
  }

  // search driver
  async findAll(searchParams: { [key: string]: any }) {
    const whereCondition: any = {};

    for (const key in searchParams) {
      if (searchParams[key]) {
        whereCondition[key] = { [Op.like]: `%${searchParams[key]}%` };
      }
    }

    try {
      return await Driver.findAll({
        where: whereCondition,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  // find by id driver

  async findOne(id: number) {
    const driver = await this.driverRepo.findByPk(id);
    if (!driver) throw new NotFoundException("Driver not found!");
    return driver;
  }

  // update driver

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    const driver = await this.driverRepo.findByPk(id);
    if (!driver) throw new NotFoundException("Driver not found!");

    if (updateDriverDto.password) {
      const isMatch = await bcrypt.compare(
        updateDriverDto.password,
        driver.hashed_password
      );
      if (!isMatch) throw new BadRequestException("Invalid password!");

      updateDriverDto.password = await bcrypt.hash(updateDriverDto.password, 7);
    }

    return this.driverRepo.update(updateDriverDto, { where: { id } });
  }

  async remove(id: number) {
    const driver = await this.driverRepo.findByPk(id);
    if (!driver) throw new NotFoundException("Driver not found!");

    await driver.destroy();
    return "Successfuly deleted!";
  }

  // find order:

  async findOrder(findOrderDto: FindOrderDto) {
    const { from, to } = findOrderDto;
    console.log(from, to);

    if (from === undefined || to === undefined) {
      throw new NotFoundException("Invalid search criteria");
    }

    try {
      console.log(`Searching for orders from ${from} to ${to}`);

      const orders = await this.orderRepo.findAll({
        where: {
          from_distinct_id: { [Op.eq]: from },
          to_distinct_id: { [Op.eq]: to },
        },
        include: [],
      });
      console.log(orders);

      // if (orders.length === 0) {
      //   throw new NotFoundException(
      //     "No orders found for the specified criteria"
      //   );
      // }

      return orders;
    } catch (error) {
      console.error("Error while searching for orders:", error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error("Error while searching for orders");
    }
  }

  // Admin add driver

  async createDriver(
    registerDriverDto: RegisterDriverDto,
    photo: Express.Multer.File,
    prava: Express.Multer.File,
    res: Response
  ) {
    const { phone, password } = registerDriverDto;

    const findDriver = await this.driverRepo.findOne({
      where: { phone },
    });

    if (!photo || !prava) throw new BadRequestException("Photos are required!");

    const img = (await this.cloudinaryService.uploadImage(photo)).url;
    const img1 = (await this.cloudinaryService.uploadImage(prava)).url;

    const hashedPassword = await bcrypt.hash(password, 7);
    const updatedDriver = await this.driverRepo.update(
      {
        photo: img,
        prava: img1,
        ...registerDriverDto,
        hashed_password: hashedPassword,
        isActive: true,
      },
      {
        where: { id: findDriver.id },
        returning: true,
      }
    );
    const driver = updatedDriver[1][0];

    const tokens = await this.getTokens(driver);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);

    await this.driverRepo.update(
      { hashed_refresh_token: hashedRefreshToken },
      { where: { id: findDriver.id } }
    );

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      message: "Driver successfully added",
    };
  }

  // update Driver By Admin

  async updateDriverByAdmin(id: number, updateDriverDto: UpdateDriverDto) {
    const driver = await this.driverRepo.findByPk(id);
    if (!driver) throw new NotFoundException("Driver not found!");

    if (updateDriverDto.password) {
      const isMatch = await bcrypt.compare(
        updateDriverDto.password,
        driver.hashed_password
      );
      if (!isMatch) throw new BadRequestException("Invalid password!");

      updateDriverDto.password = await bcrypt.hash(updateDriverDto.password, 7);
    }

    return this.driverRepo.update(updateDriverDto, { where: { id } });
  }
}

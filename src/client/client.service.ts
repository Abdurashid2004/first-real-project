import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Client } from "./model/client.entity";
import { Otp } from "src/otp/model/otp.model";
import { JwtService } from "@nestjs/jwt";
import { SmsService } from "src/sms/sms.service";
import * as otpgen from "otp-generator";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { AddMinutesToDate } from "src/helpers/addMinutes";
import { v4 } from "uuid";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import { LoginClientDto } from "./dto/login-client.dto";
import { RegisterClientDto } from "./dto/regester-client.dto";
import { UpdatePasswordAdminDto } from "./dto/updatePassword.dto";
import { FindUserDto } from "./dto/find-user.dto";
import { Op } from "sequelize";


@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client) private readonly clientRepo: typeof Client,
    @InjectModel(Otp) private readonly otpRepo: typeof Otp,
    private readonly jwtService: JwtService,
    private SmsService: SmsService
  ) {}

  async getTokens(client: Client) {
    const payload = {
      id: client.id,
      is_active: client.is_active,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY_CLIENT,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY_CLIENT,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async otp(createClientDto: CreateClientDto) {
    const { phone } = createClientDto;

    const existingClient = await this.clientRepo.findOne({ where: { phone } });

    if (existingClient) {
      throw new BadRequestException(
        "Client with this phone number already exists"
      );
    }

    const otp = otpgen.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const resp = await this.SmsService.sendSms(phone, otp);
    if (resp.status !== 200) {
      throw new ServiceUnavailableException("Error in Server sending OTP");
    }

    console.log(`Generated OTP for ${phone}: ${otp}`);

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

    await this.clientRepo.create({ phone });

    return { status: "Success", message, otp };
  }

  async checkOtp(verifyOtpDto: VerifyOtpDto) {
    const { check, otp } = verifyOtpDto;

    try {
      // Check if the OTP record exists
      const otpRecord = await this.otpRepo.findOne({
        where: { check: check.toString() },
      });

      if (!otpRecord) {
        throw new BadRequestException("Invalid Phone Number");
      }

      // Verify the OTP
      if (Number(otpRecord.otp) !== Number(otp)) {
        throw new BadRequestException("Invalid OTP");
      }

      // Update the user's status to active
      const [updateCount, updatedUsers] = await this.clientRepo.update(
        { is_active: true },
        { where: { phone: check.toString() }, returning: true }
      );

      if (updateCount === 0) {
        throw new BadRequestException("User not found");
      }

      const updatedUser = updatedUsers[0];

      // Mark the OTP as verified
      await this.otpRepo.update(
        { verified: true },
        { where: { id: otpRecord.id } }
      );

      return { message: "You are now verified!", user: updatedUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(askInfo: RegisterClientDto, res: Response) {
    const { name, password, phone } = askInfo;

    try {
      if (askInfo.password !== askInfo.confirm_password) {
        throw new BadRequestException(
          "Password and Confirm Password do not match"
        );
      }
      const user = await this.clientRepo.findOne({ where: { phone } });
      if (!user) {
        throw new BadRequestException("User not found");
      }

      const hashedPassword = await bcrypt.hash(password, 7);

      const tokens = await this.getTokens(user);
      const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);

      const [numberOfAffectedRows, [updatedUser]] =
        await this.clientRepo.update(
          {
            name: name,
            hashed_password: hashedPassword,
            hashed_refresh_token: hashedRefreshToken,
            is_active: true,
          },
          {
            where: {
              phone: askInfo.phone,
            },
            returning: true,
          }
        );

      if (numberOfAffectedRows === 0 || !updatedUser) {
        throw new BadRequestException("Failed to update user");
      }
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      const response = {
        message: "User updated successfully",
        user: updatedUser,
        tokens,
      };
      console.log(response);

      return response;
    } catch (error) {
      throw new BadRequestException("Failed to update user");
    }
  }

  async login(loginclientDto: LoginClientDto, res: Response) {
    const { phone, password } = loginclientDto;
    const client = await this.clientRepo.findOne({ where: { phone } });

    if (!client) {
      throw new BadRequestException("User not found");
    }
    if (!client.is_active) {
      throw new BadRequestException("User is not active");
    }
    console.log(client.hashed_password, password);
    const isMatchPass = await bcrypt.compare(password, client.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException("Passwords do not match");
    }

    const tokens = await this.getTokens(client);
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);

    await this.clientRepo.update(
      { hashed_refresh_token: hashedRefreshToken },
      { where: { id: client.id } }
    );

    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
    });

    const updatedUser = await this.clientRepo.findOne({
      where: { id: client.id },
    });

    const response = {
      message: "User logged in successfully",
      user: updatedUser,
      tokens,
    };
    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);
    if (userId !== decodedToken["id"]) {
      throw new BadRequestException("User not matched");
    }
    const user = await this.clientRepo.findByPk(userId);
    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException("Refresh token not found");
    }
    const isMatchedtoken = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token
    );
    if (!isMatchedtoken) throw new ForbiddenException("Forbidden");
    const tokens = await this.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.clientRepo.update(
      {
        hashed_refresh_token,
      },
      { where: { id: user.id }, returning: true }
    );
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "User refreshed",
      user: updatedUser[1][0],
      tokens,
    };
    return response;
  }

  async logOut(refreshToken: string, res: Response) {
    try {
      const userdata = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY_CLIENT,
      });
      console.log(userdata);

      if (!userdata) {
        throw new ForbiddenException("Invalid token");
      }

      const [numberOfAffectedRows, [updatedUser]] =
        await this.clientRepo.update(
          {
            hashed_refresh_token: null,
            is_active: false,
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
        message: "User logged out successfully",
        user_refresh_token: updatedUser.hashed_refresh_token,
      };

      return response;
    } catch (error) {
      throw new ForbiddenException("Invalid token");
    }
  }

  async updatePassword(id: number, updatePassword: UpdatePasswordAdminDto) {
    const admin = await this.clientRepo.findByPk(id);

    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    const oldPassword = await bcrypt.compare(
      updatePassword.password,
      admin.hashed_password
    );

    if (!oldPassword) {
      throw new BadRequestException("Old password is wrong");
    }

    if (updatePassword.new_password !== updatePassword.confirm_password) {
      throw new BadRequestException("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(updatePassword.new_password, 7);
    admin.hashed_password = hashedPassword;

    const updatedClient = await this.clientRepo.update(
      { hashed_password: hashedPassword },
      { where: { id } }
    );

    if (!updatedClient) {
      throw new InternalServerErrorException("Failed to update password");
    }

    const response = {
      message: "Password updated",
    };
    return response;
  }

  async findAllClient() {
    try {
      return this.clientRepo.findAll();
    } catch (error) {
      throw new BadRequestException("clients No");
    }
  }

  async findUSerByParams(findUserDto: FindUserDto) {
    const where = {};
    if (findUserDto.name) {
      where["name"] = {
        [Op.like]: `%${findUserDto.name}%`,
      };
    }

    if (findUserDto.phone) {
      where["phone"] = {
        [Op.like]: `%${findUserDto.phone}%`,
      };
    }

    const users = await this.clientRepo.findAll({ where });
    if (users.length == 0) throw new BadRequestException("User not found");
    return users;
  }

  async findOneClient(id: number) {
    try {
      const client = await this.clientRepo.findByPk(id);
      if (!client) {
        throw new BadRequestException(`There is no Client with such an ${id}`);
      }
      return client;
    } catch (error) {
      throw new BadRequestException("client No");
    }
  }

  async updateClient(id: number, updateClientDto: UpdateClientDto) {
    try {
      const client1 = await this.clientRepo.findByPk(id);
      if (!client1) {
        throw new BadRequestException(`There is no Client with such an ${id}`);
      }
      const client = await this.clientRepo.update(updateClientDto, {
        where: { id },
        returning: true,
      });
      return client[1][0];
    } catch (error) {
      throw new BadRequestException("client No");
    }
  }

  async removeClient(id: number) {
    const client1 = await this.clientRepo.destroy({ where: { id } });
    if (!client1) {
      throw new BadRequestException(`There is no Client with such an ${id}`);
    }
    return client1;
  }

  // Admin add client
  async createClient(registerClientDto: RegisterClientDto, res: Response) {
    try {
      const { phone, password, confirm_password } = registerClientDto;

      // Tekshiramiz login allaqachon mavjud emasligini
      const existingClient = await this.clientRepo.findOne({
        where: { phone },
      });
      if (existingClient) {
        throw new BadRequestException(
          "There is already a client with this login"
        );
      }

      // Parollar mosligini tekshiramiz
      if (password !== confirm_password) {
        throw new BadRequestException("Passwords do not match");
      }

      // Parolni hash qilamiz
      const hashed_password = await bcrypt.hash(password, 7);
      const newClient = await this.clientRepo.create({
        ...registerClientDto,
        hashed_password: hashed_password,
        is_active: true,
      });

      // Tokenlarni yaratamiz
      const tokens = await this.getTokens(newClient);
      newClient.hashed_refresh_token = await bcrypt.hash(
        tokens.refresh_token,
        7
      );
      await newClient.save();
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 kun
        httpOnly: true,
      });

      const response = {
        message: "Client created successfully",
      };

      return response;
    } catch (error) {
      res.status(401).json({ message: "Access Denied. No token provided." });
    }
  }
}

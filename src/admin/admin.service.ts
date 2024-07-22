import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { Response } from "express";
import * as bcrypt from "bcrypt";
import { Admin } from "./entities/admin.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminRepo: typeof Admin,
    private readonly jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };
    console.log(payload);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(loginAdminDto: LoginAdminDto, res: Response) {
    try {
      const { login, password } = loginAdminDto;

      const admin = await this.adminRepo.findOne({ where: { login } });

      if (!admin) {
        throw new BadRequestException("Admin not found");
      }
      if (!admin.is_active) {
        throw new BadRequestException("Admin not active");
      }

      const isMatchPass = await bcrypt.compare(password, admin.password);

      if (!isMatchPass) {
        throw new BadRequestException("Password do not match");
      }
      const tokens = await this.getTokens(admin);

      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
      const updateAdmin = await this.adminRepo.update(
        { hashed_refresh_token },
        { where: { id: admin.id }, returning: true }
      );
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      const response = {
        message: "admin logged in",
        admin: updateAdmin[1][0],
        tokens,
      };
      return response;
    } catch (error) {
      return res.status(500).json({ message: "Unexpected Error" });
    }
  }

  async logout(refreshToken: string, res: Response) {
    try {
      const adminData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!adminData) {
        return res.status(HttpStatus.FORBIDDEN).send("Admin not verified");
      }

      const [numberOfAffectedRows, updatedAdmins] = await this.adminRepo.update(
        {
          hashed_refresh_token: null,
          is_active: false,
        },
        {
          where: { id: adminData.id },
          returning: true,
        }
      );

      if (numberOfAffectedRows === 0) {
        return res.status(HttpStatus.NOT_FOUND).send("Admin not found");
      }

      res.clearCookie("refresh_token");

      const updatedAdmin = updatedAdmins[0];
      const adminResponse = {
        id: updatedAdmin.id,
        login: updatedAdmin.login,
        tg_link: updatedAdmin.tg_link,
        photo: updatedAdmin.photo,
        is_active: updatedAdmin.is_active,
        is_creator: updatedAdmin.is_creator,
        createdAt: updatedAdmin.createdAt,
        updatedAt: updatedAdmin.updatedAt,
      };

      return {
        message: "Admin logged out successfully",
        admin: adminResponse,
      };
    } catch (error) {
      console.error("Error during logout:", error);

      if (error instanceof ForbiddenException) {
        return res.status(HttpStatus.FORBIDDEN).send(error.message);
      }

      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send(error.message);
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send("Unexpected Error");
    }
  }

  async refreshToken(adminId: number, refreshToken: string, res: Response) {
    this.logger.log("Calling login()", AdminService.name);
    this.logger.debug("Calling login()", AdminService.name);
    this.logger.verbose("Calling login()", AdminService.name);
    this.logger.warn("Calling login()", AdminService.name);
    try {
      const decodedToken = await this.jwtService.decode(refreshToken);
      if (adminId != decodedToken["id"]) {
        throw new BadRequestException("Unauthorized access");
      }
      const admin = await this.adminRepo.findOne({ where: { id: adminId } });
      if (!admin || !admin.hashed_refresh_token) {
        throw new BadRequestException("Admin or token not found");
      }
      const tokenMatch = await bcrypt.compare(
        refreshToken,
        admin.hashed_refresh_token
      );

      if (!tokenMatch) {
        throw new ForbiddenException("Forbidden");
      }
      const tokens = await this.getTokens(admin);

      const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

      const updateAdmin = await this.adminRepo.update(
        { hashed_refresh_token },
        {
          where: { id: admin.id },
          returning: true,
        }
      );
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      const response = {
        message: "Admin refreshed",
        admin: updateAdmin[1][0],
        tokens,
      };
      return response;
    } catch (error) {
      return res.status(500).json({ message: "Unexpected Error" });
    }
  }

  async getAdminByLogin(login: string): Promise<Admin> {
    return this.adminRepo.findOne({
      where: { login },
      include: { all: true },
    });
  }

  async createAdmin(createAdminDto: CreateAdminDto, res: Response) {
    try {
      const { login, password, confirm_password } = createAdminDto;

      const existingAdmin = await this.adminRepo.findOne({ where: { login } });
      if (existingAdmin) {
        throw new BadRequestException(
          "There is already an admin with this login"
        );
      }

      if (password !== confirm_password) {
        throw new BadRequestException("Passwords do not match");
      }

      const hashed_password = await bcrypt.hash(password, 7);
      const newAdmin = await this.adminRepo.create({
        ...createAdminDto,
        password: hashed_password,
        is_active: true,
      });

      const tokens = await this.getTokens(newAdmin);
      newAdmin.hashed_refresh_token = await bcrypt.hash(
        tokens.refresh_token,
        7
      );
      await newAdmin.save();
      res.cookie("refresh_token", tokens.refresh_token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      const response = {
        message: "Admin created successfully",
        admin: newAdmin,
        tokens,
      };

      return response;
    } catch (error) {
      res.status(401).json({ message: "Access Denied. No token provided." });
    }
  }

  async findAllAdmin() {
    return this.adminRepo.findAll();
  }

  async findOneAdmin(id: number) {
    try {
      const admin = await this.adminRepo.findByPk(id);

      if (!admin) {
        throw new BadRequestException("Admin not found");
      }
      return admin;
    } catch (error) {
      throw new BadRequestException("Admin not found");
    }
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto) {
    const admin1 = await this.adminRepo.findByPk(id);
    if (!admin1) {
      throw new BadRequestException(`There is no Admin with id ${id}`);
    }
    const admin = await this.adminRepo.update(updateAdminDto, {
      where: { id },
      returning: true,
    });
    return admin[1][0];
  }

  async removeAdmin(id: number): Promise<string> {
    try {
      const admin1 = await this.adminRepo.findByPk(id);
      if (!admin1) {
        throw new BadRequestException(`There is no Admin with id ${id}`);
      }
      await this.adminRepo.destroy({ where: { id } });
      return "Admin removed successfully";
    } catch (error) {
      throw new BadRequestException("error");
    }
  }
}

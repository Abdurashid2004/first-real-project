import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Res,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";

import { Response } from "express";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { CreatorGuard } from "../guards/creator.guard";
import { AdminGuard } from "../guards/admin.guard";
import { Admin } from "./entities/admin.entity";
import { CookieGetter } from "../decorators/cookie_getter.decorator";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(CreatorGuard)
  @ApiOperation({ summary: "Add Admin" })
  @ApiResponse({
    status: 200,
    description: "add admin",
    type: Admin,
  })
  @Post()
  create(
    @Body() createAdminDto: CreateAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminService.createAdmin(createAdminDto, res);
  }

  @ApiResponse({
    status: 200,
    description: "login admin",
    type: Admin,
  })
  @ApiOperation({ summary: "login Admin" })
  @HttpCode(200)
  @Post("login")
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminService.login(loginAdminDto, res);
  }

  @ApiResponse({
    status: 200,
    description: "logout admin",
    type: Admin, // Admin tipini import qiling yoki to'g'rilang
  })
  @ApiOperation({ summary: "logout Admin" })
  @HttpCode(200)
  @Post("logout/:id")
  @ApiParam({ name: "id", description: "Admin ID" })
  async logout(
    @CookieGetter("logout") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @Param("id") id: string
  ) {
    try {
      const result = await this.adminService.logout(refreshToken, res);
      return result;
    } catch (error) {
      console.error("Error during logout:", error);
      throw new HttpException(
        "Logout failed",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @ApiResponse({
    status: 200,
    description: "refresh admin",
    type: Admin,
  })
  @ApiOperation({ summary: "refresh Admin" })
  @HttpCode(200)
  @Post("refresh/:id")
  @ApiParam({ name: "id", description: "Admin ID" })
  refresh(
    @Param("id") id: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.adminService.refreshToken(id, refreshToken, res);
  }

  @ApiResponse({
    status: 200,
    description: "findAll admin",
    type: Admin,
  })
  @ApiOperation({ summary: "All takes Admin" })
  // @UseGuards(CreatorGuard)
  @Get()
  findAll() {
    return this.adminService.findAllAdmin();
  }

  @ApiOperation({ summary: "Find by Id Admin" })
  @ApiResponse({
    status: 200,
    description: "FindOne admin",
    type: Admin,
  })
  @UseGuards(AdminGuard)
  @ApiParam({ name: "id", description: "Admin ID" })
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.adminService.findOneAdmin(+id);
  }

  @UseGuards(CreatorGuard)
  @ApiOperation({ summary: "Update Admin" })
  @ApiParam({ name: "id", description: "Admin ID" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdmin(+id, updateAdminDto);
  }

  // @UseGuards(CreatorGuard)
  @ApiOperation({ summary: "Delete Admin" })
  @ApiParam({ name: "id", description: "Admin ID" })
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.adminService.removeAdmin(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Response } from "express";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { LoginClientDto } from "./dto/login-client.dto";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { UpdatePasswordAdminDto } from "./dto/updatePassword.dto";
import { CookieGetter } from "src/decorators/cookie_getter.decorator";
import { RegisterClientDto } from "./dto/regester-client.dto";
import { FindUserDto } from "./dto/find-user.dto";
import { Client } from "./model/client.entity";

@ApiTags("client")
@Controller("client")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post("newotp")
  @ApiOperation({ summary: "Generate a new OTP" })
  @ApiResponse({ status: 201, description: "OTP generated successfully." })
  @ApiResponse({ status: 400, description: "Bad request." })
  newOtp(@Body() createClientDto: CreateClientDto) {
    return this.clientService.otp(createClientDto);
  }

  @Post("checkOtp")
  @ApiOperation({ summary: "check an OTP" })
  @ApiResponse({ status: 200, description: "OTP checked successfully." })
  @ApiResponse({ status: 400, description: "Bad request." })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.clientService.checkOtp(verifyOtpDto);
  }

  @Post("register")
  @ApiOperation({ summary: "register client information" })
  @ApiResponse({
    status: 201,
    description: "Client information registered successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad request." })
  askinfo(
    @Body() registerClientDto: RegisterClientDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.clientService.register(registerClientDto, res);
  }

  @ApiOperation({ summary: "Client find phone and name" })
  @Post("search")
  findByParams(@Body() findUserDto: FindUserDto) {
    return this.clientService.findUSerByParams(findUserDto);
  }

  @HttpCode(200)
  @Post("login")
  @ApiOperation({ summary: "Client login" })
  @ApiResponse({ status: 200, description: "Client logged in successfully." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  login(
    @Body() loginclientDto: LoginClientDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.clientService.login(loginclientDto, res);
  }

  @Patch("password/:id")
  @ApiOperation({ summary: "Update password of an admin" })
  @ApiResponse({
    status: 200,
    description: "Admin password updated successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad request." })
  @ApiParam({ name: "id", required: true, description: "Admin ID" })
  updatePassword(
    @Param("id") id: number,
    @Body() updatePasswordDto: UpdatePasswordAdminDto
  ) {
    return this.clientService.updatePassword(+id, updatePasswordDto);
  }

  @Post("refresh/:id")
  @ApiOperation({ summary: "Refresh client token" })
  @ApiResponse({ status: 200, description: "Token refreshed successfully." })
  @ApiResponse({ status: 400, description: "Bad request." })
  @ApiParam({ name: "id", required: true, description: "Client ID" })
  @ApiCookieAuth()
  refreshToken(
    @Param("id") id: number,
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.clientService.refreshToken(+id, refreshToken, res);
  }

  @Post("logOut/:id")
  @ApiOperation({ summary: "Log out client" })
  @ApiResponse({ status: 200, description: "Client logged out successfully." })
  @ApiResponse({ status: 400, description: "Bad request." })
  @ApiParam({ name: "id", required: true, description: "Client ID" })
  @ApiCookieAuth()
  logOut(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.clientService.logOut(refreshToken, res);
  }

  @Get()
  @ApiOperation({ summary: "Find all clients" })
  @ApiResponse({ status: 200, description: "Clients retrieved successfully." })
  findAll() {
    return this.clientService.findAllClient();
  }

  @Get(":id")
  @ApiOperation({ summary: "Find one client" })
  @ApiResponse({ status: 200, description: "Client retrieved successfully." })
  @ApiResponse({ status: 404, description: "Client not found." })
  @ApiParam({ name: "id", required: true, description: "Client ID" })
  findOne(@Param("id") id: number) {
    return this.clientService.findOneClient(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a client" })
  @ApiResponse({ status: 200, description: "Client updated successfully." })
  @ApiResponse({ status: 400, description: "Bad request." })
  @ApiParam({ name: "id", required: true, description: "Client ID" })
  update(@Param("id") id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.updateClient(+id, updateClientDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove a client" })
  @ApiResponse({ status: 200, description: "Client removed successfully." })
  @ApiResponse({ status: 404, description: "Client not found." })
  @ApiParam({ name: "id", required: true, description: "Client ID" })
  remove(@Param("id") id: number) {
    return this.clientService.removeClient(+id);
  }

  // Admin add Client
  @ApiOperation({ summary: "Add Client By Admin" })
  @ApiResponse({
    status: 200,
    description: "add clietn by Admin",
    type: Client,
  })
  @Post()
  create(
    @Body() registerClientDto: RegisterClientDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.clientService.createClient(registerClientDto, res);
  }
}

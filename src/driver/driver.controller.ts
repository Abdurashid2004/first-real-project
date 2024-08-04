import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Put,
} from "@nestjs/common";
import { DriverService } from "./driver.service";
import { UpdateDriverDto } from "./dto/update-driver.dto";
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { Driver } from "./model/driver.entity";
import { LoginDriverDto } from "./dto/login-driver.dto";
import { Response } from "express";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { SummaDto } from "./dto/summa-driver.dto";
import { FindOrderDto } from "./dto/find-order.dto";
import { TaxiOrder } from "../taxi_order/model/taxi_order.model";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { RegisterDriverDto } from "./dto/register-driver.dto";
import { SendDriverDto } from "./dto/send-driver.dto";
import { CookieGetter } from "../decorators/cookie_getter.decorator";
import { CreateAdminDrivertDto } from "./dto/only-Admin-create.dto";

@ApiTags("driver")
@Controller("driver")
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post("newotp")
  @ApiOperation({ summary: "Generate a new OTP" })
  @ApiResponse({ status: 201, description: "OTP generated successfully." })
  @ApiResponse({ status: 400, description: "Bad request." })
  newOtp(@Body() sendDriverDto: SendDriverDto) {
    return this.driverService.otp(sendDriverDto);
  }

  @Post("checkOtp")
  @ApiOperation({ summary: "Check an OTP" })
  @ApiResponse({ status: 200, description: "OTP checked successfully." })
  @ApiResponse({ status: 400, description: "Bad request." })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.driverService.checkOtp(verifyOtpDto);
  }

  @Post("register")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "photo", maxCount: 1 },
      { name: "prava", maxCount: 1 },
    ])
  )
  @ApiOperation({ summary: "Register a new driver with photo and prava files" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: RegisterDriverDto })
  @ApiResponse({
    status: 201,
    description: "Driver registered successfully",
    type: Driver,
  })
  create(
    @Body() registerDriverDto: RegisterDriverDto,
    @UploadedFiles()
    files: { photo?: Express.Multer.File[]; prava?: Express.Multer.File[] },
    @Res({ passthrough: true }) res: Response
  ) {
    const photo = files.photo?.[0];
    const prava = files.prava?.[0];
    return this.driverService.register(registerDriverDto, photo, prava, res);
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
    return this.driverService.refreshToken(+id, refreshToken, res);
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
    return this.driverService.logOut(refreshToken, res);
  }

  @Post("login")
  @ApiOperation({ summary: "Login a driver" })
  @ApiResponse({
    status: 200,
    description: "Driver logged in successfully",
  })
  login(
    @Body() loginDriverDto: LoginDriverDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.driverService.login(loginDriverDto, res);
  }

  @Post("activate/:id")
  @ApiOperation({ summary: "Activate a driver" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Driver activated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Driver not found",
  })
  active(@Param("id") id: string) {
    return this.driverService.activeDriver(+id);
  }

  @Put("unactivate/:id")
  @ApiOperation({ summary: "Deactivate a driver" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Driver deactivated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Driver not found",
  })
  unactive(@Param("id") id: string) {
    return this.driverService.unactiveDriver(+id);
  }

  @Post("balance/:id")
  @ApiOperation({ summary: "Add balance to a driver's account" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Balance added successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Driver not found",
  })
  addBalance(@Param("id") id: string, @Body() summaDto: SummaDto) {
    return this.driverService.addMoney(+id, summaDto);
  }

  @Delete("balance/:id")
  @ApiOperation({ summary: "Remove balance from a driver's account" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Balance removed successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Driver not found",
  })
  removeBalance(@Param("id") id: string, @Body() summaDto: SummaDto) {
    return this.driverService.removeMoney(+id, summaDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all drivers" })
  @ApiResponse({
    status: 200,
    description: "Return all drivers",
    type: [Driver],
  })
  async getAllDrivers(@Query("search") search: any) {
    return this.driverService.findAll(search);
  }

  @Get("unactives")
  @ApiOperation({ summary: "Get all unactive drivers" })
  @ApiResponse({
    status: 200,
    description: "Return all unactive drivers",
    type: [Driver],
  })
  getUnActiveDriver() {
    return this.driverService.getUADrivers();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a driver by ID" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Return a driver by ID",
    type: Driver,
  })
  findOne(@Param("id") id: string) {
    return this.driverService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a driver" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Driver updated successfully",
    type: Driver,
  })
  update(@Param("id") id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(+id, updateDriverDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a driver" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Driver updated successfully",
    type: Driver,
  })
  updateDriver(
    @Param("id") id: string,
    @Body() updateDriverDto: UpdateDriverDto
  ) {
    return this.driverService.updateDriverByAdmin(+id, updateDriverDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a driver" })
  @ApiParam({ name: "id", description: "Driver ID" })
  @ApiResponse({
    status: 200,
    description: "Driver deleted successfully",
  })
  remove(@Param("id") id: string) {
    return this.driverService.remove(+id);
  }

  @Post("find-order")
  @ApiOperation({ summary: "Find orders based on 'from' and 'to' criteria" })
  @ApiResponse({
    status: 200,
    description: "Orders found successfully",
    type: [TaxiOrder],
  })
  async findOrder(@Body() findOrderDto: FindOrderDto) {
    return this.driverService.findOrder(findOrderDto);
  }
}

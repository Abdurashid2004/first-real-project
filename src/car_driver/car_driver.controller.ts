import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CarDriverService } from "./car_driver.service";
import { CreateCarDriverDto } from "./dto/create-car_driver.dto";
import { UpdateCarDriverDto } from "./dto/update-car_driver.dto";

@ApiTags("car-driver")
@Controller("car-driver")
export class CarDriverController {
  constructor(private readonly carDriverService: CarDriverService) {}

  @Post()
  @ApiOperation({ summary: "Create a new car driver" })
  @ApiResponse({
    status: 201,
    description: "The car driver has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  create(@Body() createCarDriverDto: CreateCarDriverDto) {
    return this.carDriverService.create(createCarDriverDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all car drivers" })
  @ApiResponse({ status: 200, description: "Return all car drivers." })
  findAll() {
    return this.carDriverService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a car driver by id" })
  @ApiResponse({ status: 200, description: "Return a car driver by id." })
  @ApiResponse({ status: 404, description: "Car driver not found." })
  findOne(@Param("id") id: string) {
    return this.carDriverService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a car driver by id" })
  @ApiResponse({
    status: 200,
    description: "The car driver has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "Car driver not found." })
  update(
    @Param("id") id: string,
    @Body() updateCarDriverDto: UpdateCarDriverDto
  ) {
    return this.carDriverService.update(+id, updateCarDriverDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove a car driver by id" })
  @ApiResponse({
    status: 200,
    description: "The car driver has been successfully removed.",
  })
  @ApiResponse({ status: 404, description: "Car driver not found." })
  remove(@Param("id") id: string) {
    return this.carDriverService.remove(+id);
  }
}

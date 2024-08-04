import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { CarsService } from "./car.service";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { Car } from "./model/car.entity";
import { AdminGuard } from "src/guards/admin.guard";

@ApiTags("Cars")
@Controller("car")
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  // @UseGuards(AdminGuard)
  @ApiOkResponse({ description: "Successfully created car", type: Car })
  @ApiBadRequestResponse({ description: "Invalid data provided" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiBody({ type: CreateCarDto })
  async create(@Body() createCarDto: CreateCarDto) {
    try {
      const result = await this.carsService.create(createCarDto);
      return result;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException("Failed to create car");
      }
    }
  }

  @Get()
  // @UseGuards(AdminGuard)
  @ApiOkResponse({ description: "Successfully retrieved cars", type: [Car] })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  async getCars() {
    return await this.carsService.findAllCars();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Successfully retrieved car", type: Car })
  @ApiNotFoundResponse({ description: "Car not found" })
  @ApiParam({ name: "id", description: "Car ID" })
  findOne(@Param("id") id: string) {
    return this.carsService.findOne(+id);
  }

  @Patch(":id")
  // @UseGuards(AdminGuard)
  @ApiOkResponse({ description: "Successfully updated car", type: Car })
  @ApiNotFoundResponse({ description: "Car not found" })
  @ApiBadRequestResponse({ description: "Invalid data provided" })
  @ApiParam({ name: "id", description: "Car ID" })
  @ApiBody({ type: UpdateCarDto })
  update(@Param("id") id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(+id, updateCarDto);
  }

  @Delete(":id")
  // @UseGuards(AdminGuard)
  @ApiOkResponse({ description: "Successfully deleted car" })
  @ApiNotFoundResponse({ description: "Car not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiParam({ name: "id", description: "Car ID" })
  remove(@Param("id") id: string) {
    return this.carsService.remove(+id);
  }
}

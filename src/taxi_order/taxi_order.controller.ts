import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { TaxiOrderService } from "./taxi_order.service";
import { CreateTaxiOrderDto } from "./dto/create-taxi_order.dto";
import { UpdateTaxiOrderDto } from "./dto/update-taxi_order.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
// import { AdminGuard } from "../guards/admin.guard";

@ApiTags("TaxiOrder")
@Controller("taxi-order")
export class TaxiOrderController {
  constructor(private readonly taxiOrderService: TaxiOrderService) {}

  @Post()
  @ApiOperation({ summary: "Create taxi order" })
  @ApiResponse({
    status: 201,
    description: "The taxi order has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  create(@Body() createTaxiOrderDto: CreateTaxiOrderDto) {
    return this.taxiOrderService.create(createTaxiOrderDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all taxi orders" })
  @ApiResponse({ status: 200, description: "Return all taxi orders." })
  findAll() {
    return this.taxiOrderService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get taxi order by ID" })
  @ApiResponse({ status: 200, description: "Return the taxi order by ID." })
  @ApiResponse({ status: 404, description: "Taxi order not found." })
  findOne(@Param("id") id: number) {
    return this.taxiOrderService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update taxi order by ID" })
  @ApiResponse({
    status: 200,
    description: "The taxi order has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "Taxi order not found." })
  update(
    @Param("id") id: number,
    @Body() updateTaxiOrderDto: UpdateTaxiOrderDto
  ) {
    return this.taxiOrderService.update(id, updateTaxiOrderDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete taxi order by ID" })
  @ApiResponse({
    status: 200,
    description: "The taxi order has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Taxi order not found." })
  remove(@Param("id") id: number) {
    return this.taxiOrderService.remove(id);
  }
}

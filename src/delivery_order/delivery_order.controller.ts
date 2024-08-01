import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { DeliveryOrderService } from "./delivery_order.service";
import { CreateDeliveryOrderDto } from "./dto/create-delivery_order.dto";
import { UpdateDeliveryOrderDto } from "./dto/update-delivery_order.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";


@ApiTags("Delivery-Order")
@Controller("delivery-order")
export class DeliveryOrderController {
  constructor(private readonly deliveryOrderService: DeliveryOrderService) {}

  @Post()
  @ApiOperation({ summary: "Create delivery order" })
  @ApiResponse({
    status: 201,
    description: "The delivery order has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  create(@Body() createDeliveryOrderDto: CreateDeliveryOrderDto) {
    return this.deliveryOrderService.create(createDeliveryOrderDto);
  }

  @Get()
  @ApiOperation({ summary: "Find all delivery orders" })
  @ApiResponse({ status: 200, description: "Return all delivery orders." })
  findAll() {
    return this.deliveryOrderService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Find one delivery order" })
  @ApiResponse({ status: 200, description: "Return one delivery order." })
  @ApiResponse({ status: 404, description: "Delivery order not found." })
  findOne(@Param("id") id: string) {
    return this.deliveryOrderService.findOne(+id);
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
    @Body() updateDeliveryOrderDto: UpdateDeliveryOrderDto
  ) {
    return this.deliveryOrderService.update(id, updateDeliveryOrderDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete delivery order" })
  @ApiResponse({
    status: 200,
    description: "The delivery order has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Delivery order not found." })
  remove(@Param("id") id: string) {
    return this.deliveryOrderService.remove(+id);
  }
}

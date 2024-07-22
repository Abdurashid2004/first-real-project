import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DeliveryOrderService } from "./delivery_order.service";
import { DeliveryOrder } from "./model/delivery_order.entity";
import { DeliveryOrderController } from "./delivery_order.controller";
import { Region } from "src/region/model/region.model";
import { District } from "src/districts/models/district.model";

@Module({
  imports: [SequelizeModule.forFeature([DeliveryOrder, Region, District])],
  providers: [DeliveryOrderService],
  exports: [DeliveryOrderService],
  controllers: [DeliveryOrderController],
})
export class DeliveryOrderModule {}

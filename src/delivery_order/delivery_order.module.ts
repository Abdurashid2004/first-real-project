import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DeliveryOrderService } from "./delivery_order.service";
import { DeliveryOrder } from "./model/delivery_order.entity";
import { DeliveryOrderController } from "./delivery_order.controller";
import { Region } from "../region/model/region.model";
import { District } from "../districts/models/district.model";
import { Client } from "../client/model/client.entity";
import { ClientModule } from "../client/client.module";

@Module({
  imports: [
    SequelizeModule.forFeature([DeliveryOrder, Region, District, Client]),
    ClientModule,
  ],
  providers: [DeliveryOrderService],
  exports: [DeliveryOrderService],
  controllers: [DeliveryOrderController],
})
export class DeliveryOrderModule {}

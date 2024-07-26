import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DeliveryOrderService } from "./delivery_order.service";
import { DeliveryOrder } from "./model/delivery_order.entity";
import { DeliveryOrderController } from "./delivery_order.controller";
import { Region } from "../region/model/region.model";
import { District } from "../districts/models/district.model";
import { Client } from "../client/model/client.entity";
import { ClientModule } from "../client/client.module";
import { DistrictsModule } from "../districts/districts.module";
import { Driver } from "../driver/model/driver.entity";
import { JwtModule } from "@nestjs/jwt";
import { DriverModule } from "../driver/driver.module"; // DriverModule ni import qilish

@Module({
  imports: [
    SequelizeModule.forFeature([
      DeliveryOrder,
      Region,
      District,
      Client,
      Driver,
    ]),
    ClientModule,
    DistrictsModule,
    DriverModule,
  ],
  providers: [DeliveryOrderService],
  controllers: [DeliveryOrderController],
  exports: [DeliveryOrderService],
})
export class DeliveryOrderModule {}

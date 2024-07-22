import { Module } from "@nestjs/common";
import { TaxiOrderService } from "./taxi_order.service";
import { TaxiOrderController } from "./taxi_order.controller";
import { TaxiOrder } from "./model/taxi_order.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";

import { Region } from "src/region/model/region.model";
import { District } from "src/districts/models/district.model";

@Module({
  imports: [
    SequelizeModule.forFeature([TaxiOrder, Region, District]),
    JwtModule.register({}),
  ],

  controllers: [TaxiOrderController],
  providers: [TaxiOrderService],
})
export class TaxiOrderModule {}

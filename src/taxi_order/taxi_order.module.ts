import { Module } from "@nestjs/common";
import { TaxiOrderService } from "./taxi_order.service";
import { TaxiOrderController } from "./taxi_order.controller";
import { TaxiOrder } from "./model/taxi_order.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";

import { Region } from "../region/model/region.model";
import { District } from "../districts/models/district.model";
import { ClientModule } from "../client/client.module";
import { DistrictsModule } from "../districts/districts.module";

@Module({
  imports: [
    SequelizeModule.forFeature([TaxiOrder, Region, District]),
    JwtModule.register({}),
    ClientModule,
    DistrictsModule
  ],

  controllers: [TaxiOrderController],
  providers: [TaxiOrderService],
})
export class TaxiOrderModule {}

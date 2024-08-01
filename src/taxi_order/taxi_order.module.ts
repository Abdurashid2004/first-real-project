import { Module } from "@nestjs/common";
import { TaxiOrderService } from "./taxi_order.service";
import { TaxiOrderController } from "./taxi_order.controller";
import { TaxiOrder } from "./model/taxi_order.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { Region } from "../region/model/region.model";
import { District } from "../districts/models/district.model";
import { ClientModule } from "../client/client.module";
import { DistrictsModule } from "../districts/districts.module";
import { Driver } from "../driver/model/driver.entity";
import { DriverModule } from "../driver/driver.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    SequelizeModule.forFeature([TaxiOrder, Region, District, Driver,]),
    JwtModule.register({}),
    ClientModule,
    DistrictsModule,
    DriverModule,
  ],

  controllers: [TaxiOrderController],
  providers: [TaxiOrderService],
})
export class TaxiOrderModule {}

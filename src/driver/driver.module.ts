import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";

import { DriverController } from "./driver.controller";
import { DriverService } from "./driver.service";
import { Driver } from "./model/driver.entity";
import { Region } from "../region/model/region.model";
import { TaxiOrder } from "../taxi_order/model/taxi_order.model";
import { Otp } from "../otp/model/otp.model";
import { DeliveryOrder } from "../delivery_order/model/delivery_order.entity";
import { Car } from "../car/model/car.entity";

import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { OtpModule } from "../otp/otp.module";
import { SmsModule } from "../sms/sms.module";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Driver,
      Region,
      TaxiOrder,
      Otp,
      DeliveryOrder,
      Car,
    ]),
    JwtModule.register({}),
    CloudinaryModule,
    OtpModule,
    SmsModule,
  ],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}

import { Module } from "@nestjs/common";
import { DriverService } from "./driver.service";
import { DriverController } from "./driver.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Driver } from "./model/driver.entity";
import { JwtModule } from "@nestjs/jwt";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { Region } from "../region/model/region.model";
import { TaxiOrder } from "../taxi_order/model/taxi_order.model";
import { OtpModule } from "../otp/otp.module";
import { SmsModule } from "../sms/sms.module";
import { Otp } from "../otp/model/otp.model";
import { DeliveryOrder } from "../delivery_order/model/delivery_order.entity";
import { Car } from "../car/model/car.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Driver, Region, TaxiOrder, Otp, DeliveryOrder, Car]),
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

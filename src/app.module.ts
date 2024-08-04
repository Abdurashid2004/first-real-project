import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { OtpModule } from "./otp/otp.module";
import { SmsModule } from "./sms/sms.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { ClientModule } from "./client/client.module";
import { AdminModule } from "./admin/admin.module";
import { RegionModule } from "./region/region.module";
import { DistrictsModule } from "./districts/districts.module";
import { TaxiOrderModule } from "./taxi_order/taxi_order.module";
import { DeliveryOrderModule } from "./delivery_order/delivery_order.module";
import { BalanceModule } from "./balance/balance.module";
import { DriverModule } from "./driver/driver.module";
import { CarModule } from "./car/car.module";
import { DatabaseService } from "./database.service";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),

    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [__dirname + "dist/**/*.entity{.ts,.js}"],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),

    CloudinaryModule,

    ClientModule,

    AdminModule,

    RegionModule,

    DistrictsModule,

    TaxiOrderModule,

    DeliveryOrderModule,

    BalanceModule,

    DriverModule,

    CarModule,

    OtpModule,

    SmsModule,
  ],

  controllers: [],

  providers: [DatabaseService],
})
export class AppModule {}

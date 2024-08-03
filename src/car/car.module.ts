import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Car } from "./model/car.entity";
import { JwtModule } from "@nestjs/jwt";
import { CarsController } from "./car.controller";
import { CarsService } from "./car.service";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { Driver } from "../driver/model/driver.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Car, Driver]),
    JwtModule.register({}),
    CloudinaryModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarModule {}

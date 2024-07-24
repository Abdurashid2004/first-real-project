import { Module } from "@nestjs/common";
import { CarDriverService } from "./car_driver.service";
import { CarDriverController } from "./car_driver.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { CarDriver } from "./model/car_driver.entity";
import { CarModule } from "../car/car.module";
import { DriverModule } from "../driver/driver.module";

@Module({
  imports: [SequelizeModule.forFeature([CarDriver]), CarModule, DriverModule],
  controllers: [CarDriverController],
  providers: [CarDriverService],
})
export class CarDriverModule {}

import { Module } from "@nestjs/common";
import { CarDriverService } from "./car_driver.service";
import { CarDriverController } from "./car_driver.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { CarDriver } from "./model/car_driver.entity";

@Module({
  imports: [SequelizeModule.forFeature([CarDriver])],
  controllers: [CarDriverController],
  providers: [CarDriverService],
})
export class CarDriverModule {}

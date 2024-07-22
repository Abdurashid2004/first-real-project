import { Module } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { BalanceController } from "./balance.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Balance } from "./model/balance.entity";
import { Driver } from "src/driver/model/driver.entity";

@Module({
  imports: [SequelizeModule.forFeature([Balance, Driver])],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}

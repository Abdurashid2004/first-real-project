import { Module } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { BalanceController } from "./balance.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Balance } from "./model/balance.entity";
import { Driver } from "src/driver/model/driver.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    SequelizeModule.forFeature([Balance, Driver]),
    JwtModule.register({}),
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}

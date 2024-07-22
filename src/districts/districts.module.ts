import { Module } from "@nestjs/common";
import { DistrictsService } from "./districts.service";
import { DistrictsController } from "./districts.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { District } from "./models/district.model";
import { JwtModule } from "@nestjs/jwt";
import { Region } from "../region/model/region.model";

@Module({
  imports: [
    SequelizeModule.forFeature([District, Region]),
    JwtModule.register({}),
  ],

  controllers: [DistrictsController],
  providers: [DistrictsService],
})
export class DistrictsModule {}

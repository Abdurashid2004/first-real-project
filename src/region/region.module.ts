import { Module } from "@nestjs/common";
import { RegionService } from "./region.service";
import { RegionController } from "./region.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Region } from "./model/region.model";
import { JwtModule } from "@nestjs/jwt";
import { District } from "../districts/models/district.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Region, District]),
    JwtModule.register({}),
  ],

  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}

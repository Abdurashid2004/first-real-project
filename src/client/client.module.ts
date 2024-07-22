import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { Client } from "./model/client.entity";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";
import { OtpModule } from "src/otp/otp.module";
import { SmsModule } from "src/sms/sms.module";
import { Otp } from "src/otp/model/otp.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Client, Otp]),
    JwtModule.register({}),
    OtpModule,
    SmsModule,
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}

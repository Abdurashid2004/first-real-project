// database.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    await this.syncDatabase();
  }

  private async syncDatabase() {
    try {
      await this.sequelize.sync({ force: false, alter: true }); // Set { alter: true } for migrations
      console.log("Models synchronized successfully.");
    } catch (error) {
      console.error("Error syncing models:", error);
    }
  }
}

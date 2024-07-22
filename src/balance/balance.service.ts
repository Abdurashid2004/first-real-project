import { Injectable } from "@nestjs/common";
import { CreateBalanceDto } from "./dto/create-balance.dto";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Balance } from "./model/balance.entity";
import { Driver } from "src/driver/model/driver.entity";

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance)
    private readonly balanceRepo: typeof Balance,
    @InjectModel(Driver)
    private readonly driverRepo: typeof Driver
  ) {}

  async create(createBalanceDto: CreateBalanceDto) {
    const { amount, driver_id } = createBalanceDto;
    const driver = await this.driverRepo.findByPk(driver_id);
    if (!driver) throw new Error("Driver not found");
    driver.total_balance += amount;
    return await this.balanceRepo.create(createBalanceDto);
  }

  findAll() {
    return this.balanceRepo.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} balance`;
  }

  update(id: number, updateBalanceDto: UpdateBalanceDto) {
    return `This action updates a #${id} balance`;
  }

  remove(id: number) {
    return `This action removes a #${id} balance`;
  }
}

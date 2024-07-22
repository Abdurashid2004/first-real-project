import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCarDriverDto } from "./dto/create-car_driver.dto";
import { UpdateCarDriverDto } from "./dto/update-car_driver.dto";
import { CarDriver } from "./model/car_driver.entity";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class CarDriverService {
  constructor(
    @InjectModel(CarDriver) private carDriverRepo: typeof CarDriver
  ) {}

  async create(createCarDriverDto: CreateCarDriverDto): Promise<CarDriver> {
    return this.carDriverRepo.create(createCarDriverDto);
  }

  async findAll(): Promise<CarDriver[]> {
    return await this.carDriverRepo.findAll();
  }

  async findOne(id: number): Promise<CarDriver> {
    const carDriver = await this.carDriverRepo.findByPk(id);
    if (!carDriver) {
      throw new NotFoundException(`CarDriver with ID ${id} not found`);
    }
    return carDriver;
  }

  async update(
    id: number,
    updateCarDriverDto: UpdateCarDriverDto
  ): Promise<CarDriver> {
    const carDriver = await this.carDriverRepo.findByPk(id);
    if (!carDriver) {
      throw new NotFoundException(`CarDriver with ID ${id} not found`);
    }

    return await this.carDriverRepo.create(carDriver);
  }

  async remove(id: number): Promise<void> {
    const result = await this.carDriverRepo.destroy({ where: { id } });
    if (result === 0) {
      throw new NotFoundException(`CarDriver with ID ${id} not found`);
    }
  }
}

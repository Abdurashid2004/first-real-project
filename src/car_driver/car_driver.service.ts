import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCarDriverDto } from "./dto/create-car_driver.dto";
import { UpdateCarDriverDto } from "./dto/update-car_driver.dto";
import { CarDriver } from "./model/car_driver.entity";
import { InjectModel } from "@nestjs/sequelize";
import { CarsService } from "../car/car.service";
import { DriverService } from "../driver/driver.service";

@Injectable()
export class CarDriverService {
  constructor(
    @InjectModel(CarDriver) private carDriverRepo: typeof CarDriver,
    private readonly carService: CarsService,
    private readonly driverService: DriverService
  ) {}

  async create(createCarDriverDto: CreateCarDriverDto): Promise<CarDriver> {
    const client = await this.carService.findOne(createCarDriverDto.car_id);

    if (!client) {
      throw new NotFoundException("Client with the given ID does not exist");
    }

    const client1 = await this.driverService.findOne(
      createCarDriverDto.driver_id
    );

    if (!client) {
      1;
      throw new NotFoundException("Client with the given ID does not exist");
    }
    return this.carDriverRepo.create(createCarDriverDto);
  }

  async findAll(): Promise<CarDriver[]> {
    return await this.carDriverRepo.findAll({ include: { all: true } });
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

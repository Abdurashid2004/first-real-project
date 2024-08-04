import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Car } from "./model/car.entity";
import { Driver } from "../driver/model/driver.entity";

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car) private readonly carRepo: typeof Car,
    @InjectModel(Driver) private readonly driverRepo: typeof Driver
  ) {}

  async create(createCarDto: CreateCarDto) {
    try {
      const newCar = await this.carRepo.create(createCarDto);
      return { message: "Car created successfully", car: newCar };
    } catch (error) {
      throw new BadRequestException("Failed to create car: " + error.message);
    }
  }

  async findAllCars(): Promise<Car[]> {
    return this.carRepo.findAll({
      include: [Driver],
    });
  }

  async findOne(id: number) {
    const car = await this.carRepo.findByPk(id, { include: { all: true } });
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.carRepo.findByPk(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    try {
      const updatedCar = await car.update(updateCarDto);
      return {
        message: `Car with ID ${id} updated successfully`,
        car: updatedCar,
      };
    } catch (error) {
      throw new BadRequestException("Failed to update car: " + error.message);
    }
  }

  async remove(id: number) {
    const rowsAffected = await this.carRepo.destroy({ where: { id } });
    if (rowsAffected === 0) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return { message: "Car deleted successfully" };
  }
}

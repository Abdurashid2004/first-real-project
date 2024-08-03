import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Car } from "./model/car.entity";
import { Driver } from "../driver/model/driver.entity";

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car) private readonly carRepo: typeof Car) {}

  async create(createCarDto: CreateCarDto) {
    try {
      const newCar = await this.carRepo.create(createCarDto);
      return { message: "Car created successfully", car: newCar };
    } catch (error) {
      return { message: "Failed to create car", error: error.message };
    }
  }

  async findAll() {
    return this.carRepo.findAll({
      include: [
        {
          model: Driver,
          through: { attributes: [] }, // Bu `through` jadvalidan faqat asosiy ma'lumotlarni olishni ta'minlaydi
        },
      ],
    });
  }

  async findOne(id: number) {
    const car = await this.carRepo.findByPk(id, { include: { all: true } });
    if (!car) {
      throw new NotFoundException("car not found");
    }
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.carRepo.findByPk(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    const updateCar = await car.update(updateCarDto);

    return {
      message: `Car with ID ${id} updated successfully`,
      car: updateCar,
    };
  }

  async remove(id: number) {
    const rowsAffected = await this.carRepo.destroy({ where: { id } });
    if (rowsAffected === 0) {
      throw new NotFoundException("Car not found");
    }
    return { message: "Deleted Car" };
  }
}

import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
} from "sequelize-typescript";
import { Driver } from "../../driver/model/driver.entity";
import { CarDriver } from "../../car_driver/model/car_driver.entity";

@Table({ tableName: "cars" })
export class Car extends Model<Car> {
  @ApiProperty({
    example: "1",
    description: "The unique identifier for the car",
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: "ABC123",
    description: "The number plate of the car",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  car_number: string;

  @ApiProperty({
    example: "Nexia",
    description: "The car model",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: string;

  @ApiProperty({
    example: "Red",
    description: "The color of the car",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  color: string;

  @ApiProperty({
    example: "texi",
    description: "The type of the car",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  car_type: string;

  @ApiProperty({
    example: "photo",
    description: "The photo of the car's Tex Passport",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tex_passport: string;

  @BelongsToMany(() => Driver, () => CarDriver)
  drivers: Driver[];
}

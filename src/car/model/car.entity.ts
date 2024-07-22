import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { CarDriver } from "../../car_driver/model/car_driver.entity";

interface ICarCreationAttr {
  car_number: string;
  model: string;
  color: string;
  photo: string;
  car_type: string;
  tex_passport: string;
}

@Table({ tableName: "cars" })
export class Car extends Model<Car, ICarCreationAttr> {
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
    example: "photo",
    description: "The photo of the car",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  photo: string;

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

  @HasMany(() => CarDriver)
  drivers: CarDriver[];
}

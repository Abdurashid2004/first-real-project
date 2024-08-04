import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Driver } from "../../driver/model/driver.entity";

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

  @ForeignKey(() => Driver)
  @ApiProperty({
    example: "1",
    description: "Driver ID",
  })
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  driverId: number;

  @BelongsTo(() => Driver)
  drivers: Driver;
}

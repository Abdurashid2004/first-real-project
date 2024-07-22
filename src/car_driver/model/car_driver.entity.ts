import { ApiProperty } from "@nestjs/swagger";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Driver } from "../../driver/model/driver.entity";
import { Car } from "../../car/model/car.entity";

export interface ICarDriver {
  driver_id: number;
  car_id: number;
}
@Table({ tableName: "Cardriver" })
export class CarDriver extends Model<CarDriver, ICarDriver> {
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the client",
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Driver)
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the client",
  })
  @Column({
    type: DataType.INTEGER,
  })
  driver_id: number;

  @ForeignKey(() => Car)
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the client",
  })
  @Column({
    type: DataType.INTEGER,
  })
  car_id: number;

  @BelongsTo(() => Driver)
  drivers: Driver;

  @BelongsTo(() => Car)
  cars: Car;
}

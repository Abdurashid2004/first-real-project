import {
  Column,
  Model,
  Table,
  DataType,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Balance } from "../../balance/model/balance.entity";
import { CarDriver } from "../../car_driver/model/car_driver.entity";
import { DeliveryOrder } from "../../delivery_order/model/delivery_order.entity";
import { TaxiOrder } from "src/taxi_order/model/taxi_order.model";

export interface IDriverAttr {
  name: string;
  surname: string;
  age: number;
  phone: string;
  photo: string;
  passport: string;
  prava: string;
  total_balance: number;
  password: string;
  isActive: boolean;
  hashed_password: string;
}

@Table({ tableName: "drivers" })
export class Driver extends Model<Driver, IDriverAttr> {
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the driver",
  })
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: "John", description: "The first name of the driver" })
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  name: string;

  @ApiProperty({ example: "Doe", description: "The last name of the driver" })
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  surname: string;

  @ApiProperty({ example: 30, description: "The age of the driver" })
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  age: number;

  @ApiProperty({
    example: "+123456789",
    description: "The phone number of the driver",
  })
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  phone: string;

  @ApiProperty({ example: "photo.jpg", description: "The photo of the driver" })
  @Column({
    type: DataType.STRING,
  })
  photo: string;

  @ApiProperty({
    example: "A1234567",
    description: "The passport number of the driver",
  })
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  passport: string;

  @ApiProperty({
    example: "B1234567",
    description: "The driving license number of the driver",
  })
  @Column({
    type: DataType.STRING,
  })
  prava: string;

  @ApiProperty({
    example: 1000,
    description: "The total balance of the driver",
  })
  @Column({
    type: DataType.DECIMAL(10, 2),
    // allowNull: false,
    defaultValue: 0,
  })
  total_balance: number;

  @ApiProperty({
    example: true,
    description: "The active status of the driver",
  })
  @Column({
    type: DataType.BOOLEAN,
    // allowNull: false,
    defaultValue: false,
  })
  isActive: boolean;

  @ApiProperty({
    example: "0594grjoitjrgijgrjjfrb",
    description: "hashed refresh token for driver",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @HasOne(() => Balance)
  balance: Balance;

  @HasMany(() => CarDriver)
  cars: CarDriver[];

  @HasMany(() => DeliveryOrder)
  deliveryOrders: DeliveryOrder[];

  @HasMany(() => TaxiOrder, { foreignKey: "driverId" })
  taxiOrders: TaxiOrder[];
}

import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { District } from "../../districts/models/district.model";
import { Client } from "../../client/model/client.entity";
import { Driver } from "../../driver/model/driver.entity";

interface ICreateTaxiOrderAttr {
  distance?: string;
  duration?: string;
  from_distinct_id: number;
  to_distinct_id: number;
  description: string;
  date: string;
  location_start: string;
  clientId: number;
  driverId: number;
  count: number;
  price: number;
  status: string;
}

@Table({ tableName: "taxiorder", createdAt: false, updatedAt: false })
export class TaxiOrder extends Model<TaxiOrder, ICreateTaxiOrderAttr> {
  @ApiProperty({
    example: 1,
    description: "Unique taxi order ID",
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: "A trip from downtown to airport",
    description: "Description of the taxi order",
  })
  @Column({
    type: DataType.STRING,
  })
  description: string;

  @ApiProperty({
    example: "2024-07-13T12:34:56Z",
    description: "Date and time of the taxi order",
  })
  @Column({
    type: DataType.STRING,
  })
  date: string;

  @ApiProperty({
    description: "Taksi buyurtmasining hozirgi holati",
    example: "In Progress",
  })
  @Column({
    type: DataType.STRING,
  })
  status: string;

  @ForeignKey(() => District)
  @ApiProperty({ example: 1, description: "Taxi order Id unique" })
  @Column({ type: DataType.INTEGER })
  from_distinct_id: number;

  @ForeignKey(() => District)
  @ApiProperty({ example: 1, description: "Taxi order Id unique" })
  @Column({ type: DataType.INTEGER })
  to_distinct_id: number;

  @ForeignKey(() => Client)
  @ApiProperty({ example: 1, description: "Taxi order Id unique" })
  @Column({ type: DataType.INTEGER })
  clientId: number;

  @ForeignKey(() => Driver)
  @ApiProperty({ example: 1, description: "Taxi order Id unique" })
  @Column({ type: DataType.INTEGER })
  driverId: number;

  @ApiProperty({
    example: "40.712776, -74.005974",
    description: "Starting location coordinates",
  })
  @Column({
    type: DataType.STRING,
  })
  location_start: string;

  @ApiProperty({
    example: "2",
    description: "Taxi order count",
  })
  @Column({
    type: DataType.INTEGER,
  })
  count: number;

  @ApiProperty({
    example: "5000",
    description: "Taxi order price",
  })
  @Column({
    type: DataType.DECIMAL,
  })
  price: number;

  @ApiProperty({ example: 1, description: "Taxi order distance " })
  @Column({ type: DataType.STRING })
  distance: string;

  @ApiProperty({ example: 1, description: "Taxi order duration " })
  @Column({ type: DataType.STRING })
  duration: string;

  @BelongsTo(() => District, {
    as: "fromDistrict",
    foreignKey: "from_distinct_id",
  })
  fromDistrict: District;

  @BelongsTo(() => District, { as: "toDistrict", foreignKey: "to_distinct_id" })
  toDistrict: District;

  @BelongsTo(() => Client, { as: "client", foreignKey: "clientId" })
  client: Client;

  @BelongsTo(() => Driver, { as: "driver", foreignKey: "driverId" })
  driver: Driver;
}

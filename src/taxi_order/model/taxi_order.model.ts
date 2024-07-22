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

interface ICreateTaxiOrderAttr {
  distance: string;
  duration: string;
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

  @ApiProperty({
    example: "40.712776, -74.005974",
    description: "Starting location coordinates",
  })
  @Column({
    type: DataType.STRING,
  })
  location_start: string;

  @ApiProperty({ example: 1, description: "Taxi order distance " })
  @Column({ type: DataType.STRING })
  distance: string;

  @ApiProperty({ example: 1, description: "Taxi order duration " })
  @Column({ type: DataType.STRING })
  duration: string;

  @BelongsTo(() => Client)
  clients: Client;

  @BelongsTo(() => District, { as: "fromDistrict" })
  fromdistrict: District;

  @BelongsTo(() => District, { as: "toDistrict" })
  toDistrict: District;
}

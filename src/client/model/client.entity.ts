import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { DeliveryOrder } from "../../delivery_order/model/delivery_order.entity";
import { TaxiOrder } from "../../taxi_order/model/taxi_order.model";

interface IClientAttr {
  name: string;
  phone: string;
  hashed_password: string;
  is_active: boolean;
}

@Table({ tableName: "client" })
export class Client extends Model<Client, IClientAttr> {
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

  @ApiProperty({
    example: "+123456789",
    description: "The phone number of the client",
  })
  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @ApiProperty({
    example: "John",
    description: "The phone number of the client",
  })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({
    example: "hashed_password",
    description: "The hashed password of the client",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({
    example: true,
    description: "Whether the client is active",
    default: false,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({
    example: "hashed_refresh_token",
    description: "The hashed refresh token of the client",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @HasMany(() => DeliveryOrder)
  deliveryOrders: DeliveryOrder[];

  @HasMany(() => TaxiOrder)
  taxiOrders: TaxiOrder[];
}

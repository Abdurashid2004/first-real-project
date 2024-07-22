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
import { Region } from "../../region/model/region.model";
import { TaxiOrder } from "../../taxi_order/model/taxi_order.model";
import { DeliveryOrder } from "../../delivery_order/model/delivery_order.entity";

interface ICreateDistrictAttr {
  name: string;
}

@Table({ tableName: "district", createdAt: false, updatedAt: false })
export class District extends Model<District, ICreateDistrictAttr> {
  @ApiProperty({
    example: 1,
    description: " ID unikal raqami",
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Yashnaobod", description: "District name" })
  @Column({ type: DataType.STRING })
  name: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  region_id: number;

  @BelongsTo(() => Region)
  regions: Region;

  @HasMany(() => TaxiOrder)
  taxiOrders: TaxiOrder;

  @HasMany(() => DeliveryOrder)
  deliveryOrders: DeliveryOrder;
}

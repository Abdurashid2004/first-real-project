import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Driver } from "../../driver/model/driver.entity";

interface ICreateBalanceAttr {
  amount: number;
  driverId: number;
}

@Table({ tableName: "balance" })
export class Balance extends Model<Balance, ICreateBalanceAttr> {
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  amount: number;

  @ForeignKey(() => Driver) // ForeignKey decorator orqali Driver modelga bog'lanamiz
  @Column({ type: DataType.INTEGER, allowNull: false })
  driverId: number;

  @BelongsTo(() => Driver)
  driver: Driver;
}

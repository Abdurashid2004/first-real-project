import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IOtpInterface {
  id: string;
  otp: string;
  expiration_time: Date;
  verified: boolean;
  check: string;
}

@Table({ tableName: 'otp' })
export class Otp extends Model<Otp> implements IOtpInterface {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  otp: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiration_time: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  verified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  check: string;
}

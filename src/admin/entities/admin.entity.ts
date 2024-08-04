import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IadminAttr {
  login: string;
  tg_link: string;
  photo: string;
  password: string;
  is_active: boolean;
}

@Table({ tableName: "admin" })
export class Admin extends Model<Admin, IadminAttr> {
  @ApiProperty({ example: "1", description: "admin ID uniqe number" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "login", description: "admin login" })
  @Column({
    type: DataType.STRING,
  })
  login: string;

  @ApiProperty({ example: "admin@tg_link", description: "admin tg_link" })
  @Column({
    type: DataType.STRING,
  })
  tg_link: string;

  @ApiProperty({
    example: "hashed_password",
    description: "admin hashed_password",
  })
  @Column({
    type: DataType.STRING,
  })
  password: string;

  @ApiProperty({ example: "is_active", description: "admin is_active" })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({ example: "is_creator", description: "admin is_creator" })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_creator: boolean;

  @ApiProperty({
    example: "hashed_refresh_token",
    description: "admin hashed_refresh_token",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;
}

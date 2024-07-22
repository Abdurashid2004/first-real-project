import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { District } from "../../districts/models/district.model";

interface RegionCreationAttrs {
  name: string;
}

@Table({ tableName: "regions" })
export class Region extends Model<Region, RegionCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: "The unique identifier of the region",
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "Central", description: "The name of the region" })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => District)
  districts: District[];
}

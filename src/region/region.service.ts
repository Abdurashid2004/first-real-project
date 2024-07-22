import { Injectable } from "@nestjs/common";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { Region } from "./model/region.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class RegionService {
  constructor(@InjectModel(Region) private regionRepo: typeof Region) {}

  create(createRegionDto: CreateRegionDto) {
    return this.regionRepo.create(createRegionDto);
  }

  findAll() {
    return this.regionRepo.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.regionRepo.findByPk(id);
  }

  update(id: number, updateRegionDto: UpdateRegionDto) {
    return this.regionRepo.update(updateRegionDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.regionRepo.destroy({ where: { id } });
  }
}

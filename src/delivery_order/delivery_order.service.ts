import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import axios from "axios";

import { UpdateDeliveryOrderDto } from "./dto/update-delivery_order.dto";
import { DeliveryOrder } from "./model/delivery_order.entity";
import { CreateDeliveryOrderDto } from "./dto/create-delivery_order.dto";
import { Region } from "src/region/model/region.model";
import { District } from "../districts/models/district.model";

@Injectable()
export class DeliveryOrderService {
  constructor(
    @InjectModel(DeliveryOrder)
    private readonly deliveryOrderModel: typeof DeliveryOrder,
    @InjectModel(Region)
    private readonly regionModel: typeof Region,
    @InjectModel(District)
    private readonly discritModel: typeof District
  ) {}

  private async getCoordinates(
    name: string
  ): Promise<{ latitude: number; longitude: number }> {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${name}&format=json&apiKey=0e7cd19cff5e4d6d9163ec21225512f3`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        throw new Error("No coordinates found for the given name");
      }

      const { lat: latitude, lon: longitude } = data.results[0];
      return { latitude, longitude };
    } catch (error) {
      console.error(error);
      throw new Error(`Error retrieving coordinates: ${error.message}`);
    }
  }

  async create(createDeliveryOrderDto: CreateDeliveryOrderDto) {
    try {
      const { from_district_id, to_district_id } = createDeliveryOrderDto;

      const DiscritFrom = await this.discritModel.findByPk(from_district_id);

      const toDiscrit = await this.discritModel.findByPk(to_district_id);
      DiscritFrom.region_id;

      const RegionFrom = await this.regionModel.findByPk(DiscritFrom.region_id);
      const toRegion = await this.regionModel.findByPk(toDiscrit.region_id);

      const fromCoordinates = await this.getCoordinates(RegionFrom.name);
      const toCoordinates = await this.getCoordinates(toRegion.name);

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`,
        {
          params: {
            origins: `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
            destinations: `${toCoordinates.latitude},${toCoordinates.longitude}`,
            key: process.env.GOOGLE_API_KEY,
          },
        }
      );

      if (response.data.status !== "OK") {
        throw new Error("Error fetching distance data from Google Maps API");
      }

      const distance = response.data.rows[0].elements[0].distance.text;
      const duration = response.data.rows[0].elements[0].duration.text;

      await this.deliveryOrderModel.create({
        distance,
        duration,
        ...createDeliveryOrderDto,
      });
      return "Ok";
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      throw new InternalServerErrorException("Failed to create delivery order");
    }
  }

  async findAll(): Promise<DeliveryOrder[]> {
    return await this.deliveryOrderModel.findAll({ include: { all: true } });
  }

  async findOne(id: number): Promise<DeliveryOrder> {
    const deliveryOrder = await this.deliveryOrderModel.findByPk(id, {
      include: { all: true },
    });
    if (!deliveryOrder) {
      throw new NotFoundException(`DeliveryOrder with id ${id} not found`);
    }
    return deliveryOrder;
  }

  async update(
    id: number,
    updateDeliveryOrderDto: UpdateDeliveryOrderDto
  ): Promise<DeliveryOrder> {
    const deliveryOrder = await this.findOne(id);
    await deliveryOrder.update(updateDeliveryOrderDto);
    return deliveryOrder;
  }

  async remove(id: number): Promise<void> {
    const deliveryOrder = await this.findOne(id);
    await deliveryOrder.destroy();
  }
}

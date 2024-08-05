import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateTaxiOrderDto } from "./dto/create-taxi_order.dto";
import { UpdateTaxiOrderDto } from "./dto/update-taxi_order.dto";
import { TaxiOrder } from "./model/taxi_order.model";
import { InjectModel } from "@nestjs/sequelize";
import { Region } from "../region/model/region.model";
import { District } from "../districts/models/district.model";
import axios from "axios";
import { ClientService } from "../client/client.service";
import { DistrictsService } from "../districts/districts.service";
import { DriverService } from "../driver/driver.service";
import { Client } from "src/client/model/client.entity";
import { Driver } from "src/driver/model/driver.entity";

@Injectable()
export class TaxiOrderService {
  constructor(
    @InjectModel(TaxiOrder) private taxiOrderRepo: typeof TaxiOrder,

    @InjectModel(Region)
    private readonly regionModel: typeof Region,
    @InjectModel(District)
    private readonly districtModel: typeof District,
    private readonly clientService: ClientService,
    private readonly driverService: DriverService,
    private readonly districtService: DistrictsService
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

  private async getDistanceAndDuration(
    fromCoordinates: { latitude: number; longitude: number },
    toCoordinates: { latitude: number; longitude: number }
  ): Promise<{ distance: string; duration: string }> {
    try {
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
      console.log(distance, duration, "salom");

      return { distance, duration };
    } catch (error) {
      console.error(error);
      throw new Error(`Error retrieving distance data: ${error.message}`);
    }
  }

  async create(createTaxiOrderDto: CreateTaxiOrderDto) {
    try {
      const { from_distinct_id, to_distinct_id, clientId} =
        createTaxiOrderDto;

      const client = await this.clientService.findOneClient(clientId);
      if (!client) {
        throw new NotFoundException("Client with the given ID does not exist");
      }

      const districtFrom =
        await this.districtService.findOneAdmin(from_distinct_id);
      if (!districtFrom) {
        throw new NotFoundException(
          "District_from with the given ID does not exist"
        );
      }

      const districtTo =
        await this.districtService.findOneAdmin(to_distinct_id);
      if (!districtTo) {
        throw new NotFoundException("District_to with given ID does not exist");
      }

      const fromRegion = await this.regionModel.findByPk(
        districtFrom.region_id
      );
      if (!fromRegion) {
        throw new NotFoundException(
          "Region for the given District_from ID does not exist"
        );
      }

      const toRegion = await this.regionModel.findByPk(districtTo.region_id);
      if (!toRegion) {
        throw new NotFoundException(
          "Region for the given District_to ID does not exist"
        );
      }

      const fromCoordinates = await this.getCoordinates(fromRegion.name);
      const toCoordinates = await this.getCoordinates(toRegion.name);

      const { distance, duration } = await this.getDistanceAndDuration(
        fromCoordinates,
        toCoordinates
      );

      const taxiOrder = await this.taxiOrderRepo.create({
        distance,
        duration,
        ...createTaxiOrderDto,
      });

      return taxiOrder;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create taxi order");
    }
  }

  async findAll() {
    return this.taxiOrderRepo.findAll({
      include: [
        { model: this.districtModel, as: "fromDistrict" },
        { model: this.districtModel, as: "toDistrict" },
        { model: Client, as: "client" },
        { model: Driver, as: "driver" },
      ],
    });
  }

  findOne(id: number) {
    return this.taxiOrderRepo.findByPk(id, {
      include: [
        { model: District, as: "fromDistrict" },
        { model: District, as: "toDistrict" },
        { model: Client, as: "client" },
        { model: Driver, as: "driver" },
      ],
    });
  }

  async update(id: number, updateTaxiOrderDto: UpdateTaxiOrderDto) {
    const [affectedCount, [updatedOrder]] = await this.taxiOrderRepo.update(
      { status: updateTaxiOrderDto.status },
      { where: { id }, returning: true }
    );

    if (affectedCount === 0) {
      throw new NotFoundException("Order not found or status not updated");
    }

    return updatedOrder;
  }

  remove(id: number) {
    return this.taxiOrderRepo.destroy({ where: { id } });
  }
}

// <temp>
  
//   <Auth>
// </Auth>
// </temp>
// ------


// < tes >
//   <h1>sCxlaom</h1>
  
//   <slot></slot>
//   <tes/>
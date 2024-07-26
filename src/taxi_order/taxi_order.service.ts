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

@Injectable()
export class TaxiOrderService {
  constructor(
    @InjectModel(TaxiOrder) private taxiOrderRepo: typeof TaxiOrder,
    @InjectModel(Region)
    private readonly regionModel: typeof Region,
    @InjectModel(District)
    private readonly discritModel: typeof District,
    private readonly clientsevice: ClientService,
    private readonly disrtictService: DistrictsService,
    private readonly driverService: DriverService
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

  async create(CreateTaxiOrderDto: CreateTaxiOrderDto) {
    try {
      const { from_distinct_id, to_distinct_id } = CreateTaxiOrderDto;

      const client = await this.clientsevice.findOneClient(
        CreateTaxiOrderDto.clientId
      );

      if (!client) {
        throw new NotFoundException("Client with the given ID does not exist");
      }

      const district_from = await this.disrtictService.findOneAdmin(
        CreateTaxiOrderDto.from_distinct_id
      );

      if (!district_from) {
        throw new NotFoundException(
          "District_from with the given ID does not exist"
        );
      }

      const district_from2 = await this.disrtictService.findOneClient(
        CreateTaxiOrderDto.from_distinct_id
      );

      if (!district_from2) {
        throw new NotFoundException(
          "District_from with the given ID does not exist"
        );
      }

      const district_from3 = await this.disrtictService.findOneDriver(
        CreateTaxiOrderDto.from_distinct_id
      );

      if (!district_from3) {
        throw new NotFoundException(
          "District_from with the given ID does not exist"
        );
      }

      const district_to = await this.disrtictService.findOneAdmin(
        CreateTaxiOrderDto.to_distinct_id
      );

      if (!district_to) {
        throw new NotFoundException(
          "District_to with the given ID does not exist"
        );
      }

      const district_to2 = await this.disrtictService.findOneClient(
        CreateTaxiOrderDto.to_distinct_id
      );

      if (!district_to2) {
        throw new NotFoundException(
          "District_to with the given ID does not exist"
        );
      }

      const district_to3 = await this.disrtictService.findOneDriver(
        CreateTaxiOrderDto.to_distinct_id
      );

      if (!district_to3) {
        throw new NotFoundException(
          "District_to with the given ID does not exist"
        );
      }

      const driver = await this.driverService.findOne(
        CreateTaxiOrderDto.driverId
      );

      if (!driver) {
        throw new NotFoundException("Driver with the given ID does not exist");
      }

      // Fetch districts
      const fromDistrict = await this.discritModel.findByPk(from_distinct_id);
      const toDistrict = await this.discritModel.findByPk(to_distinct_id);

      if (!fromDistrict || !toDistrict) {
        throw new Error("Invalid district ID(s) provided.");
      }

      // Fetch regions
      const fromRegion = await this.regionModel.findByPk(
        fromDistrict.region_id
      );
      const toRegion = await this.regionModel.findByPk(toDistrict.region_id);

      if (!fromRegion || !toRegion) {
        throw new Error("Regions not found for the provided district IDs.");
      }

      // Get coordinates for the regions
      const fromCoordinates = await this.getCoordinates(fromRegion.name);
      const toCoordinates = await this.getCoordinates(toRegion.name);

      // Fetch distance and duration from Google Maps API
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

      // Create the taxi order
      const taxiOrder = await this.taxiOrderRepo.create({
        distance,
        duration,
        ...CreateTaxiOrderDto,
      });

      return taxiOrder;
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      throw new InternalServerErrorException("Failed to create taxi order");
    }
  }

  async findAll() {
    return this.taxiOrderRepo.findAll({
      include: [
        { model: this.discritModel, as: "fromDistrict" },
        { model: this.discritModel, as: "toDistrict" },
      ],
    });
  }

  findOne(id: number) {
    return this.taxiOrderRepo.findByPk(id, {
      include: [
        { model: District, as: "fromDistrict" },
        { model: District, as: "toDistrict" },
      ],
    });
  }

  update(id: number, updateTaxiOrderDto: UpdateTaxiOrderDto) {
    return this.taxiOrderRepo.update(updateTaxiOrderDto, {
      where: { id },
      returning: true,
    });
  }

  remove(id: number) {
    return this.taxiOrderRepo.destroy({ where: { id } });
  }
}

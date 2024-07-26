import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { DistrictsService } from "./districts.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { District } from "./models/district.model";
import { AdminGuard } from "src/guards/admin.guard";
import { ClientGuard } from "src/guards/client.guard";
import { DriverGuard } from "src/guards/driver.guard";
import { ClientSelfGuard } from "src/guards/client.self.guard";
import { DriverSelfGuard } from "src/guards/driver.self.guard";
import { AdminSelfGuard } from "src/guards/admin.self.guard";

@ApiTags("District")
@Controller("districts")
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Create a new district" })
  @ApiBody({ type: CreateDistrictDto })
  @ApiResponse({
    status: 201,
    description: "The district has been successfully created.",
    type: District,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @Get()
  // @UseGuards(ClientGuard)
  @ApiOperation({ summary: "Get all districts" })
  @ApiResponse({
    status: 200,
    description: "Return all districts",
    type: [District],
  })
  findAllClient() {
    return this.districtsService.findAllClient();
  }

  @Get()
  // @UseGuards(DriverGuard)
  @ApiOperation({ summary: "Get all districts" })
  @ApiResponse({
    status: 200,
    description: "Return all districts",
    type: [District],
  })
  findAllDriver() {
    return this.districtsService.findAllDriver();
  }

  @Get()
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get all districts" })
  @ApiResponse({
    status: 200,
    description: "Return all districts",
    type: [District],
  })
  findAllAdmin() {
    return this.districtsService.findAllAdmin();
  }

  @Get(":id")
  // @UseGuards(ClientSelfGuard)
  @ApiOperation({ summary: "Get a district by ID" })
  @ApiParam({ name: "id", description: "The ID of the district" })
  @ApiResponse({
    status: 200,
    description: "Return the district with the specified ID",
    type: District,
  })
  @ApiResponse({ status: 404, description: "District not found" })
  findOneClient(@Param("id") id: number) {
    return this.districtsService.findOneClient(id);
  }

  @Get(":id")
  // @UseGuards(DriverSelfGuard)
  @ApiOperation({ summary: "Get a district by ID" })
  @ApiParam({ name: "id", description: "The ID of the district" })
  @ApiResponse({
    status: 200,
    description: "Return the district with the specified ID",
    type: District,
  })
  @ApiResponse({ status: 404, description: "District not found" })
  findOneDriver(@Param("id") id: number) {
    return this.districtsService.findOneDriver(+id);
  }

  @Get(":id")
  // @UseGuards(AdminSelfGuard)
  @ApiOperation({ summary: "Get a district by ID" })
  @ApiParam({ name: "id", description: "The ID of the district" })
  @ApiResponse({
    status: 200,
    description: "Return the district with the specified ID",
    type: District,
  })
  @ApiResponse({ status: 404, description: "District not found" })
  findOneAdmin(@Param("id") id: number) {
    return this.districtsService.findOneAdmin(+id);
  }

  @Patch(":id")
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Update a district by ID" })
  @ApiParam({ name: "id", description: "The ID of the district" })
  @ApiBody({ type: UpdateDistrictDto })
  @ApiResponse({
    status: 200,
    description: "The district has been successfully updated.",
    type: District,
  })
  @ApiResponse({ status: 404, description: "District not found" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  update(
    @Param("id") id: string,
    @Body() updateDistrictDto: UpdateDistrictDto
  ) {
    return this.districtsService.update(+id, updateDistrictDto);
  }

  @Delete(":id")
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Delete a district by ID" })
  @ApiParam({ name: "id", description: "The ID of the district" })
  @ApiResponse({
    status: 200,
    description: "The district has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "District not found" })
  remove(@Param("id") id: string) {
    return this.districtsService.remove(+id);
  }
}

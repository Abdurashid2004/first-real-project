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
import { RegionService } from "./region.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AdminGuard } from "../guards/admin.guard";
import { ClientSelfGuard } from "../guards/client.self.guard";
import { ClientGuard } from "../guards/client.guard";
import { DriverSelfGuard } from "../guards/driver.self.guard";
import { DriverGuard } from "../guards/driver.guard";
import { AdminSelfGuard } from "../guards/admin.self.guard";

@ApiTags("regions")
@ApiBearerAuth()
@Controller("region")
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Create a new region" })
  @ApiResponse({
    status: 201,
    description: "The region has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  // @UseGuards(ClientGuard)
  @ApiOperation({ summary: "Get all regions for clients" })
  @ApiResponse({ status: 200, description: "Return all regions for clients." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findAllClient() {
    return this.regionService.findAllClient();
  }

  @Get()
  // @UseGuards(DriverGuard)
  @ApiOperation({ summary: "Get all regions for drivers" })
  @ApiResponse({ status: 200, description: "Return all regions for drivers." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findAllDriver() {
    return this.regionService.findAllDriver();
  }

  @Get()
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get all regions for admin" })
  @ApiResponse({ status: 200, description: "Return all regions for admin." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findAllAdmin() {
    return this.regionService.findAllAdmin();
  }

  @Get(":id")
  // @UseGuards(ClientSelfGuard)
  @ApiOperation({ summary: "Get a specific region for a client" })
  @ApiResponse({
    status: 200,
    description: "Return the specified region for a client.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findOneClient(@Param("id") id: number) {
    return this.regionService.findOneClient(id);
  }

  @Get(":id")
  // @UseGuards(DriverSelfGuard)
  @ApiOperation({ summary: "Get a specific region for a driver" })
  @ApiResponse({
    status: 200,
    description: "Return the specified region for a driver.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findOneDriver(@Param("id") id: number) {
    return this.regionService.findOneDriver(id);
  }

  @Get(":id")
  // @UseGuards(AdminSelfGuard)
  @ApiOperation({ summary: "Get a specific region for admin" })
  @ApiResponse({
    status: 200,
    description: "Return the specified region for admin.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  findOneAdmin(@Param("id") id: number) {
    return this.regionService.findOneAdmin(id);
  }

  @Patch(":id")
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Update a region" })
  @ApiResponse({
    status: 200,
    description: "The region has been successfully updated.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  update(@Param("id") id: number, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @Delete(":id")
  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Delete a region" })
  @ApiResponse({
    status: 200,
    description: "The region has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  remove(@Param("id") id: number) {
    return this.regionService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

@ApiTags("District")
@Controller("districts")
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
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
  @ApiOperation({ summary: "Get all districts" })
  @ApiResponse({
    status: 200,
    description: "Return all districts",
    type: [District],
  })
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a district by ID" })
  @ApiParam({ name: "id", description: "The ID of the district" })
  @ApiResponse({
    status: 200,
    description: "Return the district with the specified ID",
    type: District,
  })
  @ApiResponse({ status: 404, description: "District not found" })
  findOne(@Param("id") id: string) {
    return this.districtsService.findOne(+id);
  }

  @Patch(":id")
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

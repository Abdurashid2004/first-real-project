import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { CreateBalanceDto } from "./dto/create-balance.dto";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"; // Swagger kutubxonasini import qilish

@ApiTags("balance") // Controller uchun teglarni belgilash
@Controller("balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @ApiOperation({ summary: "Create a new balance" })
  @ApiResponse({
    status: 201,
    description: "The balance has been successfully created.",
  })
  @Post()
  async create(@Body() createBalanceDto: CreateBalanceDto) {
    return this.balanceService.create(createBalanceDto);
  }

  @ApiOperation({ summary: "Get all balances" })
  @ApiResponse({ status: 200, description: "Returns all balances." })
  @Get()
  async findAll() {
    return this.balanceService.findAll();
  }

  @ApiOperation({ summary: "Get a balance by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Returns a single balance by ID." })
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.balanceService.findOne(+id);
  }

  @ApiOperation({ summary: "Update a balance by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Returns the updated balance." })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBalanceDto: UpdateBalanceDto
  ) {
    return this.balanceService.update(+id, updateBalanceDto);
  }

  @ApiOperation({ summary: "Delete a balance by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({
    status: 200,
    description: "The balance has been successfully deleted.",
  })
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.balanceService.remove(+id);
  }
}

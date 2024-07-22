import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateClientDto } from "./create-client.dto";

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiProperty({
    description: "Name of the client",
    example: "John Doe",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "Phone number of the client",
    example: "+998901234567",
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: "Hashed password of the client",
    example: "hashedpassword123",
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: "Confirmation of the password",
    example: "hashedpassword123",
    required: false,
  })
  confirm_password?: string;

  @ApiProperty({
    description: "Client active status",
    example: true,
    required: false,
  })
  is_active?: boolean;
}

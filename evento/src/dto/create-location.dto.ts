// src/location/dto/create-location.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { IsNumber } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly state_id: number;
}

import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class UpdateCityDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

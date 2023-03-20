import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { StateService } from '../../states/services/state.service';
import { CityService } from '../services/city.service';
import axios from 'axios';
import { City } from '../interfaces';
import { ApiTags } from '@nestjs/swagger';
import { CityEntity } from '../entities/city.entity';
import { UpdateCityDto } from '../dto/update-city.dto';

@ApiTags('cities')
@Controller('city')
export class CityController {
  constructor(
    private cityService: CityService,
    private stateService: StateService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: number): Promise<CityEntity> {
    return await this.cityService.findById(+id);
  }

  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<string> {
    return await this.cityService.removeById(+id);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() data: UpdateCityDto,
  ): Promise<string> {
    return await this.cityService.updateById(+id, data);
  }

  @Post('createAllCities')
  async createAllCities(): Promise<string> {
    try {
      const { data } = await axios.get(
        'http://servicodados.ibge.gov.br/api/v1/localidades/municipios',
      );
      const states = await this.stateService.getByAll();

      data.forEach((city: City) => {
        const state = states.find(
          ({ initials }) => city.microrregiao.mesorregiao.UF.sigla === initials,
        );

        const newCity = {
          name: city.nome,
          state_id: state.id,
        };

        this.cityService.createCity(newCity);
      });
      return 'Cidades salvas com sucesso';
    } catch (error) {
      console.log(error);
    }
  }
}

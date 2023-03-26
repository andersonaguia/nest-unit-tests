import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityRepository } from '../city.repository';
import { CityEntity } from '../entities/city.entity';
import { UpdateCityDto } from '../dto/update-city.dto';
import { CreateCityDto } from '../dto/create-city.dto';
import { StateService } from 'src/modules/states/services/state.service';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly stateService: StateService,
  ) {}

  async findById(id: number): Promise<CityEntity> {
    const foundCity = await this.cityRepository.getById(id);

    if (!foundCity) {
      throw new NotFoundException('cityNotFound');
    }

    return foundCity;
  }

  async removeById(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const cityExists = await this.findById(id);

        if (!cityExists) {
          throw new NotFoundException('Cidade não encontrada');
        }

        const cityRemoved = await this.cityRepository.delete({ id: id });

        if (cityRemoved.affected > 0) {
          resolve('Excluído com sucesso!');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateById(cityId: number, newCity: UpdateCityDto): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const cityExists = await this.findById(cityId);

        if (!cityExists) {
          throw new NotFoundException('Cidade não encontrada');
        }

        const city = new CityEntity();
        city.updatedAt = new Date();

        const dataToSave = {
          ...city,
          ...newCity,
        };

        const cityUpdated = await this.cityRepository.update(
          { id: cityId },
          dataToSave,
        );

        if (cityUpdated.affected > 0) {
          resolve('Cidade Atualizada com sucesso!');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async createCity(newCity: CreateCityDto): Promise<CityEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const cityExists = await this.cityRepository.findOne({
          where: { name: newCity.name, state_id: newCity.state_id },
        });
        if (cityExists) {
          throw new ConflictException('cityExists');
        }
        const stateExists = await this.stateService.getById(+newCity.state_id);
        if (!stateExists) {
          throw new NotFoundException('stateNotFound');
        }
        const city = new CityEntity();
        const cityToBeSaved = {
          ...city,
          ...newCity,
        };
        const citySaved = await this.cityRepository.save(cityToBeSaved);
        resolve(citySaved);
      } catch (error) {
        reject(error);
      }
    });
    await this.cityRepository.createCity(newCity);
  }
}

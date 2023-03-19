import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCityDto } from '../dto/create-city.dto';
import { CityRepository } from '../city.repository';
import { CityEntity } from '../entities/city.entity';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

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

  async createCity(newCity: CreateCityDto): Promise<void> {
    await this.cityRepository.createCity(newCity);
  }
}

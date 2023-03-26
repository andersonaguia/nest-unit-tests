import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from 'src/modules/states/services/state.service';
import { TestStatic } from 'src/utils/test';
import { CityRepository } from '../city.repository';
import { CityService } from '../services/city.service';
import { CityController } from './city.controller';

describe('CountryController', () => {
  let cityController: CityController;

  const mockCityService = {
    findById: jest.fn(),
    removeById: jest.fn(),
    updateById: jest.fn(),
    createCity: jest.fn(),
  };

  const mockStateService = {
    getById: jest.fn(),
  };

  const mockCityRepository = {
    getById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        { provide: CityService, useValue: mockCityService },
        { provide: StateService, useValue: mockStateService },
        { provide: CityRepository, useValue: mockCityRepository },
      ],
    }).compile();

    cityController = module.get<CityController>(CityController);
  });

  beforeEach(() => {
    mockCityService.findById.mockReset();
    mockCityService.removeById.mockReset();
    mockCityService.updateById.mockReset();
    mockCityService.createCity.mockReset();
    mockStateService.getById.mockReset();
    mockCityRepository.getById.mockReset();
  });

  it('deveria estar definido cityController', () => {
    expect(cityController).toBeDefined();
  });

  describe('getById', () => {
    it('Deveria retornar o resultado da busca e devolver um registro de dados de cidade', async () => {
      const city = TestStatic.cityData();
      mockCityService.findById.mockReturnValue(city);
      const foundCity = await cityController.getById(city.id);
      expect(foundCity).toMatchObject({ id: city.id });
      expect(mockCityService.findById).toHaveBeenCalledTimes(1);
    });

    it('Deveria retornar um erro pois o id da cidade não foi encontrado no banco de dados', async () => {
      mockCityRepository.getById.mockReturnValue(null);
      const cityId = 2;

      await cityController.getById(cityId).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotFound',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
      expect(mockCityService.findById).toHaveBeenCalledTimes(1);
    });
  });
});

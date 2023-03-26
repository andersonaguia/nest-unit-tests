import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from 'src/modules/countries/services/country.service';
import { StateService } from 'src/modules/states/services/state.service';
import { StateRepository } from 'src/modules/states/state.repository';
import { CityRepository } from '../city.repository';
import { CityService } from './city.service';
import { CountryRepository } from 'src/modules/countries/country.repository';
import { TestStatic } from 'src/utils/test';
import { NotFoundException } from '@nestjs/common';

describe('cityService', () => {
  let cityService: CityService;
  let stateService: StateService;
  let countryService: CountryService;

  const mockCityRepository = {
    getById: jest.fn(),
    getByAll: jest.fn(),
    createCity: jest.fn(),
  };

  const mockStateRepository = {
    getByAll: jest.fn(),
    getByName: jest.fn(),
    createState: jest.fn(),
  };

  const mockCountryRepository = {
    getById: jest.fn(),
    getByName: jest.fn(),
    createCountry: jest.fn(),
    updateCountry: jest.fn(),
    deleteCountry: jest.fn(),
    getByFilter: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        StateService,
        CountryService,
        {
          provide: CityRepository,
          useValue: mockCityRepository,
        },
        {
          provide: StateRepository,
          useValue: mockStateRepository,
        },
        {
          provide: CountryRepository,
          useValue: mockCountryRepository,
        },
      ],
    }).compile();

    cityService = module.get<CityService>(CityService);
    stateService = module.get<StateService>(StateService);
    countryService = module.get<CountryService>(CountryService);
  });

  beforeEach(async () => {
    mockCityRepository.getById.mockReset();
    mockCityRepository.getByAll.mockReset();
    mockCityRepository.createCity.mockReset();

    mockStateRepository.getByName.mockReset();
    mockStateRepository.getByAll.mockReset();
    mockStateRepository.createState.mockReset();

    mockCountryRepository.getById.mockReset();
    mockCountryRepository.getByName.mockReset();
    mockCountryRepository.getByFilter.mockReset();
    mockCountryRepository.createCountry.mockReset();
    mockCountryRepository.updateCountry.mockReset();
    mockCountryRepository.deleteCountry.mockReset();
  });

  it('Deveria ser definido cityService', () => {
    expect(cityService).toBeDefined();
  });

  it('Deveria ser definido stateService', () => {
    expect(stateService).toBeDefined();
  });

  it('Deveria ser definido countryService', () => {
    expect(countryService).toBeDefined();
  });

  describe('findById', () => {
    it('Deveria retornar o objeto city', async () => {
      const city = TestStatic.cityData();
      mockCityRepository.getById.mockReturnValue(city);
      const foundCity = await cityService.findById(city.id);
      expect(foundCity).toMatchObject({ id: city.id });
      expect(mockCityRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('Deveria retornar uma exceção pois o id não foi encontrado no banco de dados', async () => {
      const cityId = 1;
      mockCityRepository.getById.mockReturnValue(null);
      await cityService.findById(cityId).catch((error: Error) => {
        expect(error).toMatchObject({
          message: 'cityNotFound',
        });
        expect(error).toBeInstanceOf(NotFoundException);
      });
      expect(mockCityRepository.getById).toHaveBeenCalledTimes(1);
    });
  });
});

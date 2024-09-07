import { Test, TestingModule } from '@nestjs/testing';
import { PlacesLocationService } from '../places-location.service';
import { PlacesLocationRepositoryInMemory } from '../places-location-in-memory.repository';
import { LocationService } from '../../../providers/location/location.service';

describe('places-location-service', () => {
  let placesLocationService: PlacesLocationService;

  beforeAll(async () => {
    const mockLocationService = {
      getLocationByCoordinates: jest.fn().mockResolvedValue({
        r: true,
        result: {
          city: 'City',
          country: 'Country',
          neighbourhood: 'Neighbourhood',
          state: 'State',
          zip_code: '000',
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesLocationService,
        {
          provide: 'PlacesLocationRepository',
          useClass: PlacesLocationRepositoryInMemory,
        },
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    }).compile();

    placesLocationService = module.get<PlacesLocationService>(
      PlacesLocationService,
    );
  });

  it('should be able to create a new place location', async () => {
    const result = await placesLocationService.create({
      place_id: 'dde40dba-4594-46e6-9bc2-75f1e8fef38c',
      coordinates: [10.5, 20.1],
    });

    expect(result.status_code).toBe(201);
    expect(result.r).toBe(true);
    expect(result.data.result).toHaveProperty('id');
    expect(result.data.result).toHaveProperty('state');
    expect(result.data.result).toHaveProperty('place_id');
  });

  it('should be not able to create a new place location with existent coordinates', async () => {
    const result = await placesLocationService.create({
      place_id: 'dde40dba-4594-46e6-9bc2-75f1e8fef38d',
      coordinates: [10.5, 20.1],
    });

    expect(result.status_code).toBe(400);
    expect(result.r).toBe(false);
    expect(result.data.error).toBe(
      'An place already registered in this location',
    );
  });

  it('should be not able to create a new place location with existent place_id', async () => {
    const result = await placesLocationService.create({
      place_id: 'dde40dba-4594-46e6-9bc2-75f1e8fef38c',
      coordinates: [11.5, 20.1],
    });

    expect(result.status_code).toBe(400);
    expect(result.r).toBe(false);
    expect(result.data.error).toBe('Place already registered');
  });
});

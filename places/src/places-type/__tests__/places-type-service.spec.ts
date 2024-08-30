import { Test, TestingModule } from '@nestjs/testing';
import { PlacesTypeService } from '../places-type.service';
import { PlacesTypeRepositoryInMemory } from '../places-type-repository-in-memory';

describe('places-type-service', () => {
  let placesTypeService: PlacesTypeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesTypeService,
        {
          provide: 'PlacesTypeRepository',
          useClass: PlacesTypeRepositoryInMemory,
        },
      ],
    }).compile();

    placesTypeService = module.get<PlacesTypeService>(PlacesTypeService);
  });

  it('should be able to create a place type', async () => {
    const result = await placesTypeService.create({ name: 'Beach' });
    expect(result.r).toBe(true);
    expect(result.status_code).toBe(201);
    expect(result.data).toHaveProperty('slug');
  });

  it('should be not able to create a existent place type', async () => {
    await placesTypeService.create({ name: 'place type' });
    const result = await placesTypeService.create({ name: 'place type' });
    expect(result.r).toBe(false);
    expect(result.status_code).toBe(409);
    expect(result.data).toBe('Place type already registered');
  });
});

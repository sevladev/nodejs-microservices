import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { PlacesLocationService } from '../places-location.service';
import { PlacesLocationModule } from '../places-location.module';
import { PlacesLocationRepositoryInMemory } from '../places-location-in-memory.repository';
import { LocationService } from '../../../providers/location/location.service';

describe('places-location-controller', () => {
  let app: INestApplication;
  let placesLocationService: PlacesLocationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlacesLocationModule],
    })
      .overrideProvider('PlacesLocationRepository')
      .useClass(PlacesLocationRepositoryInMemory)
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(LocationService)
      .useValue({
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
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    placesLocationService = moduleFixture.get<PlacesLocationService>(
      PlacesLocationService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new places location', async () => {
    const response = await request(app.getHttpServer())
      .post('/places/places-location')
      .send({
        place_id: 'dde40dba-4594-46e6-9bc2-75f1e8fef38d',
        coordinates: [10.5, 20.1],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.r).toBe(true);
    expect(response.body.result).toHaveProperty('id');
    expect(response.body.result).toHaveProperty('place_id');
  });

  it('should be not able to create a new place location with existent coordinates', async () => {
    const response = await request(app.getHttpServer())
      .post('/places/places-location')
      .send({
        place_id: 'dde40dba-4594-46e6-9bc2-75f1e8fef381',
        coordinates: [10.5, 20.1],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.r).toBe(false);
    expect(response.body.error).toBe(
      'An place already registered in this location',
    );
  });

  it('should be not able to create a new place location with existent place_id', async () => {
    const response = await request(app.getHttpServer())
      .post('/places/places-location')
      .send({
        place_id: 'dde40dba-4594-46e6-9bc2-75f1e8fef38d',
        coordinates: [11.5, 20.1],
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.r).toBe(false);
    expect(response.body.error).toBe('Place already registered');
  });
});

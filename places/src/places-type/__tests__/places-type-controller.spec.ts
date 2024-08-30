import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PlacesTypeService } from '../places-type.service';
import { PlacesTypeRepositoryInMemory } from '../places-type-repository-in-memory';
import { PlacesTypeModule } from '../places-type.module';

describe('places-type-controller', () => {
  let app: INestApplication;
  let placesTypeService: PlacesTypeService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlacesTypeModule],
    })
      .overrideProvider('PlacesTypeRepository')
      .useClass(PlacesTypeRepositoryInMemory)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    placesTypeService = moduleFixture.get<PlacesTypeService>(PlacesTypeService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new place type', async () => {
    const response = await request(app.getHttpServer())
      .post('/places-type')
      .send({ name: 'Beach' });

    expect(response.statusCode).toBe(201);
    expect(response.body.r).toBe(true);
    expect(response.body.result).toHaveProperty('slug');
  });

  it('should be not able to create a existent place type', async () => {
    const response = await request(app.getHttpServer())
      .post('/places-type')
      .send({ name: 'Beach' });

    expect(response.statusCode).toBe(409);
    expect(response.body.r).toBe(false);
    expect(response.body.result).toBe('Place type already registered');
  });
});

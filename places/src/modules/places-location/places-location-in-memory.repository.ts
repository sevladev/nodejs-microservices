import { IPlacesLocationRepository } from './dtos/places-location-repository';
import { PlacesLocationEntity } from './places-location.entity';

const placesLocation: PlacesLocationEntity[] = [];

export class PlacesLocationRepositoryInMemory
  implements IPlacesLocationRepository
{
  async create(payload: PlacesLocationEntity): Promise<void> {
    placesLocation.push(payload);
  }
  async findByCoordinates(coordinats: number[]): Promise<PlacesLocationEntity> {
    return placesLocation.find(
      (f) => f.latitude === coordinats[0] && f.longitude === coordinats[1],
    );
  }
  async findByPlaceId(placeId: string): Promise<PlacesLocationEntity> {
    return placesLocation.find((f) => f.place_id === placeId);
  }
}

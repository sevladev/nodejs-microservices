import { PlacesLocationEntity } from '../places-location.entity';

export interface IPlacesLocationRepository {
  create(payload: PlacesLocationEntity): Promise<void>;
  findByCoordinates(coordinats: number[]): Promise<PlacesLocationEntity>;
  findByPlaceId(placeId: string): Promise<PlacesLocationEntity>;
}

import { BaseEntity } from '../../commons/base-entity';

export class PlacesLocationEntity extends BaseEntity {
  city: string;

  state: string;

  country: string;

  zip_code: string;

  neighbourhood: string;

  latitude: number;

  longitude: number;

  place_id: string;

  constructor({
    city,
    state,
    country,
    zip_code,
    neighbourhood,
    latitude,
    longitude,
    place_id,
  }: Omit<PlacesLocationEntity, 'created_at' | 'updated_at' | 'id'>) {
    super();

    this.country = country;
    this.city = city;
    this.state = state;
    this.zip_code = zip_code;
    this.neighbourhood = neighbourhood;
    this.latitude = latitude;
    this.longitude = longitude;
    this.place_id = place_id;
  }
}

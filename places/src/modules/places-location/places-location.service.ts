import { Inject, Injectable } from '@nestjs/common';
import { IPlacesLocationRepository } from './dtos/places-location-repository';
import { createPlacesLocationDTO } from './dtos/create-places-location';
import { LocationService } from '../../providers/location/location.service';
import { CustomResponse } from '../../http-response/custom-response';
import { PlacesLocationEntity } from './places-location.entity';

@Injectable()
export class PlacesLocationService {
  constructor(
    @Inject('PlacesLocationRepository')
    private readonly placesLocationRepository: IPlacesLocationRepository,
    private readonly locationService: LocationService,
  ) {}

  async create({ coordinates, place_id }: createPlacesLocationDTO) {
    try {
      const findByCoordinates =
        await this.placesLocationRepository.findByCoordinates(coordinates);

      if (findByCoordinates) {
        return new CustomResponse()
          .status(400)
          .r(false)
          .error('Ab place already registered in this location')
          .build();
      }

      const findByPlaceId =
        await this.placesLocationRepository.findByPlaceId(place_id);

      if (findByPlaceId) {
        return new CustomResponse()
          .status(400)
          .r(false)
          .error('Place already registered')
          .build();
      }

      const explainCoordinates =
        await this.locationService.getLocationByCoordinates(coordinates);

      if (!explainCoordinates.r) {
        return new CustomResponse()
          .status(400)
          .r(false)
          .error('Invalid coordinates')
          .build();
      }

      const { city, country, neighbourhood, state, zip_code } =
        explainCoordinates.result;

      const placeLocation = new PlacesLocationEntity({
        latitude: coordinates[0],
        longitude: coordinates[1],
        city,
        country,
        neighbourhood,
        state,
        zip_code,
        place_id,
      });

      await this.placesLocationRepository.create(placeLocation);

      return new CustomResponse()
        .status(200)
        .r(true)
        .result(placeLocation)
        .build();
    } catch (error) {
      return new CustomResponse()
        .status(500)
        .r(false)
        .error('Internal Server Error')
        .build();
    }
  }
}

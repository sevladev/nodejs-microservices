import { Injectable } from '@nestjs/common';
import { IResponseLocationProps } from './dtos/response-location-type';

const BASE_URL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2`;

@Injectable()
export class LocationService {
  constructor() {}

  async getLocationByCoordinates(
    coordinates: number[],
  ): Promise<IResponseLocationProps> {
    try {
      const response = await fetch(
        `${BASE_URL}&lat=${coordinates[0]}&lon=${coordinates[1]}`,
      );

      if (!response.ok) {
        return {
          r: false,
          result: null as any,
        };
      }

      const result = await response.json();

      return {
        r: true,
        result: {
          city: result.address.town,
          country: result.address.country,
          neighbourhood: result.address.neighbourhood,
          state: result.address.state,
          zip_code: result.address.postcode,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

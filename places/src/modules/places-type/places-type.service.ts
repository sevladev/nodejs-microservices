import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IPlacesTypeRepository } from './dtos/places-type-repository';
import { createPlacesTypeDTO } from './dtos/create-places-type';
import { PlacesTypeEntity } from './places-type.entity';
import { UTILS } from '../../commons/constants';

@Injectable()
export class PlacesTypeService {
  constructor(
    @Inject('PlacesTypeRepository')
    private readonly placesTypeRepository: IPlacesTypeRepository,
  ) {}

  async create({ name }: createPlacesTypeDTO) {
    try {
      const slug = UTILS.STRING.NORMALIZE_SLUG(name);

      const findSlug = await this.placesTypeRepository.findBySlug(slug);

      if (findSlug) {
        return {
          r: false,
          status_code: HttpStatus.CONFLICT,
          data: {
            error: 'Place type already registered',
          },
        };
      }

      const placeType = new PlacesTypeEntity({
        name: UTILS.STRING.PASCAL_CASE(name),
        slug,
      });

      await this.placesTypeRepository.create(placeType);

      return {
        r: true,
        status_code: HttpStatus.CREATED,
        data: {
          result: placeType,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

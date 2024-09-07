import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { PlacesLocationService } from './places-location.service';
import { ZodValidationPipe } from '../../middlewares/schema.middleware';
import { createPlacesLocationSchema } from './dtos/create-places-location';
import { z } from 'zod';
import { Response } from 'express';
import { Roles } from '../../decorators/role-decorator';
import { ROLES_TYPES } from '../../commons/constants';
import { RolesGuard } from '../../middlewares/role-guard.middleware';

@Controller('/places/places-location')
@UseGuards(RolesGuard)
export class PlacesLocationController {
  constructor(private placesLocationService: PlacesLocationService) {}
  @Post()
  @Roles(ROLES_TYPES.ROOT, ROLES_TYPES.USER)
  async create(
    @Body(new ZodValidationPipe(createPlacesLocationSchema))
    body: z.infer<typeof createPlacesLocationSchema>,
    @Res() res: Response,
  ) {
    const { coordinates, place_id } = body;

    const result = await this.placesLocationService.create({
      coordinates,
      place_id,
    });

    return res.status(result.status_code).json({
      r: result.r,
      ...result.data,
    });
  }
}

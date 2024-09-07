import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { PlacesTypeService } from './places-type.service';
import { createPlacesTypeSchema } from './dtos/create-places-type';
import { z } from 'zod';
import { Response } from 'express';
import { ZodValidationPipe } from '../../middlewares/schema.middleware';
import { Roles } from '../../decorators/role-decorator';
import { RolesGuard } from '../../middlewares/role-guard.middleware';
import { ROLES_TYPES } from '../../commons/constants';

@Controller('/places/places-type')
@UseGuards(RolesGuard)
export class PlacesTypeController {
  constructor(private placesTypeService: PlacesTypeService) {}
  @Post()
  @Roles(ROLES_TYPES.ROOT, ROLES_TYPES.USER)
  async create(
    @Body(new ZodValidationPipe(createPlacesTypeSchema))
    body: z.infer<typeof createPlacesTypeSchema>,
    @Res() res: Response,
  ) {
    const { name } = body;

    const result = await this.placesTypeService.create({ name });

    return res.status(result.status_code).json({
      r: result.r,
      ...result.data,
    });
  }
}

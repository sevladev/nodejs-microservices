import { Body, Controller, Post, Res } from '@nestjs/common';
import { PlacesTypeService } from './places-type.service';
import { ZodValidationPipe } from '../middlewares/schema-validation';
import { createPlacesTypeSchema } from './dtos/create-places-type';
import { z } from 'zod';
import { Response } from 'express';

@Controller('places-type')
export class PlacesTypeController {
  constructor(private placesTypeService: PlacesTypeService) {}
  @Post()
  async create(
    @Body(new ZodValidationPipe(createPlacesTypeSchema))
    body: z.infer<typeof createPlacesTypeSchema>,
    @Res() res: Response,
  ) {
    const { name } = body;

    const result = await this.placesTypeService.create({ name });

    return res.status(result.status_code).json({
      r: result.r,
      result: result.data,
    });
  }
}

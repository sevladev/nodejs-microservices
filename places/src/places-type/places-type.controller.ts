import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { z } from 'zod';
import { createPlacesTypeSchema } from './dtos/create-places-type';
import { PlacesTypeService } from './places-type.service';
import { ZodValidationPipe } from '../middlewares/schema-validation';
import { Response } from 'express';

@Controller('places-type')
export class PlacesTypeController {
  constructor(private placesTypeService: PlacesTypeService) {}
  @Post()
  @HttpCode(201)
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

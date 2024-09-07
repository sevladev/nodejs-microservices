import { z } from 'zod';

export const createPlacesLocationSchema = z.object({
  coordinates: z
    .array(
      z.number({
        invalid_type_error: 'Each coordinate must be a number',
      }),
    )
    .length(2, { message: 'The array must contain exactly 2 coordinates' }),
  place_id: z
    .string()
    .uuid('Place id should be uuid format')
    .nonempty('Place ID field is required'),
});

export type createPlacesLocationDTO = {
  coordinates: number[];
  place_id: string;
};

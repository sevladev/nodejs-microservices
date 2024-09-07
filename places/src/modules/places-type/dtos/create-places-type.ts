import { z } from 'zod';

export const createPlacesTypeSchema = z.object({
  name: z
    .string()
    .nonempty('Name field is required')
    .min(4, 'Must have more than 4 characters'),
});

export type createPlacesTypeDTO = {
  name: string;
};

import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({
      required_error: 'Cow id required',
    }),
    buyer: z.string({
      required_error: 'Buyer id required',
    }),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};

import { z } from "zod";

export const IdParams = z.object({
  id: z.coerce.number().int().positive(),
});

export const PageParams = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  orderBy: z.enum(["recent"]).optional(),
  keyword: z.string().min(1).optional(),
});

export const CursorParams = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

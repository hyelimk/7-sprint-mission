import { ZodError } from "zod";
import { BadRequestError } from "../lib/error/errors";

export function parse(schema, data) {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      throw new BadRequestError("Invalid request body");
    }
    throw e;
  }
}

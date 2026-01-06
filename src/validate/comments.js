import { z } from "zod";
import { CursorParams } from "./commons.js";

export const CreateCommentBody = z.object({
  content: z.string().min(1),
});

export const GetCommentListParams = CursorParams;
export const UpdateCommentBody = CreateCommentBody.partial();

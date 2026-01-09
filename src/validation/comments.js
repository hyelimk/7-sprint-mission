import { z } from "zod";
import { CursorParams } from "./commons.js";

export const CreateComment = z.object({
  content: z.string().min(1, "내용을 입력해주세요."),
});

export const GetCommentListParamsSchema = CursorParams;
export const UpdateComment = CreateComment.partial();

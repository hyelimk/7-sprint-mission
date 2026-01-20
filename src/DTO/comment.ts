export type CommentDto = {
  id: number;
  content: string;
  createdAt: string;
};
export function toCommentDto(entity: {
  id: number;
  content: string;
  createdAt: Date;
}): CommentDto {
  return {
    id: entity.id,
    content: entity.content,
    createdAt: entity.createdAt.toISOString(),
  };
}

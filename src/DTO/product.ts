// Prisma에서 오는 기본 엔티티(관계 제외)
export type ProductEntity = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: number;
};

// detail에서 likes include 했을 때만 붙는 형태
export type ProductEntityWithLikes = ProductEntity & {
  likes?: { id: number }[];
};

// ✅ 공통 응답(기본): isLiked 없음
export type ProductBaseDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
};

// ✅ 상세 응답: isLiked 포함
export type ProductDetailDto = ProductBaseDto & {
  isLiked: boolean;
};

// mapper: entity → base dto
export function toProductBaseDto(entity: ProductEntity): ProductBaseDto {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    price: entity.price,
    tags: entity.tags,
    images: entity.images,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

// mapper: entity + isLiked → detail dto
export function toProductDetailDto(
  entity: ProductEntity,
  isLiked: boolean
): ProductDetailDto {
  return {
    ...toProductBaseDto(entity),
    isLiked,
  };
}

export const toProductBaseDtoList = (entities: ProductEntity[]) =>
  entities.map(toProductBaseDto);

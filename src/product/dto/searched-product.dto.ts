export class SearchedProductDto {
  id: string;
  name: string;
  brand?: string;
  price: number;
  size: string;
  stock: number;
  local: boolean;
  peak: boolean;
  imageThumbnail: string;
  imageGallery: string;
  categoryIds: number[];
}

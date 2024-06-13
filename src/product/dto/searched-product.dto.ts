export class SearchedProductDto {
  id: string;
  name: string;
  brand?: string;
  price: number;
  size: string;
  local: boolean;
  peak: boolean;
  imageThumbnail: string;
  imageGallery: string;
  categoryIds: number[];
}

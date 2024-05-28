export class SearchedProductDto {
  id: string;
  name: string;
  brand?: string;
  price: number;
  size: string;
  imageThumbnail: string;
  imageGallery: string;
  categoryIds: number[];
}

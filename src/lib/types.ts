export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  category: string;
  images: { url: string; alt: string }[];
  stock: number | null;
  material: string;
  dimensions: string;
  care: string;
  color: string;
  featured: boolean;
  available: boolean;
  canAdd?: boolean;
  preview: boolean;
}
export interface CatalogData {
  products: Product[];
  preview: boolean;
  error: string | null;
}

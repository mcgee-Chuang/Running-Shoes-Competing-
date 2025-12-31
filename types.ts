
export interface Shoe {
  brand: string;
  model: string;
  category: string;
  price: string;
  features: string[];
  weight: string;
  drop: string;
  link: string;
}

export interface ComparisonResponse {
  shoes: Shoe[];
  summary: string;
  searchUrls: string[];
}

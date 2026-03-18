export interface SteamPrice {
  currency?: string;
  initial?: number;
  final?: number;
  discountPercent?: number;
}

export interface SteamGame {
  _id: string;
  steamAppId: number;
  title: string;
  shortDescription?: string;
  longDescription?: string;
  headerImage?: string;
  capsuleImage?: string;
  background?: string;
  genres: string[];
  price?: SteamPrice;
  publishers?: string[];
  releaseDate?: string;
  requiredAge?: number;
  metacriticScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

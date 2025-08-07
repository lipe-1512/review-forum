export interface Movie {
  id: number;
  name: string;
  year: number;
  genre: string;
  posterUrl?: string; // Adicionámos um campo opcional para o poster
}

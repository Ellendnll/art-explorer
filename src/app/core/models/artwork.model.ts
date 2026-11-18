/**
 * Modelo ÚNICO de obra de arte do ArtExplore.
 * Todas as páginas (Home, Explorar, Detalhes, Favoritos) devem usar esta interface.
 */
export interface Artwork {
  id: number;
  title: string;
  artist_title: string | null;
  date_display: string | null;
  date_start: number | null;
  description: string | null;
  short_description: string | null;
  style_title: string | null;
  artwork_type_title: string | null;
  image_id: string | null;
  /** Preenchido pelo ObrasService (URL IIIF ou imagem padrão). */
  imageUrl?: string;
}

/** Formato "cru" de uma obra como a API devolve (antes de tratar). */
export type ArtworkApiItem = Omit<Artwork, 'imageUrl'>;

/** Resposta de /artworks e /artworks/search */
export interface ArtworkListResponse {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
  data: ArtworkApiItem[];
}

/** Resposta de /artworks/{id} */
export interface ArtworkDetailResponse {
  data: ArtworkApiItem;
}

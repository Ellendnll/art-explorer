
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import {
  Artwork,
  ArtworkApiItem,
  ArtworkDetailResponse,
  ArtworkListResponse,
} from '../models/artwork.model';

/** Imagem usada quando a obra não tem image_id (ou a imagem falha). */
export const IMAGEM_PADRAO = 'assets/images/imagem-padrao.png';

/**
 * ObrasService — única porta de entrada para a API do Art Institute of Chicago.
 * Utilizem estes métodos pfvr!!!!!!!!!, sem chamar a API diretamente.
 */
@Injectable({ providedIn: 'root' })
export class ObrasService {
  private readonly http = inject(HttpClient);

  // Endereço local encaminhado pelo proxy para a API do museu.
  private readonly API_URL = '/artic/api/v1';

  // Endereço utilizado para carregar as imagens das obras.
  private readonly IIIF_URL = '/iiif/2';

  /** Campos pedidos à API. */
  private readonly FIELDS = [
    'id',
    'title',
    'artist_title',
    'date_display',
    'date_start',
    'description',
    'short_description',
    'style_title',
    'artwork_type_title',
    'image_id',
  ].join(',');

  // ---------------------------------------------------------------------
  // GET 1 — lista de obras
  // ---------------------------------------------------------------------
  getArtworks(page = 1, limit = 12): Observable<Artwork[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('fields', this.FIELDS);

    return this.http
      .get<ArtworkListResponse>(`${this.API_URL}/artworks`, {
        params,
      })
      .pipe(
        map((res) => this.mapList(res)),
        catchError((err) => this.handleError(err)),
      );
  }

  // ---------------------------------------------------------------------
  // GET 2 — pesquisa de obras
  // ---------------------------------------------------------------------
  searchArtworks(
    termo: string,
    page = 1,
    limit = 12,
  ): Observable<Artwork[]> {
    const params = new HttpParams()
      .set('q', termo.trim())
      .set('page', page)
      .set('limit', limit)
      .set('fields', this.FIELDS);

    return this.http
      .get<ArtworkListResponse>(`${this.API_URL}/artworks/search`, {
        params,
      })
      .pipe(
        map((res) => this.mapList(res)),
        catchError((err) => this.handleError(err)),
      );
  }

  // ---------------------------------------------------------------------
  // GET 3 — detalhes de uma obra
  // ---------------------------------------------------------------------
  getArtworkById(id: number | string): Observable<Artwork> {
    const params = new HttpParams().set('fields', this.FIELDS);

    return this.http
      .get<ArtworkDetailResponse>(`${this.API_URL}/artworks/${id}`, {
        params,
      })
      .pipe(
        map((res) => this.toArtwork(res.data)),
        catchError((err) => this.handleError(err)),
      );
  }

  // ---------------------------------------------------------------------
  // Organização dos dados
  // ---------------------------------------------------------------------

  /** Monta a URL IIIF da imagem. Sem image_id, usa a imagem padrão. */
  getImageUrl(
    imageId: string | null | undefined,
    largura = 400,
  ): string {
    return imageId
      ? `${this.IIIF_URL}/${imageId}/full/${largura},/0/default.jpg`
      : IMAGEM_PADRAO;
  }

  private mapList(res: ArtworkListResponse): Artwork[] {
    return (res?.data ?? []).map((item) => this.toArtwork(item));
  }

  /** Converte o item da API no modelo Artwork. */
  private toArtwork(item: ArtworkApiItem): Artwork {
    return {
      id: item.id,
      title: item.title ?? 'Sem título',
      artist_title: item.artist_title ?? null,
      date_display: item.date_display ?? null,
      date_start: item.date_start ?? null,
      description: this.limparHtml(item.description),
      short_description: this.limparHtml(item.short_description),
      style_title: item.style_title ?? null,
      artwork_type_title: item.artwork_type_title ?? null,
      image_id: item.image_id ?? null,
      imageUrl: this.getImageUrl(item.image_id),
    };
  }

  /** Remove as tags HTML das descrições. */
  private limparHtml(
    texto: string | null | undefined,
  ): string | null {
    if (!texto) return null;

    const limpo = texto
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    return limpo || null;
  }

  // ---------------------------------------------------------------------
  // Tratamento de erros
  // ---------------------------------------------------------------------

  private handleError(err: HttpErrorResponse): Observable<never> {
    let mensagem = 'Não foi possível carregar as obras. Tente novamente.';

    if (err.status === 0) {
      mensagem = 'Sem conexão com a internet. Verifique sua rede.';
    } else if (err.status === 404) {
      mensagem = 'Obra não encontrada.';
    } else if (err.status === 429) {
      mensagem = 'Muitas requisições. Aguarde um instante e tente de novo.';
    } else if (err.status >= 500) {
      mensagem = 'O servidor do museu está indisponível no momento.';
    }

    console.error('[ObrasService]', err);
    return throwError(() => new Error(mensagem));
  }
}

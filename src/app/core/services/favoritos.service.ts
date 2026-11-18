import { Injectable, signal } from '@angular/core';

import { Artwork } from '../models/artwork.model';

/**
 * FavoritosService — gerencia as obras salvas pelo usuário.
 * Os dados ficam no LocalStorage, então permanecem após fechar o app.
 *
 * Para telas que precisam atualizar sozinhas (ex.: Favoritos), use o signal
 * `favoritos` no template: `favoritosService.favoritos()`.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly STORAGE_KEY = 'artexplore_favoritos';

  private readonly _favoritos = signal<Artwork[]>(this.carregar());

  /** Lista reativa (somente leitura) de favoritos. */
  readonly favoritos = this._favoritos.asReadonly();

  /** Retorna a lista atual de favoritos. */
  getFavorites(): Artwork[] {
    return [...this._favoritos()];
  }

  /** Adiciona a obra se não for favorita; remove se já for. Retorna true se ficou favorita. */
  toggleFavorite(obra: Artwork): boolean {
    if (this.isFavorite(obra.id)) {
      this.removeFavorite(obra.id);
      return false;
    }
    this.atualizar([obra, ...this._favoritos()]);
    return true;
  }

  /** Verifica se a obra com esse id está nos favoritos. */
  isFavorite(id: number): boolean {
    return this._favoritos().some((o) => o.id === id);
  }

  /** Remove a obra dos favoritos. */
  removeFavorite(id: number): void {
    this.atualizar(this._favoritos().filter((o) => o.id !== id));
  }

  // ---------------------------------------------------------------------
  // LocalStorage (com try/catch: pode estar bloqueado ou corrompido)
  // ---------------------------------------------------------------------
  private atualizar(lista: Artwork[]): void {
    this._favoritos.set(lista);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      console.error('[FavoritosService] Falha ao salvar favoritos', e);
    }
  }

  private carregar(): Artwork[] {
    try {
      const bruto = localStorage.getItem(this.STORAGE_KEY);
      const dados = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(dados) ? dados : [];
    } catch {
      return [];
    }
  }
}

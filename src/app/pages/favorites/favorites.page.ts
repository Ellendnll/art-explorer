import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, heartOutline, trashOutline } from 'ionicons/icons';

import { FavoritosService } from '../../core/services/favoritos.service';
import { IMAGEM_PADRAO } from '../../core/services/obras.service';
import { DestaqueObraDirective } from '../../shared/directives/destaque-obra.directive';
import { ImagemFallbackDirective } from '../../shared/directives/imagem-fallback.directive';
import { BottomMenuComponent } from '../../shared/components/bottom-menu/bottom-menu.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonIcon,
    DestaqueObraDirective,
    ImagemFallbackDirective,
    BottomMenuComponent,
  ],
})
export class FavoritesPage {
  private readonly favoritosService = inject(FavoritosService);

  /**
   * Lista reativa de obras salvas (signal do FavoritosService, que lê/grava
   * no LocalStorage). Como é um signal, a tela atualiza sozinha ao remover
   * ou ao favoritar uma obra em outra página.
   */
  readonly favoritos = this.favoritosService.favoritos;

  readonly imagemPadrao = IMAGEM_PADRAO;

  constructor() {
    addIcons({ trashOutline, heartOutline, arrowForwardOutline });
  }

  remover(id: number): void {
    this.favoritosService.removeFavorite(id);
  }
}

/*
 * ============================================================
 * ANOTAÇÕES PARA A APRESENTAÇÃO — Página Favoritos (integrante 4)
 * ============================================================
 * 1) PÁGINA FAVORITOS + INTEGRAÇÃO COM O FavoritosService / LocalStorage
 *   O QUE FAZ? Lista as obras que o usuário salvou, com imagem, título,
 *     artista, botão "Ver detalhes" e botão de remover. Os dados vêm do
 *     FavoritosService, que guarda tudo no LocalStorage; por isso os
 *     favoritos continuam salvos depois de fechar o app.
 *   ONDE ESTÁ? favorites.page.ts (`favoritos` e remover(), que usam o
 *     FavoritosService) e favorites.page.html. Rota em app.routes.ts.
 *   ONDE VER? Rota /favoritos. Favorite uma obra em Explorar (coração) ou
 *     em Detalhes, abra Favoritos, remova uma obra e recarregue a página
 *     (F5) para ver que os favoritos persistem.
 *
 * 2) BLOCO @if
 *   O QUE FAZ? Decide o que mostrar: se houver favoritos, mostra a lista;
 *     se não houver, mostra uma mensagem informativa + botão para Explorar.
 *   ONDE ESTÁ? favorites.page.html — `@if (favoritos().length > 0) { ... }
 *     @else { ... }`.
 *   ONDE VER? Em /favoritos: sem nenhuma obra salva aparece "Você ainda não
 *     salvou nenhuma obra". Ao salvar uma, a lista aparece.
 *
 * 3) BLOCO @for
 *   O QUE FAZ? Percorre a lista de favoritos e cria um card para cada obra
 *     (com `track obra.id`). Substitui o antigo *ngFor.
 *   ONDE ESTÁ? favorites.page.html — `@for (obra of favoritos(); track obra.id)`.
 *   ONDE VER? Em /favoritos: cada obra salva vira um card.
 *
 * 4) DIRETIVAS appDestaqueObra e appImagemFallback
 *   Veja as anotações no final dos arquivos:
 *   shared/directives/destaque-obra.directive.ts
 *   shared/directives/imagem-fallback.directive.ts
 * ============================================================
 */

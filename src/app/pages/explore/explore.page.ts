import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline, heart, heartOutline, imageOutline, searchOutline } from 'ionicons/icons';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { Artwork } from '../../core/models/artwork.model';
import { FavoritosService } from '../../core/services/favoritos.service';
import { IMAGEM_PADRAO, ObrasService } from '../../core/services/obras.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonButton, IonIcon, IonSpinner],
})
export class ExplorePage implements OnInit {
  private readonly obrasService = inject(ObrasService);
  readonly favoritosService = inject(FavoritosService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly POR_PAGINA = 12;

  /** Atalhos de exploração (estilos/temas). Clicar faz uma pesquisa. */
  readonly sugestoes = ['Impressionism', 'Cubism', 'Monet', 'Van Gogh', 'Japanese prints', 'Sculpture'];

  readonly imagemPadrao = IMAGEM_PADRAO;

  readonly obras = signal<Artwork[]>([]);
  readonly carregando = signal(false);
  readonly carregandoMais = signal(false);
  readonly erro = signal<string | null>(null);
  readonly temMais = signal(false);

  termo = '';
  private pagina = 1;
  private readonly busca$ = new Subject<string>();

  constructor() {
    addIcons({ heart, heartOutline, searchOutline, alertCircleOutline, imageOutline });
  }

  ngOnInit(): void {
    // Pesquisa com debounce: só dispara 400ms depois de parar de digitar.
    this.busca$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((termo) => this.carregar(termo));

    this.carregar('');
  }

  // ---------------------------------------------------------------------
  // Eventos da tela
  // ---------------------------------------------------------------------
  aoDigitar(event: CustomEvent): void {
    this.termo = ((event.detail.value as string) ?? '').trim();
    this.busca$.next(this.termo);
  }

  usarSugestao(sugestao: string): void {
    this.termo = sugestao;
    this.carregar(sugestao);
  }

  limpar(): void {
    this.termo = '';
    this.carregar('');
  }

  tentarNovamente(): void {
    this.carregar(this.termo);
  }

  carregarMais(): void {
    if (this.carregandoMais()) return;
    this.carregandoMais.set(true);
    this.pagina++;

    this.buscar(this.termo, this.pagina).subscribe({
      next: (novas) => {
        this.obras.update((atuais) => [...atuais, ...novas.filter((n) => !atuais.some((a) => a.id === n.id))]);
        this.temMais.set(novas.length === this.POR_PAGINA);
        this.carregandoMais.set(false);
      },
      error: (e: Error) => {
        this.pagina--;
        this.erro.set(e.message);
        this.carregandoMais.set(false);
      },
    });
  }

  abrirDetalhes(obra: Artwork): void {
    // Rota com parâmetro: /detalhes/:id
    this.router.navigate(['/detalhes', obra.id]);
  }

  favoritar(obra: Artwork, event: Event): void {
    event.stopPropagation(); // não abre os detalhes ao clicar no coração
    this.favoritosService.toggleFavorite(obra);
  }

  aoFalharImagem(event: Event): void {
  const imagem = event.target as HTMLImageElement;

  imagem.onerror = null;
  imagem.src = this.imagemPadrao;
}

  // ---------------------------------------------------------------------
  // Carregamento de dados
  // ---------------------------------------------------------------------
  private buscar(termo: string, pagina: number) {
    return termo
      ? this.obrasService.searchArtworks(termo, pagina, this.POR_PAGINA)
      : this.obrasService.getArtworks(pagina, this.POR_PAGINA);
  }

  private carregar(termo: string): void {
    this.pagina = 1;
    this.carregando.set(true);
    this.erro.set(null);

    this.buscar(termo, 1).subscribe({
      next: (obras) => {
        this.obras.set(obras);
        this.temMais.set(obras.length === this.POR_PAGINA);
        this.carregando.set(false);
      },
      error: (e: Error) => {
        this.obras.set([]);
        this.temMais.set(false);
        this.erro.set(e.message);
        this.carregando.set(false);
      },
    });
  }
}

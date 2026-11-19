import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonIcon, IonSpinner, IonChip
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { ObrasService } from '../../core/services/obras.service';
import { FavoritosService } from '../../core/services/favoritos.service';
import { Artwork } from '../../core/models/artwork.model';
import { SeculoPipe } from '../../shared/pipes/seculo.pipe';
import { DescricaoCurtaPipe } from '../../shared/pipes/descricao-curta.pipe';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonIcon, IonSpinner, IonChip,
    TitleCasePipe, UpperCasePipe,
    SeculoPipe, DescricaoCurtaPipe
  ],
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss']
})
export class DetailsPage implements OnInit {

  private route = inject(ActivatedRoute);
  private obrasService = inject(ObrasService);
  private favoritosService = inject(FavoritosService);

  obra = signal<Artwork | null>(null);
  carregando = signal(true);
  erro = signal(false);
  favorito = signal(false);

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.erro.set(true);
      this.carregando.set(false);
      return;
    }

    this.carregarObra(id);
  }

  private carregarObra(id: number): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.obrasService.getArtworkById(id).subscribe({
      next: (obra) => {
        this.obra.set(obra);
        this.favorito.set(this.favoritosService.isFavorite(obra.id));
        this.carregando.set(false);
      },
      error: () => {
        this.obra.set(null);
        this.erro.set(true);
        this.carregando.set(false);
      }
    });
  }

  alternarFavorito(): void {
    const obra = this.obra();
    if (!obra) return;
    this.favoritosService.toggleFavorite(obra);
    this.favorito.set(this.favoritosService.isFavorite(obra.id));
  }
}
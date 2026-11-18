import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonIcon, IonSpinner, IonChip, IonLabel
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
    IonBackButton, IonButton, IonIcon, IonSpinner, IonChip, IonLabel,
    TitleCasePipe, UpperCasePipe,
    SeculoPipe, DescricaoCurtaPipe,
  ],
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss']
})
export class DetailsPage implements OnInit {

  private route = inject(ActivatedRoute);
  private obrasService = inject(ObrasService);
  private favoritosService = inject(FavoritosService);

  obra: Artwork | null = null;
  carregando = true;
  erro = false;
  favorito = false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit(): void {
    // Lê o parâmetro :id da rota /detalhes/:id
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    this.carregarObra(id);
  }

  private carregarObra(id: number): void {
    this.carregando = true;
    this.erro = false;

    this.obrasService.getArtworkById(id).subscribe({
      next: (obra) => {
        this.obra = obra;
        this.favorito = this.favoritosService.isFavorite(obra.id);
        this.carregando = false;
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  alternarFavorito(): void {
    if (!this.obra) {
      return;
    }
    this.favoritosService.toggleFavorite(this.obra);
    this.favorito = this.favoritosService.isFavorite(this.obra.id);
  }
}
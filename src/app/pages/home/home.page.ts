import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSpinner,
} from '@ionic/angular';
import { Artwork } from '../../core/models/artwork.model';
import { ObrasService } from '../../core/services/obras.service';
import { BottomMenuComponent } from '../../shared/components/bottom-menu/bottom-menu.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonSpinner,
    BottomMenuComponent,
  ],
})
export class HomePage implements OnInit {
  private obrasService = inject(ObrasService);
  private cdr = inject(ChangeDetectorRef);

  destaques: Artwork[] = [];
  carregando = true;
  erroCarregar = false;

  ngOnInit(): void {
    this.obrasService.getArtworks().subscribe({
      next: (obras) => {
        console.log('Obras recebidas na Home:', obras);
        this.destaques = obras.slice(0, 6);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro na Home:', err);
        this.erroCarregar = true;
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }
}
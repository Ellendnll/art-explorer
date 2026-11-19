import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonFooter,
  IonToolbar,
  IonIcon,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, compassOutline, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonFooter,
    IonToolbar,
    IonIcon,
    IonLabel,
  ],
})
export class BottomMenuComponent {
  constructor() {
    addIcons({ homeOutline, compassOutline, heartOutline });
  }
}
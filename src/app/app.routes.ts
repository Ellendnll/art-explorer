import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'explorar',
     loadComponent: () => import('./pages/explore/explore.page').then(m => m.ExplorePage)
     },
      {
    path: 'detalhes/:id',
    loadComponent: () => import('./pages/details/details.page').then((m) => m.DetailsPage),
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./pages/favorites/favorites.page').then((m) => m.FavoritesPage),
  },
];

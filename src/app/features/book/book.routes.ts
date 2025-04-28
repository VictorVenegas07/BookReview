import { Routes } from '@angular/router';

export const bookRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/book-list/book-list.component').then(m => m.BookListComponent),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./components/book-deatil/book-deatil.component').then(m => m.BookDeatilComponent),
  }
];

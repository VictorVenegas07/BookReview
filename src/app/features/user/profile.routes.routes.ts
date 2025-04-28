import { Routes } from '@angular/router';

export const UserRoutes: Routes = [
  {
    path: 'my-reviews',
    loadComponent: () => import('./pages/my-reviews/my-reviews.component').then(m => m.MyReviewsComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
  }
];

import { Routes } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';
import { authGuard } from './Core/guards/auth.guard';
import { authRedirectGuard } from './Core/guards/auth-redirect.guard';

export const routes: Routes = [
      {
        path: 'auth',
        canActivate: [authRedirectGuard],
        loadComponent: () => import('./layout/login/login.component').then(m => m.LoginComponent),
        children: [
          {
            path: 'login',
            loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent),
          },
          {
            path: 'register',
            loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent),
          }
          
        ]
      },
      {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () => import('./layout/home/home.component').then(m => m.HomeComponent),
        children: [
          {
            path: 'book',
            loadChildren: () => import('./features/book/book.routes').then(m => m.bookRoutes)
          },
          {
            path: 'user',
            loadChildren: () => import('./features/user/profile.routes.routes').then(m => m.UserRoutes)
          },
          {
            path: '',
            redirectTo: 'book',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: '**',
        redirectTo: 'home'
      }
];

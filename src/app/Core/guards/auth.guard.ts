import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const value = authService.currentUserValue;
  
  console.log('AuthGuard', value);

  return value 
    ? true 
    : router.createUrlTree(['auth/login']);
};

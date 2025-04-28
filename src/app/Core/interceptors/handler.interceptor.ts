import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';
import { inject } from '@angular/core';

export const handlerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  authService.hasToken();
  const currentUser = authService.currentUserValue;
  
  const isLoginRequest = req.url.includes('/login');

  if (isLoginRequest) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${currentUser}` }
  });

  return next(authReq);
};

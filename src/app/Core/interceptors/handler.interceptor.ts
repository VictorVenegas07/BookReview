import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const handlerInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);

  authService.hasToken();
  const currentUser = authService.currentUserValue;

  const isPublicRequest = req.url.includes('/login') || req.url.includes('/register');

  const errorMessages = [
    { status: 401, message: 'Unauthorized access. Please log in.' },
    { status: 403, message: 'Forbidden access. You do not have permission to access this resource.' },
    { status: 404, message: 'Resource not found.' },
    { status: 500, message: 'Internal server error. Please try again later.' },
  ];

  const handleError = (error: HttpErrorResponse) => {
    const matchedError = errorMessages.find(e => e.status === error.status);
    debugger
    if (matchedError) {
      toastr.error(matchedError.message, 'Error', { timeOut: 3000 });
    } else if (error.error?.message) {
      toastr.error(error.error.message, 'Error', { timeOut: 3000 });
    } else {
      // toastr.error('An unexpected error occurred.', 'Error', { timeOut: 3000 });
    }

    return throwError(() => new Error('An error occurred. Please try again later.'));
  };

  if (isPublicRequest) {
    return next(req).pipe(
      catchError(handleError)
    );
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${currentUser}` }
  });

  return next(authReq).pipe(
    catchError(handleError)
  );
}

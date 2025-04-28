import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { handlerInterceptor } from './Core/interceptors/handler.interceptor';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([handlerInterceptor])
    ),
     provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideAnimations(),
     provideToastr()
    ]
};

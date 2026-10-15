import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { IfitnessHttpInterceptor } from './security/ifitness-http-interceptor';
import { DatePipe } from '@angular/common';
import { definePreset } from '@primeng/themes';

const IfitnessPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}'
    }
  }
});

export function tokenGetter(): any {
  return localStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptorsFromDi() // Importante para que os interceptores do JwtModule funcionem
    ),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080'],
          disallowedRoutes: [
            'http://localhost:8080/auth/login',
            'http://localhost:8080/auth/refresh',
            'http://localhost:8080/auth/logout',
            'http://localhost:8080/users'
          ]
        }
      })
    ),
    JwtHelperService,
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset:  IfitnessPreset,
        options: {
          darkModeSelector: false // mantém o tema claro, como no Bootstrap
        }
      }
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IfitnessHttpInterceptor,
      multi: true
    },
    DatePipe
  ]
};
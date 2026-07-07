import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; 

import { routes } from './app.routes';

import { definePreset } from '@primeng/themes';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NumberFormatPipe } from './pipe/number-format.pipe';
import { MessageService } from 'primeng/api';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { environment } from '../environments/environment';

registerLocaleData(localePt);

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: environment.primary[50],
            100: environment.primary[100],
            200: environment.primary[200],
            300: environment.primary[300],
            400: environment.primary[400],
            500: environment.primary[500],
            600: environment.primary[600],
            700: environment.primary[700],
            800: environment.primary[800],
            900: environment.primary[900]
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    MessageService, 
    provideHttpClient(),
    DatePipe,
    NumberFormatPipe,
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: 'none',
        }
      },
      ripple: true
    })
  ]
};

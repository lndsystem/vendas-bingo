import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { VendedorService } from '../service/vendedor.service';

export const vendedorInterceptor: HttpInterceptorFn = (req, next) => {
  const vendedorService = inject(VendedorService);
  const vendedor = vendedorService.getVendedor();

  if (vendedor && req.url.startsWith(environment.urlApi)) {
    return next(req.clone({
      setHeaders: {
        'X-VENDEDOR': vendedor
      }
    }));
  }

  return next(req);
};

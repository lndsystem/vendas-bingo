import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagamentoSseService {

  urlApi = environment.urlApi;

  constructor(private ngZone: NgZone) { }

  streamStatusPagamento(txId: string): Observable<string> {
    return new Observable(observer => {
      // Conecta no endpoint criado no Spring Boot
      const eventSource = new EventSource(`${this.urlApi}/titulos/stream/${txId}`);

      // Escuta o evento nomeado no Spring Boot ("pagamento-aprovado")
      eventSource.addEventListener('pagamento-aprovado', (event: any) => {
        this.ngZone.run(() => {
          observer.next(event.data);
          observer.complete();
        });
      });

      eventSource.onerror = (error) => {
        this.ngZone.run(() => {
          // Pode tratar reconexão ou erro aqui
          observer.error(error);
        });
      };

      // Fecha a conexão quando o componente for destruído
      return () => eventSource.close();
    });
  }
}

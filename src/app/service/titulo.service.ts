import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  constructor(private http : HttpClient ) { }

  _criarHeader(token: string) {
    const customHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Example: Authorization header
    });

    return {
      headers: customHeaders,
    };
  }
  // Consultar resultados
  getSorteios() {
    return this.http.get<any[]>(`http://localhost:8080/sorteios/6`);
  }

  getResultados(code: any) {
    return this.http.get<any[]>(`http://localhost:8080/sorteios/ganhadores/${code.sede}/${code.sorteio}`);
  }

  // Consultar Cliente e Titulos
  getClient(documento: string) {
    return this.http.post<any>(`http://localhost:8080/clientes`, {cpf : documento});
  }

  getTitulosUsuarios(token: string) {
    return this.http.get<any[]>(`http://localhost:8080/titulos/listar`, this._criarHeader(token));
  }

  getDetalhesTitulo(token: string, sorteio: number, titulo: number) {
    return this.http.get<any[]>(`http://localhost:8080/titulos/detalhes/${sorteio}/${titulo}`, this._criarHeader(token));
  }

  getEstados() {
    return this.http.get<any[]>(`http://localhost:8080/enderecos/estados`)
  }

  getMunicipios(uf: string) {
    return this.http.get<any[]>(`http://localhost:8080/enderecos/${uf}/municipios`)
  }

  salvarCliente(body: any) {
    return this.http.post<any>(`http://localhost:8080/clientes/salvar`, body);
  }

  verificarReferencia(referencia: string) {
    return this.http.get<any>(`http://localhost:8080/titulos/${referencia}`);
  }
}

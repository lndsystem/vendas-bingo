import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TituloService {

  urlApi = environment.urlApi;

  constructor(private http : HttpClient ) { }

  _criarHeader(token: string) {
    const customHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Example: Authorization header
      'Custom-Sede': environment.sede // Custom header for sede
    });

    return {
      headers: customHeaders,
    };
  }

  _criarHeaderSede() {
    const customHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Custom-Sede': environment.sede // Custom header for sede
    });

    return {
      headers: customHeaders,
    };
  }

  // Consultar resultados
  getSorteios() {
    return this.http.get<any[]>(`${this.urlApi}/sorteios/${environment.sede}`, this._criarHeaderSede());
  }

  getResultados(code: any) {
    return this.http.get<any[]>(`${this.urlApi}/sorteios/ganhadores/${code.sede}/${code.sorteio}`, this._criarHeaderSede());
  }

  // Consultar Cliente e Titulos
  getClient(documento: string) {
    return this.http.post<any>(`${this.urlApi}/clientes`, {cpf : documento}, this._criarHeaderSede());
  }

  getTitulosUsuarios(token: string) {
    return this.http.get<any[]>(`${this.urlApi}/titulos/listar`, this._criarHeader(token));
  }

  getDetalhesTitulo(token: string, sorteio: number, titulo: string) {
    return this.http.get<any[]>(`${this.urlApi}/titulos/detalhes/${sorteio}?titulo=${titulo.substring(1,titulo.length-1).replaceAll(" ", "")}`, this._criarHeader(token));
  }

  getEstados() {
    return this.http.get<any[]>(`${this.urlApi}/enderecos/estados`)
  }

  getMunicipios(uf: string) {
    return this.http.get<any[]>(`${this.urlApi}/enderecos/${uf}/municipios`)
  }

  salvarCliente(body: any) {
    return this.http.post<any>(`${this.urlApi}/clientes/salvar`, body, this._criarHeaderSede());
  }

  verificarReferencia(referencia: string) {
    return this.http.get<any>(`${this.urlApi}/titulos/${referencia}`, this._criarHeaderSede());
  }
}

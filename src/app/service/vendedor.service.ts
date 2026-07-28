import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TituloService } from './titulo.service';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private readonly storageKey = `vendedor-${environment.prefix}`;
  private readonly nomeStorageKey = `vendedor-nome-${environment.prefix}`;
  private readonly router = inject(Router);
  private readonly tituloService = inject(TituloService);

  private readonly vendedorSubject = new BehaviorSubject<string | null>(this.readFromStorage());
  private readonly nomeSubject = new BehaviorSubject<string | null>(this.readNomeFromStorage());
  private uuidNomeCarregado: string | null = null;

  readonly vendedor$ = this.vendedorSubject.asObservable();
  readonly nomeVendedor$ = this.nomeSubject.asObservable();

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.capturarDaRotaAtual());

    // Captura imediata caso a app já tenha iniciado na rota com vendedor
    queueMicrotask(() => {
      this.capturarDaRotaAtual();

      const uuid = this.getVendedor();
      if (uuid && !this.getNomeVendedor()) {
        this.carregarNome(uuid);
      }
    });
  }

  getVendedor(): string | null {
    return this.vendedorSubject.value;
  }

  getNomeVendedor(): string | null {
    return this.nomeSubject.value;
  }

  setVendedor(vendedor: string | null | undefined): void {
    const valor = (vendedor ?? '').trim();

    if (!valor || !UUID_REGEX.test(valor)) {
      return;
    }

    const uuidAnterior = this.vendedorSubject.value;
    sessionStorage.setItem(this.storageKey, valor);
    this.vendedorSubject.next(valor);

    if (uuidAnterior !== valor || !this.nomeSubject.value) {
      this.carregarNome(valor);
    }
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.nomeStorageKey);
    this.uuidNomeCarregado = null;
    this.vendedorSubject.next(null);
    this.nomeSubject.next(null);
  }

  /** Monta o comando de navegação preservando o UUID do vendedor, se existir. */
  path(...segments: (string | number)[]): any[] {
    const vendedor = this.getVendedor();
    const limpos = segments
      .map((segment) => String(segment).replace(/^\/+|\/+$/g, ''))
      .filter((segment) => segment.length > 0);

    if (vendedor) {
      return limpos.length > 0 ? ['/', ...limpos, vendedor] : ['/', vendedor];
    }

    return limpos.length > 0 ? ['/', ...limpos] : ['/'];
  }

  private carregarNome(uuid: string): void {
    if (this.uuidNomeCarregado === uuid && this.nomeSubject.value) {
      return;
    }

    this.tituloService.getVendedor().subscribe({
      next: (data) => {
        const nome = this.extrairNome(data);
        this.uuidNomeCarregado = uuid;

        if (nome) {
          sessionStorage.setItem(this.nomeStorageKey, nome);
          this.nomeSubject.next(nome);
        } else {
          sessionStorage.removeItem(this.nomeStorageKey);
          this.nomeSubject.next(null);
        }
      },
      error: () => {
        this.uuidNomeCarregado = null;
        sessionStorage.removeItem(this.nomeStorageKey);
        this.nomeSubject.next(null);
      }
    });
  }

  private extrairNome(data: any): string | null {
    if (!data) {
      return null;
    }

    if (typeof data === 'string') {
      return data.trim() || null;
    }

    const nome = data.nome ?? data.name ?? data.nomeVendedor ?? null;
    return typeof nome === 'string' && nome.trim() ? nome.trim() : null;
  }

  private capturarDaRotaAtual(): void {
    let route = this.router.routerState.snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const vendedor = route.params['vendedor'];
    if (vendedor) {
      this.setVendedor(vendedor);
    }
  }

  private readFromStorage(): string | null {
    const valor = sessionStorage.getItem(this.storageKey);
    if (valor && UUID_REGEX.test(valor)) {
      return valor;
    }
    return null;
  }

  private readNomeFromStorage(): string | null {
    return sessionStorage.getItem(this.nomeStorageKey);
  }
}

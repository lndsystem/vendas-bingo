import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { VendedorService } from '../../service/vendedor.service';

@Component({
  selector: 'app-header',
  imports: [PanelModule, ButtonModule, RouterLink, AsyncPipe],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private readonly vendedorService = inject(VendedorService);

  environment = environment;

  @Input() comprar: boolean = false;

  linkConsulta: any[] = ['/'];
  linkComprar: any[] = ['/comprar'];
  nomeVendedor$ = this.vendedorService.nomeVendedor$;
  
  ngOnInit(): void {
    this.linkConsulta = this.vendedorService.path('/');
    this.linkComprar = this.vendedorService.path('/comprar');

    this.vendedorService.vendedor$.subscribe(() => {
      this.linkConsulta = this.vendedorService.path('/');
      this.linkComprar = this.vendedorService.path('/comprar');
    });
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environment';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { VendedorService } from './service/vendedor.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, ToastModule, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'vendas-bingo';
  environment = environment;

  // Garante captura do UUID do vendedor desde o boot da aplicação
  private readonly vendedorService = inject(VendedorService);

  ngOnInit(): void {
    this.setFavicon(this.environment.favicon);
  }

  setFavicon(iconPath: string) {
    const link: HTMLLinkElement = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = iconPath;
    document.head.appendChild(link);

    const titleElement: HTMLTitleElement = document.querySelector('title') || document.createElement('title');
    titleElement.textContent = this.environment.titulo;
    document.head.appendChild(titleElement);

  }
}

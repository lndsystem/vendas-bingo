import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { ToastModule } from 'primeng/toast';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'vendas-bingo';
  environment = environment;

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

import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ConsultTicketComponent } from '../../components/consult-ticket/consult-ticket.component';
import { Router } from '@angular/router';
import { TituloService } from '../../service/titulo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-consult',
  imports: [HeaderComponent, ConsultTicketComponent],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.css'
})
export class ConsultComponent implements OnInit{
  
  titulos: any[] = [];

  constructor(private tituloService: TituloService, private router: Router) {
    
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem(`token-${environment.prefix}`);
    if (token) {
      const session = JSON.parse(token);
      const dataToken = new Date(session.expiresAt);

      if (dataToken < new Date()) {
        this.router.navigate(['/']);  
      } else {
        this.tituloService.getTitulosUsuarios(session.token).subscribe({
          next: (data) => {            
            this.titulos = data;
          }
        });
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}

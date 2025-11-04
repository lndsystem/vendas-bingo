import { Component, Input, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Panel, PanelModule } from 'primeng/panel';
import { NumberFormatPipe } from '../../pipe/number-format.pipe';
import { TituloService } from '../../service/titulo.service';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-consult-ticket',
  imports: [Panel, Button, Dialog, NumberFormatPipe, PanelModule, DatePipe],
  templateUrl: './consult-ticket.component.html',
  styleUrl: './consult-ticket.component.css'
})
export class ConsultTicketComponent implements OnInit {

  @Input() titulos:any[] =  [];
  
  visible = false;
  ticketSelecionado: any = {};
  premios: any[] = [];
  sorteioJaOcorreu = false;

  constructor(private tituloService: TituloService, private format: NumberFormatPipe, private router : Router) {
  }
  
  ngOnInit(): void {
  }

  verBilhetes(ticket: any) {
    this.ticketSelecionado = ticket;
    const dataSorteio = new Date(`${ticket.dataSorteio}T${ticket.hora}`);
    
    this.sorteioJaOcorreu = false;
    if (new Date() > dataSorteio) {
      const token = sessionStorage.getItem('token-agro');
      if (token) {
        const session = JSON.parse(token);
        const dataToken = new Date(session.expiresAt);

        if (dataToken < new Date()) {
          this.router.navigate(['/']);  
        } else {
          this.tituloService.getDetalhesTitulo(session.token, ticket.idSorteio, ticket.titulo).subscribe({
            next: (data) => {
              this.premios = data;
              this.visible = true;
              this.sorteioJaOcorreu = true;
            }
          })
        }
      }
    } else {
      this.visible = true;
    }
  }

  bolaSorteada(dezena: number, dezenas: number[]) {
    return dezenas.includes(dezena) ? 'dezena-premiada' : ''
  }

  converterTituloArray(titulo: number) {
    const v = this.format.transform(titulo, 6, '0', '.', ',', 0).replace('.', '');
    const array = [];
    for(let i=0;i<6;i++) {
      array.push(v.substring(i,i+1));
    }
    return array;
  }
}

import { Component, OnInit } from '@angular/core';
import { Panel } from 'primeng/panel';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TituloService } from '../../service/titulo.service';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface Contemplado {  
  titulo: number;
  tituloSalto: number;
  ganhador: string;
  bairro?: string;
  cidade?: string;
  vendedor: string;
  valor: number;
}

interface Premio {
  ordem: number;
  descricao: string;
  valor: number;
  tipo: string;
  dezenas: number[];
  imagem: string;
  ganhadores: Contemplado[];
  expanded: boolean;
}

interface Code {
  sede: number;
  sorteio: number;
}

interface Drowpdown {
  name?: string;
  code: Code;
}

@Component({
  selector: 'app-result-ticket',
  imports: [Panel, CommonModule, ButtonModule, Select, FormsModule],
  standalone: true,
  templateUrl: './result-ticket.component.html',
  styleUrl: './result-ticket.component.css'
})
export class ResultTicketComponent implements OnInit{
  premios: Premio[] = [];
  sorteios: Drowpdown[] = [];
  sorteioSelecionado: any = {};
  
  constructor(private tituloService : TituloService, private datePipe: DatePipe) {}
  
  ngOnInit(): void {
    this.tituloService.getSorteios().subscribe({
      next: (data) => {
        return this.sorteios = data.map((s) => {          
          const nome = this.datePipe.transform(new Date(`${s.sorteio}T${s.hora}`), 'dd/MM/yyyy HH:mm') || '';
          return {
            name: nome,
            code: {
              sede: s.sede,
              sorteio: s.id
            }
          };
        })
      }
    })
  }
  
  selectSelecionado() {
    this.tituloService.getResultados(this.sorteioSelecionado.code).subscribe({
      next: (data) => {
        this.premios = data;
      }
    })
  }

  toggleExpanded(premio: Premio) {
    premio.expanded = !premio.expanded;
  }

  formatarDezena(numero: number): string {
    return numero.toString().padStart(2, '0');
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(valor);
  }
}

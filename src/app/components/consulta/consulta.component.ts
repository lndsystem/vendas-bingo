import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { TituloService } from '../../service/titulo.service';
import { Router } from '@angular/router';
import { CadastroComponent } from "../cadastro/cadastro.component";

@Component({
  selector: 'app-consulta',
  imports: [PanelModule, ButtonModule, InputMaskModule, FormsModule, CadastroComponent],
  standalone: true,
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent implements OnInit {
  
  @ViewChild('doc', { read: ElementRef }) cpfInput!: ElementRef;

  documento = '';
  exibirMsg = false;
  visible = false;
  
  constructor(private tituloService: TituloService, private router : Router) {

  }
  
  ngOnInit(): void {
    sessionStorage.removeItem('token-agro');
  }

  pesquisar() {
    if(this.documento.length < 14) {
      this.exibirMsg = true;
    }else {
      this.exibirMsg = false;

      /*const token = sessionStorage.getItem('token-agro');
      if(token) {
        
        const session = JSON.parse(token);
        const dataToken = new Date(session.expiresAt);
        if(new Date() < dataToken) {
          this.router.navigate(['/consulta']);
          return;
        }
      }*/

      this.tituloService.getClient(this.documento).subscribe({
        next: (data) => {
          sessionStorage.setItem('token-agro', JSON.stringify(data));
          this.router.navigate(['/consulta']);
        },
        error: (error) => {
          console.log(error);
          this.visible = true;
        }
      });
    }
  }
}

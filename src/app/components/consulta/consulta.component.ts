import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consulta',
  imports: [PanelModule, ButtonModule, InputMaskModule, FormsModule],
  standalone: true,
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css'
})
export class ConsultaComponent implements OnInit {
  
  @ViewChild('doc', { read: ElementRef }) cpfInput!: ElementRef;

  documento = '';
  exibirMsg = false;
  
  ngOnInit(): void {
    
  }

  pesquisar() {
    if(this.documento.length < 14) {
      this.exibirMsg = true;
    }else {
      this.exibirMsg = false;
    }
  }
}

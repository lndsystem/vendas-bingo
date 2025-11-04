import { Component, Input, OnInit } from '@angular/core';
import { Panel } from 'primeng/panel';
import { QRCodeComponent } from 'angularx-qrcode';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pix-result',
  standalone: true,
  imports: [Panel, QRCodeComponent],
  templateUrl: './pix-result.component.html',
  styleUrl: './pix-result.component.css'
})
export class PixResultComponent implements OnInit {
  @Input() dadosTitulo: any = {};

  constructor(private message: MessageService) {

  }
  ngOnInit(): void {

  }

  async copiarConteudo(elemento: HTMLElement) {
    try {
    const texto = elemento.innerText;
    await navigator.clipboard.writeText(texto);
    this.message.add({severity: 'info', summary: 'Informativo', detail: 'Código do PIX \ncopiado com sucesso!'});
    } catch (err) {
      console.log('Erro ao copiar: ', err);
    }
  }
}

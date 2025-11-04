import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TituloService } from '../../service/titulo.service';
import Swal from 'sweetalert2';
import { PixResultComponent } from "../../components/pix-result/pix-result.component";

@Component({
  selector: 'app-consult-pix',
  imports: [HeaderComponent, PixResultComponent],
  templateUrl: './consult-pix.component.html',
  styleUrl: './consult-pix.component.css'
})

//http://agro.titulo.click/pix/T00600352021250806250831060019
export class ConsultPixComponent implements OnInit, OnDestroy{

  referencia!: Subscription;
  titulo: any = {};

  constructor(private route: ActivatedRoute, private tituloService: TituloService) {

  }
  
  ngOnInit(): void {
    this.referencia = this.route.params.subscribe(params => {
      const ref = params['referencia'];
      this.tituloService.verificarReferencia(ref).subscribe({
        next: (data) => {
          this.titulo = data;
          console.log(data);
        },
        error: (error) => {
          console.log(error);
          if (error.status === 500) {
            console.log('erro 500')
          } else if (error.status === 404) {
            this.showAlert(ref, 'Bilhete não encontrado', `A referência '${ref}' não foi localizada em nosso sistema.`);
          } 
        }
      });
    })
  }

  ngOnDestroy(): void {
    this.referencia.unsubscribe;
  }

  showAlert(ref: string, title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: `error`
    });
  }
}

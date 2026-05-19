import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TituloService } from '../../service/titulo.service';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-pay-ticket',
  imports: [
    CommonModule, 
    FormsModule, 
    PanelModule, 
    DialogModule, 
    SelectModule,
    InputTextModule, 
    InputMaskModule, 
    ButtonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule
  ],
  templateUrl: './pay-ticket.component.html',
  styleUrl: './pay-ticket.component.css'
})
export class PayTicketComponent implements OnInit{

  visible = true;
  estados: any[] = [];
  municipios: any[] = [];

  loading = false;
  precisaCadastrar = false;

  myForm!: FormGroup;

  documento = '';

  podeComprar = false;

  nomeComprador = '';

  tituloComprar: any = [];

  constructor(private tituloService: TituloService, private router : Router) {

  }

  ngOnInit(): void {
    
  }

  entrar() {
    if(this.documento.replace(/\D/g, '').length == 11) {
      const cpfLimpo = this.documento.replace(/\D/g, '');

      this.tituloService.isExistClient(cpfLimpo).subscribe({
        next: (data) => {
          this.visible = false;
          this.nomeComprador = data.nome;
          this.podeComprar = true;

          this.tituloService.getTituloComprar().subscribe({
            next: (data) => {
              this.tituloComprar = data;
            }
          });
        },
        error: (error) => {
          this.tituloService.getEstados().subscribe({
            next: (data) => {
              this.estados = data.map(e => { return {name: e.nome, code: e.sigla}; }) 
            }
          });
          this.initForm()
          this.precisaCadastrar = true;
        }
      });
      return;
    }
  }

  initForm() {
    this.myForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(5)]),
      cpf: new FormControl(this.documento, [Validators.required ]),
      celular: new FormControl('', Validators.required),
      uf: new FormControl('', []),
      municipio: new FormControl('', Validators.required),
      email: new FormControl('', [])
    });
  }

  getMunicipios(event: any) {
    this.loading = true;
    this.tituloService.getMunicipios(event.value).subscribe({
      next: (data) => {
        this.loading = false;
        this.municipios = data.map(m => {return {name: m, code: m}});
      }
    });
  }

  cadastrar() {
    if (this.myForm.valid) {
      const body = this.myForm.value;

      this.tituloService.salvarCliente(body).subscribe({
        next: (data) => {
          this.tituloService.getTituloComprar().subscribe({
            next: (data) => {
              this.tituloComprar = data;
            }
          });
          
          this.visible = false;
          this.nomeComprador = body.nome;
          this.podeComprar = true;
          //this.loadingSave = false;
        },
        error: (data) => {
          console.log(data);
          //this.loadingSave = false;
        },
      })
    }
  }
}

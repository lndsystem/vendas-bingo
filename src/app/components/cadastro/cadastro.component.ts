import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TituloService } from '../../service/titulo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [
    PanelModule, 
    ButtonModule, 
    InputMaskModule, 
    FormsModule, 
    Dialog, 
    InputTextModule, 
    SelectModule, 
    ButtonModule, 
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() documento: string = ''; 
  @Input() nome: string = '';
  @Input() documentoBanco: string = '';

  loading = false;
  
  estados: any[] = [];
  municipios: any[] = [];

  myForm!: FormGroup;

  constructor(private tituloService: TituloService, private router : Router) {
    
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      nome: new FormControl(this.nome, [Validators.required, Validators.minLength(5)]),
      cpf: new FormControl(this.documento, Validators.required),
      celular: new FormControl('', Validators.required),
      uf: new FormControl('', []),
      municipio: new FormControl('', Validators.required),
      email: new FormControl('', [])
    });

    this.tituloService.getEstados().subscribe({
      next: (data) => {
        this.estados = data.map(e => { return {name: e.nome, code: e.sigla}; }) 
      }
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

  onSubmit() {
    if (this.myForm.valid) {
      this.tituloService.salvarCliente(this.myForm.value).subscribe({
        next: (data) => {
          this.visible = false;
        }
      })
    }
  }
}

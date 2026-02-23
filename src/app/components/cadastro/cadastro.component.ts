import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { cpfMiddleDigitsValidator } from '../validation/document.validatior';
import { cpfValidator } from '../validation/cpf.validator';

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
export class CadastroComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() documento: string = ''; 
  @Input() nome: string = '';
  @Input() documentoBanco: string = '';
  @Input()titulo: any = {};
  
  loading = false;
  loadingSave = false;
  
  estados: any[] = [];
  municipios: any[] = [];


  myForm!: FormGroup;

  constructor(private tituloService: TituloService, private router : Router) {
    
  }

  ngOnInit(): void {
    this.tituloService.getEstados().subscribe({
      next: (data) => {
        this.estados = data.map(e => { return {name: e.nome, code: e.sigla}; }) 
      }
    });

    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['nome'] && this.nome) {
      this.initForm();
    }
  }

  initForm() {
    this.myForm = new FormGroup({
      nome: new FormControl(this.nome, [Validators.required, Validators.minLength(5)]),
      cpf: new FormControl(this.documento, [Validators.required, cpfMiddleDigitsValidator(this.documentoBanco), cpfValidator()]),
      celular: new FormControl('', Validators.required),
      uf: new FormControl('', []),
      municipio: new FormControl('', Validators.required),
      email: new FormControl('', [])
    });
  }

  get cpfControl() {
    return this.myForm.get('cpf');
  }

  preencherFormulario() {
    
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
      const body = this.myForm.value;
      body.referencia = this.titulo.titulo;

      this.loadingSave = true
      this.tituloService.salvarCliente(body).subscribe({
        next: (data) => {
          this.visible = false;
          this.loadingSave = false;
        },
        error: (data) => {
          console.log(data);
          this.loadingSave = false;
        },
      })
    }
  }
}

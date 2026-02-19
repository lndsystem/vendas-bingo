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
import { TooltipModule } from 'primeng/tooltip';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function cpfMiddleDigitsValidator(expectedMiddleDigits: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value as string;

    // Remove máscara: "123.456.789-00" → "12345678900"
    const cpfClean = cpf?.replace(/\D/g, '') ?? '';

    // Verifica se o CPF foi completamente preenchido (11 dígitos)
    if (cpfClean.length < 11) {
      return { cpfIncomplete: true };
    }

    // Extrai os 6 dígitos do meio (posições 3 a 8, índice 3..8)
    // CPF: XXX . [YYY.YYY] - ZZ  →  índices 3,4,5,6,7,8
    const middleDigits = cpfClean.substring(3, 9);

    console.log(middleDigits);
    console.log(expectedMiddleDigits);

    if (middleDigits !== expectedMiddleDigits.replace(/\D/g, '')) {
      return { cpfMiddleMismatch: true };
    }

    return null;
  };
}

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

  loading = false;
  
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
      cpf: new FormControl(this.documento, [Validators.required, cpfMiddleDigitsValidator(this.documentoBanco)]),
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
    console.log('Preencher formulario')
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
        },
        error: (data) => {
          console.log(data);
        }
      })
    }
  }
}

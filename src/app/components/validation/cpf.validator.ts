import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;

    if (!cpf) return null; // Deixe o Validators.required lidar com campos vazios

    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');

    if (cleanCpf.length < 11 || isValidCpf(cleanCpf)) {
      return null; // CPF válido
    } else {
      return { cpfInvalid: true }; // CPF inválido
    }
  };
}

// Lógica de validação do CPF (cálculo dos dígitos)
function isValidCpf(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let rest;

  // Validação do primeiro dígito
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  // Validação do segundo dígito
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

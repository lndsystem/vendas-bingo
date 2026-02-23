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

    if (!expectedMiddleDigits.replace(/\D/g, '')) {
      console.log('entrou aqui')
      return null;
    }

    if (middleDigits !== expectedMiddleDigits.replace(/\D/g, '')) {
      return { cpfMiddleMismatch: true };
    }

    return null;
  };
}
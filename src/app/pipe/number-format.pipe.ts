import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {
  /**
   * Formata um número adicionando caracteres à esquerda e separador de milhar
   * @param value - Valor a ser formatado
   * @param padLength - Tamanho total desejado (com padding)
   * @param padChar - Caractere para preencher à esquerda (padrão: '0')
   * @param thousandSeparator - Separador de milhar (padrão: '.')
   * @param decimalSeparator - Separador decimal (padrão: ',')
   * @param decimalPlaces - Casas decimais (padrão: 0)
   */
  transform(value: number | string,
    padLength: number = 0,
    padChar: string = '0',
    thousandSeparator: string = '.',
    decimalSeparator: string = ',',
    decimalPlaces: number = 0): string {
    
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (typeof value === 'object') {
      return ''; // evita crash com objetos inesperados
    }

    // Converte para número
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return value.toString();
    }

    // Formata com casas decimais se necessário
    const fixedValue = decimalPlaces > 0 
      ? numValue.toFixed(decimalPlaces) 
      : Math.round(numValue).toString();

    // Separa parte inteira e decimal
    const parts = fixedValue.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];

    // Adiciona separador de milhar
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    // Adiciona padding à esquerda (antes do separador de milhar)
    if (padLength > 0) {
      const currentLength = integerPart.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '').length;
      const paddingNeeded = padLength - currentLength;
      
      if (paddingNeeded > 0) {
        const padding = padChar.repeat(paddingNeeded);
        integerPart = padding + integerPart;
      }
    }

    // Junta parte inteira e decimal
    let result = integerPart;
    if (decimalPart) {
      result += decimalSeparator + decimalPart;
    }

    return result;
  }
}
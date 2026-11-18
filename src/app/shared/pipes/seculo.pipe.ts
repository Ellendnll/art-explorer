import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seculo',
  standalone: true
})
export class SeculoPipe implements PipeTransform {

  transform(ano: number | null | undefined): string {
    if (ano === null || ano === undefined || isNaN(ano)) {
      return '';
    }

    // Anos antes de 1 d.C. ou zero não têm século válido na contagem usual
    if (ano <= 0) {
      return '';
    }

    const seculo = Math.ceil(ano / 100);
    return `Século ${this.paraRomano(seculo)}`;
  }

  private paraRomano(numero: number): string {
    const valores = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const simbolos = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

    let resultado = '';
    let restante = numero;

    for (let i = 0; i < valores.length; i++) {
      while (restante >= valores[i]) {
        resultado += simbolos[i];
        restante -= valores[i];
      }
    }

    return resultado;
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descricaoCurta',
  standalone: true
})
export class DescricaoCurtaPipe implements PipeTransform {

  transform(texto: string | null | undefined, limite: number = 100): string {
    if (!texto) {
      return '';
    }

    // Remove tags HTML que a API pode retornar na descrição
    const textoLimpo = texto.replace(/<[^>]*>/g, '').trim();

    if (textoLimpo.length <= limite) {
      return textoLimpo;
    }

    return textoLimpo.substring(0, limite).trimEnd() + '...';
  }
}
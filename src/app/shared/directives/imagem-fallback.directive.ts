import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

import { IMAGEM_PADRAO } from '../../core/services/obras.service';

/**
 * Diretiva personalizada 2: appImagemFallback
 *
 * Quando uma <img> falha ao carregar (URL quebrada, obra sem imagem,
 * sem internet...), troca automaticamente pela imagem padrão do app
 * (a mesma constante IMAGEM_PADRAO usada pelo ObrasService).
 * Evita espaços vazios e o ícone de "imagem quebrada".
 *
 * Uso:
 *   <img [src]="obra.imageUrl" appImagemFallback />
 *   <img [src]="obra.imageUrl" appImagemFallback="assets/outra.png" />  (opcional)
 *
 * Obs.: no Angular 19+ toda diretiva é standalone por padrão.
 */
@Directive({
  selector: '[appImagemFallback]',
})
export class ImagemFallbackDirective {
  /** Caminho de uma imagem alternativa (opcional). */
  readonly appImagemFallback = input<string>('');

  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef);

  @HostListener('error')
  aoFalharCarregamento(): void {
    const img = this.el.nativeElement;
    const destino = this.appImagemFallback() || IMAGEM_PADRAO;

    // Se já estamos mostrando a imagem padrão, não faz nada
    // (evita loop infinito caso a própria imagem padrão não exista).
    if (img.getAttribute('src') === destino) {
      return;
    }
    img.setAttribute('src', destino);
  }
}

/*
 * ============================================================
 * ANOTAÇÕES PARA A APRESENTAÇÃO — Diretiva appImagemFallback
 * ============================================================
 * O QUE O REQUISITO FAZ NO PROJETO?
 *   É uma diretiva de atributo personalizada que detecta erro no
 *   carregamento de uma imagem (evento "error" via @HostListener) e
 *   a substitui pela imagem padrão (assets/images/imagem-padrao.png).
 *   Assim o app nunca mostra imagem quebrada ou espaço vazio quando
 *   a API do Art Institute não devolve a imagem de uma obra.
 *
 * ONDE ESTÁ NO CÓDIGO?
 *   - Criada em: src/app/shared/directives/imagem-fallback.directive.ts
 *   - Importada em: src/app/pages/favorites/favorites.page.ts (array `imports`)
 *   - Aplicada em: src/app/pages/favorites/favorites.page.html
 *     (<img [src]="..." appImagemFallback />)
 *
 * ONDE PODE SER VISTO EM TELA?
 *   Na página Favoritos (rota /favoritos): se a imagem de uma obra
 *   favorita não carregar (ex.: sem internet), aparece a imagem padrão
 *   em vez do ícone de imagem quebrada. Para demonstrar: favoritar uma
 *   obra e, nas ferramentas do navegador (F12 > Network), bloquear
 *   "/iiif" ou ficar offline e recarregar a página Favoritos.
 * ============================================================
 */

import { Directive, HostBinding, HostListener, input, signal } from '@angular/core';

/**
 * Diretiva personalizada 1: appDestaqueObra
 *
 * Aplica borda dourada + sombra vinho aos cards de obras e um efeito
 * de "elevação" quando o usuário passa o mouse / toca no card.
 *
 * Uso:
 *   <ion-card appDestaqueObra> ... </ion-card>
 *   <ion-card [appDestaqueObra]="'#7b2d3b'"> ... </ion-card>  (cor opcional)
 *
 * Obs.: no Angular 19+ toda diretiva é standalone por padrão
 * (não precisa escrever `standalone: true`). Basta colocá-la no `imports`
 * do componente que a utiliza.
 */
@Directive({
  selector: '[appDestaqueObra]',
})
export class DestaqueObraDirective {
  /** Cor da borda (opcional). Se não informar, usa o dourado do tema. */
  readonly appDestaqueObra = input<string>('');

  /** true enquanto o mouse/dedo está sobre o card */
  private readonly ativo = signal(false);

  @HostBinding('style.border')
  get borda(): string {
    const cor = this.appDestaqueObra() || '#b8923e';
    return `1px solid ${cor}`;
  }

  @HostBinding('style.boxShadow')
  get sombra(): string {
    return this.ativo()
      ? '0 10px 24px rgba(123, 45, 59, 0.32)'
      : '0 2px 10px rgba(123, 45, 59, 0.16)';
  }

  @HostBinding('style.transform')
  get elevacao(): string {
    return this.ativo() ? 'translateY(-3px)' : 'translateY(0)';
  }

  @HostBinding('style.transition')
  readonly transicao = 'box-shadow 0.25s ease, transform 0.25s ease';

  @HostBinding('style.borderRadius')
  readonly cantos = '16px';

  @HostListener('mouseenter')
  @HostListener('touchstart')
  aoEntrar(): void {
    this.ativo.set(true);
  }

  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  aoSair(): void {
    this.ativo.set(false);
  }
}

/*
 * ============================================================
 * ANOTAÇÕES PARA A APRESENTAÇÃO — Diretiva appDestaqueObra
 * ============================================================
 * O QUE O REQUISITO FAZ NO PROJETO?
 *   É uma diretiva de atributo personalizada que destaca visualmente
 *   os cards de obras: borda dourada, sombra vinho e um efeito de
 *   elevação ao passar o mouse (ou tocar) no card. Usa @HostBinding
 *   para alterar o estilo do elemento e @HostListener para reagir
 *   aos eventos de mouse/toque.
 *
 * ONDE ESTÁ NO CÓDIGO?
 *   - Criada em: src/app/shared/directives/destaque-obra.directive.ts
 *   - Importada em: src/app/pages/favorites/favorites.page.ts (array `imports`)
 *   - Aplicada em: src/app/pages/favorites/favorites.page.html
 *     (<ion-card appDestaqueObra>)
 *
 * ONDE PODE SER VISTO EM TELA?
 *   Na página Favoritos (rota /favoritos): cada card de obra salva
 *   aparece com borda dourada e sombra; ao passar o mouse sobre o card
 *   ele "sobe" e a sombra fica mais forte.
 * ============================================================
 */

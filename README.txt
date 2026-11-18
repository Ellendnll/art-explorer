**Pendente: diretiva appImagemFallback (integrante 4) e rotas em app.routes.ts (integrante 1).**

ARTEXPLORE - INSTRUÇÕES DO INTEGRANTE 3

Responsável: Requisito 3 (pipes) e Requisito 6 (parâmetro por rota)

ARQUIVOS DO INTEGRANTE 3
- src/app/shared/pipes/seculo.pipe.ts
- src/app/shared/pipes/descricao-curta.pipe.ts
- src/app/pages/details/details.page.ts
- src/app/pages/details/details.page.html
- src/app/pages/details/details.page.scss

PIPES
- Built-in: TitleCasePipe (titlecase) e UpperCasePipe (uppercase), importados de @angular/common
- Personalizados: seculo (1889 -> Século XIX) e descricaoCurta (limita caracteres com reticências)

ROTA
- Configurar em app.routes.ts:
  { path: 'detalhes/:id', loadComponent: () => import('./pages/details/details.page').then(m => m.DetailsPage) }
- Na Home e na Explorar, o clique deve navegar para /detalhes/{{ obra.id }}

DEPENDÊNCIAS
- Integrante 2: artwork.model.ts, obras.service.ts (getArtworkById), favoritos.service.ts (isFavorite, toggleFavorite)
- Integrante 4: imagem-fallback.directive.ts (appImagemFallback)

IMPORTS DO IONIC
- Usamos o pacote @ionic/angular (v9). Não usar @ionic/angular/standalone.

COMO TESTAR
- ionic serve
- Abrir /detalhes/27992 e outro ID válido
- Testar um ID inválido

Integrante 3 - ArtExplore
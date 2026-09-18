# Inspeção e decisões

## Repositório original

Origem: `https://github.com/Eduardo-Marins/SCRUMBAN_QUESTIONARIO.git`, commit `5c01782c3810a374ea194ddaeb258eb4feedf4d5`.

A pasta de trabalho estava vazia, com apenas Git inicializado. O histórico remoto foi trazido para a branch `codex/scrumban-quests`. O original tinha três arquivos: `index.html`, `main.js` e `style.css`. Sem dependências, rotas, backend, persistência ou biblioteca de animação. O quiz tinha cinco perguntas com cinco alternativas, bloqueava respostas repetidas e permitia recomeçar.

Esses comportamentos foram preservados, com o avanço manual substituído pelo feedback de batalha solicitado. As cinco questões e cinco alternativas foram mantidas em versões mais curtas para leitura no celular. A última questão tinha gabarito `1` (eliminar a divisão de responsabilidades), incorreto para seu enunciado; foi corrigido para `2` (possível indefinição de responsabilidades).

## Assets

`asset-inventory.json` registra todos os 19 arquivos e suas dimensões.

| Fonte | Análise e uso |
| --- | --- |
| Armário 1–8 | Oito perspectivas transparentes. Todas otimizadas em WebP; seis formam o percurso frente → lateral → traseira. |
| marioAssets.jpeg | Ângulos, expressões e poses. Recortes de costas, parado, salto, agachado e retratos feliz/triste. |
| bowserAssets.jpeg | Ângulos, expressões e poses. Recortes de batalha, comemoração, dano e retratos feliz/triste. |
| marioSprites.jpeg | Ciclos adicionais examinados; a folha maior de poses foi escolhida para consistência e resolução. |
| boserSprites.jpeg | Ciclos adicionais de passos, fogo e salto examinados; poses principais reutilizadas da folha complementar. |
| spritesGame.jpg | Estrela, cogumelo, moeda e baú extraídos; créditos preservados no manual. |
| backgrounds.png | Campo de batalha gramado extraído da primeira linha. |
| assetsAndBattleEfct.png | Referência dos painéis de batalha. HUD recriado em CSS para conter texto acessível e HP dinâmico. |
| efects.png | Ataques e efeitos examinados. Feedback de dano usa sprites + CSS, evitando carregar a folha inteira. |
| lifeAndTalking.jpeg | Balões e vidas examinados; textos e grade estão incorporados à imagem. Balões CSS com os retratos de expressão fornecidos permitem feedback legível e acessível. |
| nameAndTipo.png | Referência de seleção/entrada; não é necessário cadastrar nomes para este fluxo. |
| superScrumban64.jpeg | Marca anterior examinada; nova composição tipográfica utiliza o nome solicitado SCRUMBAN QUESTS. |

Nenhuma imagem externa foi usada. Preparação mecânica com Sharp: recorte, remoção do fundo cromático, ajuste de dimensões e WebP. Fontes locais. Sem emojis substituindo os itens.

## Direção visual e motion

Creme, verde profundo, vermelho queimado e madeira. Display Anton, pixel VT323 e DM Sans para alternativas/textos longos. A referência publicitária orientou sobreposição, tipografia monumental, objeto central e profundidade; sem preço ou reprodução do anúncio.

A seção sticky dura 380svh em desktop e 310svh em celular. O scroll controla escala, rotação, vistas, posição, opacidade e desfoque. `requestAnimationFrame` só continua enquanto aproxima o progresso atual do scroll, e os listeners são removidos ao trocar de tela. Ao inverter a rolagem, a cena reverte. Com movimento reduzido, desaparecem zoom, rotação contínua e animações decorativas.

O cenário é uma sequência de imagens em perspectivas distintas, não um objeto WebGL. Não foi adicionada uma biblioteca 3D/GSAP para reproduzir um efeito já atendido pelos assets locais.

## Rotas

`#/` Hero; `#/menu` menu; `#/saves` arquivos; `#/battle/1`–`3` batalha; `#/result/1`–`3` resultado. Rotas inválidas retornam ao início; arquivo inexistente retorna à seleção; resultado incompleto vai para batalha e partida concluída vai para resultado.

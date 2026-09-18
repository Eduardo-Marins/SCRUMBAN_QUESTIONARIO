# Scrumban Quests

Uma pequena aventura educativa em cinco perguntas: entre no armário, escolha seu arquivo e enfrente Bowser com o que você sabe sobre Scrumban.

## Executar

Requer Node.js 22.12+ (ou 20.19+).

```sh
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. Não abra `index.html` diretamente pelo sistema de arquivos: o projeto usa módulos JavaScript.

```sh
npm test        # testes de regras e persistência, usando node:test
npm run build  # produção em dist/
npm run preview
```

A pasta `dist/` pode ser servida por qualquer hospedagem estática. O build usa base relativa e rotas por hash, funcionando também em subdiretórios e GitHub Pages sem regras de reescrita. Nenhum backend ou serviço externo é necessário.

## Organização

- `main.js`: navegação, ciclo de telas e eventos da aplicação.
- `src/data/questions.js`: perguntas, alternativas, gabarito e explicações.
- `src/game/`: regras puras, validação dos saves e áudio opcional.
- `src/ui/`: Hero/menu, arquivos, batalha, resultados e componentes de HUD.
- `src/motion/scroll-scene.js`: animação reversível ligada à rolagem.
- `style.css` e `src/styles/`: identidade visual e layouts responsivos.
- `public/assets/`: imagens locais extraídas e otimizadas dos materiais fornecidos.
- `scripts/prepare-assets.mjs`: extração reproduzível dos assets.
- `tests/`: 11 testes do jogo, persistência e controlador de scroll, incluindo movimento reduzido.
- `docs/`: inventário, decisões e validação.

HTML, CSS e JavaScript nativos, preservando a stack original. Vite e Sharp são ferramentas de desenvolvimento; não há framework ou dependência JavaScript de produção. Fontes Anton, VT323 e DM Sans são hospedadas junto com o build, sem chamadas ao Google Fonts.

## Regras e controles

Mario e Bowser começam com 5 HP. Acertar remove 1 HP do Bowser; errar remove 1 HP do Mario. A partida termina após todas as cinco perguntas. Vitória exige `Mario HP > Bowser HP`; empate é derrota. Cada acerto vale 100 pontos.

Use mouse/toque ou as teclas **A–E**. **Tab** navega e **Enter** seleciona. O feedback bloqueia novas respostas por 1.350 ms. A explicação anterior permanece na pergunta seguinte e todas as respostas podem ser revisadas no resultado.

O som começa desligado. O botão SOM ON/OFF habilita pequenas notas originais por Web Audio; não existe música automática. `prefers-reduced-motion` desabilita animações decorativas e simplifica a aproximação do armário.

## Saves

Três arquivos independentes no `localStorage`, chave `scrumban-quests:saves:v1`. Cada arquivo registra respostas, progresso, vidas, pontuação, resultado e datas. As respostas são gravadas antes do feedback: fechar ou atualizar a página durante a animação não duplica uma jogada.

Os saves são validados pela versão do banco e reconstruídos a partir das respostas. Dados malformados são descartados por arquivo. Se o armazenamento estiver bloqueado/cheio, a interface informa que o progresso pode durar apenas a sessão. Dados ficam neste navegador e nesta origem; não há sincronização entre dispositivos.

## Assets e créditos

Os 19 arquivos de `C:/Users/victo/Downloads/AssetsScrumban` foram inventariados e examinados. O projeto reutiliza o armário, personagens, poses, retratos de expressão, itens e cenário de batalha. O armário usa uma sequência de perspectivas fornecidas com aproximação e transição controladas por scroll; não há modelo 3D externo.

Para reproduzir os recortes:

```sh
npm run assets -- "C:/caminho/AssetsScrumban"
```

Os assets preparados já estão no repositório; a pasta original não é necessária para rodar ou compilar. As imagens originais não são modificadas.

Projeto educacional e homenagem independente, sem afiliação à Nintendo. Personagens pertencem aos respectivos titulares. Créditos presentes nas folhas fornecidas: GBA; Wario Bros., Tiberian, Rapid Thy, Hyper TH e Black Squirrel; Desgardes; redblueyellow; Redzagoon. Veja também os créditos no manual do jogo. As fontes são distribuídas pelos pacotes Fontsource com suas respectivas licenças.

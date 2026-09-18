# Validação — 18/09/2026

## Build e regras

- `npm run build`: aprovado. Produção em `dist/`.
- `npm test`: 11 testes aprovados, zero falhas.
- `git diff --check`: sem erros de whitespace; apenas aviso de conversão LF/CRLF do Git no Windows.
- Sem dependências JavaScript de produção. Imagens locais otimizadas: 24 arquivos, 683.084 bytes no total. JS principal: 22,08 kB (9,06 kB gzip); CSS: 33,44 kB (9,57 kB gzip).

Os testes cobrem todas as 32 combinações de acerto/erro das cinco perguntas, HP inicial, dano, pontuação, derrota por empate, rejeição de alternativas inválidas, finalização, correção do gabarito, restauração dos três arquivos, validação de dados corrompidos e falha de acesso ao armazenamento.

O controlador real de scroll foi testado com DOM/scheduler simulados: frente → traseira, zoom, menu desbloqueado, retorno ao início, encerramento de requestAnimationFrame e remoção dos listeners. Com `prefers-reduced-motion`, o objeto permanece sem zoom/rotação e o menu continua acessível.

## Navegador — fluxos completos

Testes realizados no navegador integrado, nas versões de desenvolvimento (`5173`) e produção (`4173`).

- Hero com armário, itens locais e tipografia sobreposta.
- Scroll para a traseira do armário, aproximação até cobrir a tela, entrada do menu e reversão ao subir.
- Acesso aos saves pelo menu e pelo atalho do cabeçalho.
- Partida com cinco acertos: vitória, Mario 5 HP, Bowser 0 HP, 500 pontos.
- Partida com cinco erros: derrota, Mario 0 HP, Bowser 5 HP, 0 pontos.
- Nova tentativa: volta à primeira questão com 5 HP para os dois personagens.
- Acerto/erro mostram poses e expressões correspondentes e alteram somente o HP correto.
- Respostas bloqueadas durante o feedback. Duas teclas C seguidas resultaram em apenas uma resposta e um único ponto de dano.
- Recarga após a primeira resposta: retoma a segunda pergunta com HP e pontuação preservados.
- Arquivos independentes: vitória no arquivo 1 não alterou o arquivo 2; arquivo 3 iniciado e concluído separadamente na produção.
- Salvar e sair, continuar e ver resultado funcionais.
- Novo jogo em arquivo em andamento exige confirmação; cancelar preserva os dados.
- Revisão final exibe as cinco jogadas e explicações.
- Jogo completo de produção por teclado A–E; diálogo de instruções fecha com Escape e retorna o foco ao botão.
- Som inicia desligado; ativar/desativar atualiza controle e não gera erro de áudio.
- Rota desconhecida volta à Hero; arquivo inexistente volta à seleção; resultado incompleto redireciona à batalha.
- Nenhum erro ou aviso de aplicação no console durante os fluxos finais observados.

## Responsividade

As quatro telas abaixo foram inspecionadas nas sete resoluções. Verificação de dimensões de DOM, integridade de imagens e capturas visuais representativas em desktop, tablet e celular.

| Resolução | Hero | Saves | Batalha | Resultado |
| --- | --- | --- | --- | --- |
| 1920 × 1080 | OK | OK | OK | OK |
| 1440 × 900 | OK | OK | OK | OK |
| 1366 × 768 | OK | OK | OK | OK |
| 1024 × 768 | OK | OK | OK | OK |
| 768 × 1024 | OK | OK | OK | OK |
| 430 × 932 | OK | OK | OK | OK |
| 390 × 844 | OK | OK | OK | OK |

- Nenhum overflow horizontal nas telas testadas.
- Nenhuma imagem quebrada nas inspeções finais.
- HP e conteúdo dos painéis sem overflow interno.
- Alternativas com pelo menos 59 px de altura; botões principais dos saves com pelo menos 59 px.
- Texto de apoio da Hero separado da tipografia grande nos sete formatos.
- No celular, alternativas e saves em coluna; rolagem vertical permite ler todos os textos sem comprimi-los.

## Limites da verificação

Testes de navegador foram realizados em Chromium integrado. Safari/Firefox e aparelhos físicos não foram executados. O modo de movimento reduzido foi validado no controlador e nas regras CSS, sem alterar a preferência do sistema operacional. A implementação prioriza transform/opacity, mas não foi feita uma medição formal de FPS em dispositivos físicos. O build está pronto para hospedagem estática; não foi publicado em um serviço externo.

// Five topics and five alternatives retained from the original questionnaire.
// Copy tightened for battle; question 5's incorrect answer key is fixed.
export const BANK_VERSION = 1;
export const questions = [
  {
    id: "wip",
    topic: "LIMITES DE WIP",
    text: "A coluna “Em desenvolvimento” atingiu o limite de WIP. Um desenvolvedor ficou livre. Qual é a próxima jogada?",
    options: [
      "Puxar outra tarefa, mesmo ultrapassando o limite.",
      "Aumentar imediatamente o limite de WIP.",
      "Ajudar a concluir ou destravar as tarefas em andamento.",
      "Parar o projeto e convocar um planejamento de emergência.",
      "Criar uma tarefa de suporte fora do backlog.",
    ],
    answer: 2,
    explanation:
      "Antes de começar mais trabalho, ajude o trabalho em andamento a fluir. O limite de WIP revela gargalos.",
  },
  {
    id: "sprints",
    topic: "FLUXO CONTÍNUO",
    text: "Scrum encontra Kanban. Como as Sprints entram nessa combinação?",
    options: [
      "Sprints de duas semanas são sempre obrigatórias.",
      "Sprints são opcionais; o time pode trabalhar com fluxo contínuo.",
      "Toda Sprint precisa durar exatamente um mês.",
      "Scrumban elimina qualquer tipo de planejamento.",
      "Sprints servem apenas para definir os papéis do time.",
    ],
    answer: 1,
    explanation:
      "Scrumban combina práticas e permite fluxo contínuo. A equipe adapta sua cadência de planejamento.",
  },
  {
    id: "timebox",
    topic: "TIMEBOX",
    text: "O timebox da Sprint Planning acabou, mas nem todas as tarefas foram detalhadas. O que o time deve fazer?",
    options: [
      "Encerrar a reunião e adaptar o plano durante a Sprint.",
      "Estender a reunião até detalhar 100% das tarefas.",
      "Cancelar a Sprint e planejar tudo novamente amanhã.",
      "Compensar a falta de detalhes com horas extras.",
      "Deixar o Product Owner criar sozinho todo o plano.",
    ],
    answer: 0,
    explanation:
      "Respeite o timebox. Com o objetivo da Sprint definido, os desenvolvedores adaptam o plano conforme aprendem.",
  },
  {
    id: "visual-flow",
    topic: "QUADRO VISUAL",
    text: "O quadro Scrumban é o mapa da sua aventura. Qual é a principal função do fluxo visual?",
    options: [
      "Registrar somente o que foi concluído no fim da Sprint.",
      "Mostrar o andamento, revelar gargalos e organizar o trabalho.",
      "Eliminar a priorização e executar tudo ao mesmo tempo.",
      "Permitir apenas ao Scrum Master controlar o desempenho.",
      "Impedir qualquer mudança depois do planejamento.",
    ],
    answer: 1,
    explanation:
      "Visualizar o trabalho ajuda toda a equipe a entender o fluxo e identificar onde as tarefas ficam presas.",
  },
  {
    id: "responsibilities",
    topic: "RESPONSABILIDADES",
    text: "Flexibilidade também exige atenção. Que desafio pode surgir com os papéis menos prescritivos do Scrumban?",
    options: [
      "Ser obrigado a adotar todos os papéis formais do Scrum.",
      "Não precisar dividir nenhuma responsabilidade.",
      "Gerar indefinição de responsabilidades sem acordos claros.",
      "Exigir que todas as decisões sejam do Scrum Master.",
      "Eliminar qualquer problema de organização do time.",
    ],
    answer: 2,
    explanation:
      "Flexibilidade não elimina responsabilidades. Acordos explícitos ajudam o time a evitar lacunas e sobreposições.",
  },
];

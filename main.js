// ===============================
// PERGUNTAS DO QUESTIONÁRIO
// ===============================

const perguntas = [
    {
        pergunta: "A coluna 'Em desenvolvimento' do quadro Scrumban atingiu o seu limite máximo de WIP,(Work in Progress), e um desenvolvedor acabou de ficar disponível. Qual é a medida correta a ser tomada?",
        alternativas: [
            "O desenvolvedor disponivel deve puxar uma nova tarefa da coluna 'A Fazer' para não ficar ocioso, ignorando temporariamente o limite até que a situação se normalize.",
            "O limite de WIP da coluna 'Em desenvolvimento' deve ser aumentado imediatamente pelo Scrum Master para acomodar a nova tarefa do desenvolvedor.",
            "O desenvolvedor deve focar em ajudar a escoar as tarefas que estão nas colunas seguintes (como 'Teste' ou 'Revisão') ou ajudar os colegas a destravar as tarefas da própria coluna de desenvolvimento.",
            "A equipe deve interromper todo o trabalho do projeto e agendar uma reunião de planejamento de emergência com o Product Owner para repriorizar o Backlog.",
            "O desenvolvedor deve criar uma nova tarefa de suporte técnico que não estava no Backlog para poder trabalhar sem violar o sistema."
        ],
        resposta: 2
    },

    {
        pergunta: "Sobre o Scrumban e sua utilização de Sprints, assinale a alternativa correta:",
        alternativas: [
            "O Scrumban exige obrigatoriamente Sprints fixas de duas semanas, assim como o Scrum tradicional.",
            "No Scrumban, as Sprints podem ser utilizadas, mas não são obrigatórias, permitindo que a equipe trabalhe com fluxo contínuo e maior flexibilidade.",
            "As Sprints no Scrumban devem ter duração obrigatória de exatamente um mês.",
            "O Scrumban não permite planejamento, pois utiliza exclusivamente o sistema Kanban.",
            "O Scrumban utiliza Sprints apenas para definir os papéis dos integrantes da equipe."
        ],
        resposta: 1
    },

    {
        pergunta: "Durante a Sprint Planning, o time não consegue terminar o planejamento de todas as tarefas porque o tempo máximo da reunião (timebox) acabou. Qual é a conduta correta a ser adotada pelo time Scrum?",
        alternativas: [
            "A reunião deve ser encerrada imediatamente, e os desenvolvedores começam a Sprint planejando o restante das tarefas sob demanda ao longo dos dias.",
            "O Scrum Master deve estender a reunião por quantas horas forem necessárias até que 100% das tarefas estejam detalhadas.",
            "A Sprint atual deve ser cancelada pelo Product Owner e uma nova reunião deve ser agendada para o dia seguinte.",
            "Os desenvolvedores devem trabalhar horas extras nos primeiros dias para compensar a falta de planejamento.",
            "O Product Owner assume a responsabilidade e define sozinho o plano de ação que faltou para o time."
        ],
        resposta: 0
    },

    {
        pergunta: "No Scrumban, o fluxo visual é uma prática importante para o gerenciamento das atividades. Sobre essa prática, assinale a alternativa correta:",
        alternativas: [
            " O fluxo visual serve apenas para registrar as tarefas concluídas ao final de cada Sprint.",
            "O fluxo visual permite acompanhar o andamento das tarefas por meio de um quadro, facilitando a identificação de gargalos e a organização do trabalho.",
            "O fluxo visual elimina a necessidade de priorizar atividades, pois todas as tarefas devem ser executadas simultaneamente.",
            "O fluxo visual é utilizado exclusivamente pelo Scrum Master para controlar o desempenho dos desenvolvedores.",
            "O fluxo visual impede alterações nas tarefas depois que o planejamento inicial é realizado."
        ],
        resposta: 1
    },

    {
        pergunta: "Uma das limitações do Scrumban está relacionada ao gerenciamento de funções e responsabilidades dentro da equipe. Assinale a alternativa correta:",
        alternativas: [
            "O Scrumban possui papéis obrigatórios e rigidamente definidos, como Product Owner, Scrum Master e Equipe de Desenvolvimento.",
            " O Scrumban elimina completamente a necessidade de divisão de responsabilidades entre os integrantes da equipe.",
            " Por não possuir papéis tão formalmente definidos quanto o Scrum, o Scrumban pode gerar indefinição de responsabilidades e dificuldades no gerenciamento das funções da equipe.",
            " No Scrumban, todas as decisões devem ser tomadas exclusivamente pelo Scrum Master.",
            "A flexibilidade do Scrumban impede qualquer tipo de problema relacionado à organização das funções."
        ],
        resposta: 1
    }
];


// ===============================
// VARIÁVEIS
// ===============================

let questaoAtual = 0;
let acertos = 0;


// ===============================
// ELEMENTOS DO HTML
// ===============================
const telaInicial = document.querySelector(".tela-inicial");

const btnComecar = document.getElementById("btnComecar");

const modalQuestionario = document.getElementById("modalQuestionario");

const numeroQuestao = document.getElementById("numeroQuestao");

const pergunta = document.getElementById("pergunta");

const alternativas = document.getElementById("alternativas");

const resultado = document.getElementById("resultado");

const btnProxima = document.getElementById("btnProxima");

const telaFinal = document.getElementById("telaFinal");

const resultadoFinal = document.getElementById("resultadoFinal");

const btnReiniciar = document.getElementById("btnReiniciar");


// ===============================
// COMEÇAR QUESTIONÁRIO
// ===============================

btnComecar.addEventListener("click", function() {

    questaoAtual = 0;
    acertos = 0;
    telaInicial.style.display = "none";

    telaFinal.style.display = "none";

    modalQuestionario.style.display = "flex";

    carregarQuestao();

});


// ===============================
// CARREGAR QUESTÃO
// ===============================

function carregarQuestao() {

    const questao = perguntas[questaoAtual];

    numeroQuestao.textContent =
        `Questão ${questaoAtual + 1} de ${perguntas.length}`;

    pergunta.textContent = questao.pergunta;

    resultado.textContent = "";

    btnProxima.style.display = "none";

    alternativas.innerHTML = "";


    // Criar os botões das alternativas

    questao.alternativas.forEach(function(alternativa, indice) {

        const botao = document.createElement("button");

        botao.classList.add("alternativa");

        botao.textContent = alternativa;

        botao.addEventListener("click", function() {

            verificarResposta(indice);

        });

        alternativas.appendChild(botao);

    });

}


// ===============================
// VERIFICAR RESPOSTA
// ===============================

function verificarResposta(indiceEscolhido) {

    const questao = perguntas[questaoAtual];

    const botoes = document.querySelectorAll(".alternativa");


    // Impedir que o usuário responda novamente

    botoes.forEach(function(botao) {

        botao.disabled = true;

    });


    // Verificar se acertou

    if (indiceEscolhido === questao.resposta) {

        resultado.textContent = "Você acertou!";

        acertos++;

    } else {

        resultado.textContent = "Você errou!";

    }


    // Mostrar botão para continuar

    btnProxima.style.display = "block";

}


// ===============================
// PRÓXIMA QUESTÃO
// ===============================

btnProxima.addEventListener("click", function() {

    questaoAtual++;

    if (questaoAtual < perguntas.length) {

        carregarQuestao();

    } else {

        finalizarQuestionario();

    }

});


// ===============================
// FINALIZAR QUESTIONÁRIO
// ===============================

function finalizarQuestionario() {

    modalQuestionario.style.display = "none";

    telaFinal.style.display = "flex";

    resultadoFinal.textContent =
        `Você acertou ${acertos} de ${perguntas.length} questões.`;

}


// ===============================
// REINICIAR QUESTIONÁRIO
// ===============================

btnReiniciar.addEventListener("click", function() {

    questaoAtual = 0;

    acertos = 0;

    telaFinal.style.display = "none";

    modalQuestionario.style.display = "flex";

    carregarQuestao();

});
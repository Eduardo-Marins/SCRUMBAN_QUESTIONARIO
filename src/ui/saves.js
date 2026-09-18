import { sprite, score, footer } from "./common.js";
import { questions } from "../data/questions.js";
export function savesScreen(slots) {
  return `<section class="save-screen page-shell"><div class="screen-topline"><a class="text-button" href="#/menu">← VOLTAR AO MENU</a><span class="eyebrow">MEMORY CARD / 3 ARQUIVOS</span></div><div class="screen-heading"><p class="eyebrow">CADA AVENTURA COMEÇA AQUI</p><h1 tabindex="-1">ESCOLHA SEU <span>ARQUIVO.</span></h1><p>Um novo desafio ou a próxima fase da sua história.</p></div><div class="save-grid">${slots
    .map((game, i) => {
      const state = !game
        ? "VAZIO"
        : game.result === "victory"
          ? "QUEST CONCLUÍDA"
          : game.result === "defeat"
            ? "TENTE OUTRA VEZ"
            : "EM ANDAMENTO";
      return `<article class="save-slot ${game ? "has-save" : ""}"><div class="slot-top"><span>SAVE SLOT ${i + 1}</span><span class="slot-led ${game ? "active" : ""}" aria-hidden="true"></span></div><div class="slot-art">${sprite(game?.result === "victory" ? "star" : ["mushroom", "block", "star"][i], "", "")}<span class="slot-number">0${i + 1}</span></div><p class="slot-state">${state}</p><h2>${game ? (game.result ? "Aventura registrada." : "Sua quest continua.") : "Uma nova aventura."}</h2><div class="slot-progress" aria-label="${game?.progress || 0} de ${questions.length} perguntas"><span style="width:${((game?.progress || 0) / questions.length) * 100}%"></span></div><div class="slot-stats"><span>${game?.progress || 0}/${questions.length} QUESTÕES</span><span>${score(game?.score || 0)} PTS</span></div><p class="slot-date">${game ? `Mario ${game.marioHP} HP · Bowser ${game.bowserHP} HP<br />Salvo em ${new Date(game.updatedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}` : "Seu próximo nível está esperando.<br />Pronto para começar?"}</p><button class="game-button ${i === 1 ? "green-button" : ""}" data-action="${game ? "continue" : "new"}" data-slot="${i + 1}">${game ? (game.result ? "VER RESULTADO" : "CONTINUAR") : "NOVO JOGO"} <span>→</span></button>${game ? `<button class="text-button restart-slot" data-action="new" data-slot="${i + 1}">NOVO JOGO NESTE ARQUIVO</button>` : '<span class="empty-slot-note">PRESS START</span>'}</article>`;
    })
    .join(
      "",
    )}</div><p class="save-note"><span class="status-dot"></span> PROGRESSO SALVO AUTOMATICAMENTE NESTE NAVEGADOR.</p>${footer()}</section>`;
}

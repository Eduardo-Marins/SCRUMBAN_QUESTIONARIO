import { questions } from "../data/questions.js";
import { hpBar, sprite, score, asset } from "./common.js";
export function battleScreen(game) {
  const q = questions[game.progress];
  return `<section class="battle-screen"><div class="battle-toolbar"><a class="text-button" href="#/saves">← SALVAR E SAIR</a><h1 tabindex="-1">BOSS <span>BATTLE.</span></h1><div class="battle-status"><span class="battle-score">SAVE ${game.slot} · <span id="battle-score">${score(game.score)}</span> PTS</span><div class="round-display"><span>QUESTÃO</span><strong>${String(game.progress + 1).padStart(2, "0")}<small> / 05</small></strong></div></div></div>
    <div class="battle-console"><div class="battle-arena" aria-label="Arena de batalha"><span class="arena-label">SCRUMBAN LEAGUE <span>·</span> FINAL BOSS</span><div id="enemy-hud">${hpBar("BOWSER", game.bowserHP, "enemy")}</div><div class="combatant enemy"><div class="expression-bubble" aria-hidden="true"></div>${sprite("bowser-idle", "character", "Bowser pronto para a batalha")}<span class="damage-number" aria-hidden="true">−1 HP</span></div><div class="combatant player"><div class="expression-bubble" aria-hidden="true"></div>${sprite("mario-back", "character", "Mario pronto para a batalha")}<span class="damage-number" aria-hidden="true">−1 HP</span></div><div id="player-hud">${hpBar("MARIO", game.marioHP, "player")}</div><div id="battle-feedback" class="battle-feedback" role="status"></div></div>
    <div class="question-panel"><div class="question-meta"><span>${q.topic}</span><span>ESCOLHA SUA JOGADA <span aria-hidden="true">↙</span></span></div><h2 id="question-title" tabindex="-1">${q.text}</h2><div class="answers">${q.options.map((option, i) => `<button class="answer" data-action="answer" data-choice="${i}"><span class="answer-key">${String.fromCharCode(65 + i)}</span><span>${option}</span><span class="answer-arrow" aria-hidden="true">↗</span></button>`).join("")}</div><div class="battle-hint"><span><i class="status-dot"></i> CADA ACERTO É UM ATAQUE.</span><span>TECLADO <b>A</b>—<b>E</b></span></div></div></div>
    </section>`;
}
export function showFeedback(root, game, choice, question) {
  const correct = choice === question.answer;
  root.querySelectorAll(".answer").forEach((button, i) => {
    button.disabled = true;
    if (i === question.answer) button.classList.add("is-correct");
    else if (i === choice) button.classList.add("is-wrong");
  });
  root
    .querySelector(".battle-arena")
    .classList.add(correct ? "correct-scene" : "wrong-scene");
  root.querySelector(".player .character").src = asset(
    correct ? "mario-win" : "mario-hurt",
  );
  root.querySelector(".enemy .character").src = asset(
    correct ? "bowser-hurt" : "bowser-win",
  );
  root.querySelector(".player .character").alt = correct
    ? "Mario comemorando o acerto"
    : "Mario sofreu dano";
  root.querySelector(".enemy .character").alt = correct
    ? "Bowser sofreu dano"
    : "Bowser comemorando";
  root.querySelector(".player .expression-bubble").innerHTML = sprite(
    correct ? "mario-happy-face" : "mario-sad-face",
  );
  root.querySelector(".enemy .expression-bubble").innerHTML = sprite(
    correct ? "bowser-sad-face" : "bowser-happy-face",
  );
  root.querySelector("#enemy-hud").innerHTML = hpBar(
    "BOWSER",
    game.bowserHP,
    "enemy",
  );
  root.querySelector("#player-hud").innerHTML = hpBar(
    "MARIO",
    game.marioHP,
    "player",
  );
  root.querySelector("#battle-score").textContent = score(game.score);
  root.querySelector("#battle-feedback").innerHTML =
    `<strong>${correct ? "SUPER EFFECTIVE!" : "OUCH! −1 HP"}</strong><span>${correct ? "ACERTOU! BOWSER PERDEU 1 HP." : `RESPOSTA CERTA: ${String.fromCharCode(65 + question.answer)}`}</span>`;
}

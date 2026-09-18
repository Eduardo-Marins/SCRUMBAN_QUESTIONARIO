import { sprite, asset, footer } from "./common.js";
export function landingScreen() {
  return `<section class="scroll-story" aria-label="Entre no universo Scrumban"><div class="hero-sticky">
    <div class="hero-intro">
      <div class="hero-kicker"><span class="status-dot"></span> UMA NOVA FASE DO SEU CONHECIMENTO <span class="edition">VOL. 01 — THE SCRUMBAN ADVENTURE</span></div>
      <h1 class="hero-title"><span>SCRUMBAN</span><span>QUESTS<span class="title-star" aria-hidden="true">✦</span></span></h1>
      <div class="hero-orbit orbit-one" aria-hidden="true">${sprite("star")}</div>
      <div class="hero-orbit orbit-two" aria-hidden="true">${sprite("mushroom")}</div>
      <div class="hero-orbit orbit-three" aria-hidden="true">${sprite("coin")}</div>
      <span class="coordinate coord-left" aria-hidden="true">WORLD 01<br />00:00 / ∞</span>
      <span class="coordinate coord-right" aria-hidden="true">UMA PORTA.<br />OUTRO UNIVERSO.</span>
      <div class="hero-copy"><span class="eyebrow">O PRÓXIMO NÍVEL É SEU.</span><p>Do outro lado, uma batalha.<br />Seu conhecimento é o power-up.</p><a class="underlined-link" href="#/menu">ENTRAR NO JOGO <span>↗</span></a></div>
      <div class="hero-seal"><span>5 QUESTÕES</span><strong>1 GRANDE<br />DESAFIO.</strong><span>VOCÊ VS. BOWSER</span></div>
      <button class="scroll-cue" data-action="explore"><span class="scroll-arrow" aria-hidden="true">↓</span><span>ROLE PARA<br /><b>DESCOBRIR</b></span></button>
      <div class="hero-bottom"><span>APRENDA. JOGUE. EVOLUA.</span><span>SCROLL TO THE NEXT LEVEL <b>↓</b></span><span>1 PLAYER / 5 HP</span></div>
    </div>
    <div class="cabinet-stage" aria-hidden="true"><div class="cabinet-shadow"></div><div class="cabinet-object">${[3, 8, 7, 4, 5, 6].map((n, i) => `<img src="${asset(`cabinet-${n}`)}" class="cabinet-frame ${i === 0 ? "first-frame" : ""}" alt="" width="1000" height="1000" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} draggable="false">`).join("")}</div></div>
    <div class="portal-wash" aria-hidden="true"></div>
    <div class="portal-menu" inert>${menuContent()}</div>
    <div class="scroll-progress" aria-hidden="true"><span></span></div>
  </div></section>`;
}
export function menuContent() {
  return `<div class="menu-content"><p class="eyebrow">VOCÊ DESBLOQUEOU UM NOVO MUNDO</p>${sprite("star", "menu-star", "", 'width="72" height="72"')}<h2 tabindex="-1">LET'S<br /><span>PLAY.</span></h2><p class="menu-description">Cinco perguntas. Uma batalha.<br />Mostre que você domina o fluxo.</p><a class="game-button start-button" href="#/saves"><span class="play-triangle" aria-hidden="true">▶</span> JOGAR <span class="keycap">↵</span></a><span class="press-start">PRESS START TO LEARN</span><button class="text-button" data-action="help">COMO JOGAR</button></div>${footer()}`;
}
export const menuScreen = () =>
  `<section class="standalone-menu">${menuContent()}</section>`;

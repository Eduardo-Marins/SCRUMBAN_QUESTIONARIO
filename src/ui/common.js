import { MAX_HP } from "../game/engine.js";
export const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}.webp`;
export const sprite = (name, className = "", alt = "", attrs = "") =>
  `<img src="${asset(name)}" class="sprite ${className}" alt="${alt}" draggable="false" ${attrs}>`;
export const footer = () =>
  `<footer class="screen-footer"><span>UM POUCO DE NOSTALGIA. UM NOVO JEITO DE APRENDER.</span><span>EST. 1996 FEELING <span class="footer-star">✦</span> MADE FOR TODAY</span></footer>`;
export function hpBar(name, hp, side) {
  return `<div class="hp-card ${side}-hp" aria-label="${name}: ${hp} de ${MAX_HP} HP"><div class="hp-name"><strong>${name}</strong><span>${side === "player" ? "PLAYER 01" : "BOSS 01"}</span></div><div class="hp-meter"><b>HP</b><span class="hp-blocks" aria-hidden="true">${Array.from({ length: MAX_HP }, (_, i) => `<i class="${i < hp ? "filled" : ""}"></i>`).join("")}</span><span>${hp}/${MAX_HP}</span></div></div>`;
}
export const score = (value) => String(value).padStart(4, "0");

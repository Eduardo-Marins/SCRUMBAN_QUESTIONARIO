import "@fontsource/anton/latin-400.css";
import "@fontsource/vt323/latin-400.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import { questions } from "./src/data/questions.js";
import { createGame, answerQuestion } from "./src/game/engine.js";
import { createSaveStore } from "./src/game/storage.js";
import { toggleSound, playSound } from "./src/game/audio.js";
import { landingScreen, menuScreen } from "./src/ui/landing.js";
import { savesScreen } from "./src/ui/saves.js";
import { battleScreen, showFeedback } from "./src/ui/battle.js";
import { resultScreen } from "./src/ui/result.js";
import { asset } from "./src/ui/common.js";
import { mountScrollScene } from "./src/motion/scroll-scene.js";

const root = document.querySelector("main");
const storageWarning = () => {
  const warning = document.querySelector("#save-warning");
  warning.hidden = false;
  warning.textContent =
    "Não foi possível acessar os saves. Você pode jogar, mas o progresso pode ficar apenas nesta sessão.";
};
const store = createSaveStore(
  {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
  },
  storageWarning,
);
let game = null;
let locked = false;
let pendingSlot = null;
let feedbackTimer;
let scene;
let battleAssetsLoaded = false;

function navigate(path) {
  if (location.hash === `#${path}`) render();
  else location.hash = path;
}
function preloadBattle() {
  if (battleAssetsLoaded) return;
  battleAssetsLoaded = true;
  [
    "mario-win",
    "mario-hurt",
    "bowser-hurt",
    "bowser-win",
    "mario-happy-face",
    "mario-sad-face",
    "bowser-happy-face",
    "bowser-sad-face",
  ].forEach((name) => {
    const img = new Image();
    img.src = asset(name);
    img.decode().catch(() => {});
  });
}
function render({ questionFocus = false, preserveScroll = false } = {}) {
  clearTimeout(feedbackTimer);
  scene?.destroy();
  scene = null;
  locked = false;
  game = null;
  const route = location.hash.slice(1) || "/";
  const match = route.match(/^\/(battle|result)\/([1-3])$/);
  document.body.dataset.screen = route.split("/")[1] || "landing";
  if (route === "/") root.innerHTML = landingScreen();
  else if (route === "/menu") root.innerHTML = menuScreen();
  else if (route === "/saves") root.innerHTML = savesScreen(store.all());
  else if (match) {
    game = store.get(Number(match[2]));
    if (!game) {
      navigate("/saves");
      return;
    }
    if (match[1] === "result" && !game.result) {
      navigate(`/battle/${game.slot}`);
      return;
    }
    if (match[1] === "battle" && game.result) {
      navigate(`/result/${game.slot}`);
      return;
    }
    root.innerHTML = game.result ? resultScreen(game) : battleScreen(game);
    preloadBattle();
  } else {
    history.replaceState(null, "", "#/");
    render();
    return;
  }
  if (!preserveScroll) window.scrollTo({ top: 0, behavior: "instant" });
  if (route === "/") scene = mountScrollScene(root);
  else
    (
      root.querySelector(questionFocus ? "#question-title" : "h1, h2") || root
    ).focus({ preventScroll: true });
  document.title = `${route === "/" ? "Uma nova fase do seu conhecimento" : route === "/saves" ? "Escolha seu arquivo" : game?.result ? (game.result === "victory" ? "Scrumban Master!" : "Game Over") : game ? `Questão ${game.progress + 1} de 5` : "Let's Play"} — SCRUMBAN QUESTS`;
}
function startNew(slot) {
  const fresh = createGame(slot);
  store.save(fresh);
  playSound("select");
  navigate(`/battle/${slot}`);
}
function chooseAnswer(choice) {
  if (!game || game.result || locked) return;
  const question = questions[game.progress];
  if (
    !Number.isInteger(choice) ||
    choice < 0 ||
    choice >= question.options.length
  )
    return;
  locked = true;
  game = answerQuestion(game, choice);
  // Commit before animation: reloading or leaving during feedback never repeats an answer.
  store.save(game);
  showFeedback(root, game, choice, question);
  playSound(choice === question.answer ? "correct" : "wrong");
  feedbackTimer = setTimeout(() => {
    if (game.result) {
      playSound(game.result);
      navigate(`/result/${game.slot}`);
    } else render({ questionFocus: true, preserveScroll: true });
  }, 1350);
}
document.addEventListener("click", (event) => {
  if (event.target.closest(".skip-link")) {
    event.preventDefault();
    root.focus();
    return;
  }
  const target = event.target.closest("[data-action]");
  if (!target || target.disabled) return;
  const slot = Number(target.dataset.slot);
  switch (target.dataset.action) {
    case "help":
      document.querySelector("#help-dialog").showModal();
      break;
    case "close-dialog":
      target.closest("dialog").close();
      break;
    case "sound": {
      const enabled = toggleSound();
      target.setAttribute("aria-pressed", String(enabled));
      target.setAttribute(
        "aria-label",
        enabled ? "Desativar som" : "Ativar som",
      );
      target.querySelector(".sound-label").textContent = enabled
        ? "SOM ON"
        : "SOM OFF";
      break;
    }
    case "explore":
      scene?.explore();
      break;
    case "continue": {
      const saved = store.get(slot);
      if (saved) navigate(`/${saved.result ? "result" : "battle"}/${slot}`);
      break;
    }
    case "new":
      if (![1, 2, 3].includes(slot)) break;
      if (store.get(slot) && !store.get(slot).result) {
        pendingSlot = slot;
        document.querySelector("#overwrite-dialog").showModal();
      } else startNew(slot);
      break;
    case "confirm-new":
      document.querySelector("#overwrite-dialog").close();
      if (pendingSlot) startNew(pendingSlot);
      pendingSlot = null;
      break;
    case "answer":
      chooseAnswer(Number(target.dataset.choice));
      break;
  }
});
document.addEventListener("keydown", (event) => {
  if (
    event.repeat ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    document.querySelector("dialog[open]")
  )
    return;
  if (/^[a-e]$/i.test(event.key) && document.body.dataset.screen === "battle") {
    event.preventDefault();
    chooseAnswer(event.key.toUpperCase().charCodeAt(0) - 65);
  }
});
window.addEventListener("hashchange", () => render());
render();

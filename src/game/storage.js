import { restoreGame } from "./engine.js";
export const SAVE_KEY = "scrumban-quests:saves:v1";
export function createSaveStore(storage, onError = () => {}) {
  let slots = [null, null, null];
  try {
    const data = JSON.parse(storage.getItem(SAVE_KEY) || "null");
    if (Array.isArray(data))
      slots = slots.map((_, i) => restoreGame(data[i], i + 1));
  } catch {
    onError();
  }
  return {
    all: () => [...slots],
    get: (slot) => slots[slot - 1] || null,
    save(game) {
      const clean = restoreGame(game, game.slot);
      if (!clean) throw new Error("Invalid save data");
      slots[game.slot - 1] = clean;
      try {
        storage.setItem(SAVE_KEY, JSON.stringify(slots));
        return true;
      } catch {
        onError();
        return false;
      }
    },
  };
}

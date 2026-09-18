import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  answerQuestion,
  restoreGame,
  getOutcome,
} from "../src/game/engine.js";
import { createSaveStore, SAVE_KEY } from "../src/game/storage.js";
import { questions } from "../src/data/questions.js";

test("starts both characters with 5 HP and rejects invalid slots", () => {
  const game = createGame(1);
  assert.equal(game.marioHP, 5);
  assert.equal(game.bowserHP, 5);
  assert.equal(game.progress, 0);
  assert.throws(() => createGame(4));
});
test("right answer damages only Bowser and wrong answer damages only Mario", () => {
  const initial = createGame(1);
  const right = answerQuestion(initial, 2);
  assert.equal(right.bowserHP, 4);
  assert.equal(right.marioHP, 5);
  assert.equal(right.score, 100);
  const wrong = answerQuestion(initial, 0);
  assert.equal(wrong.bowserHP, 5);
  assert.equal(wrong.marioHP, 4);
  assert.equal(wrong.score, 0);
  assert.equal(initial.answers.length, 0);
});
test("all 32 correct/wrong combinations yield the expected final result and HP", () => {
  for (let mask = 0; mask < 32; mask++) {
    let game = createGame(2);
    let hits = 0;
    questions.forEach((q, i) => {
      const correct = !!(mask & (1 << i));
      hits += Number(correct);
      game = answerQuestion(
        game,
        correct ? q.answer : (q.answer + 1) % q.options.length,
      );
    });
    assert.equal(game.progress, 5);
    assert.equal(game.score, hits * 100);
    assert.equal(game.marioHP, hits);
    assert.equal(game.bowserHP, 5 - hits);
    assert.equal(game.result, hits >= 3 ? "victory" : "defeat");
    assert.equal(answerQuestion(game, 0), game);
  }
});
test("ties are defeat, including zero HP", () => {
  assert.equal(getOutcome(3, 3), "defeat");
  assert.equal(getOutcome(0, 0), "defeat");
  assert.equal(getOutcome(4, 3), "victory");
});
test("invalid answers never advance a game", () => {
  const game = createGame(1);
  for (const choice of [-1, 5, 1.5, NaN, "2", null])
    assert.equal(answerQuestion(game, choice), game);
});
test("restore replays answers, ignores tampered totals and rejects malformed saves", () => {
  const saved = answerQuestion(createGame(1), 2);
  assert.equal(
    restoreGame({ ...saved, score: 9999, marioHP: 0, bowserHP: 0 }, 1).score,
    100,
  );
  assert.equal(
    restoreGame(
      { ...saved, answers: [{ questionId: "wrong-id", choice: 2 }] },
      1,
    ),
    null,
  );
  assert.equal(restoreGame({ ...saved, bankVersion: 100 }, 1), null);
  assert.equal(restoreGame({ ...saved, updatedAt: "invalid" }, 1), null);
  assert.equal(restoreGame(saved, 2), null);
});
test("three save slots remain independent and resume after storage reload", () => {
  const map = new Map();
  const storage = {
    getItem: (key) => map.get(key),
    setItem: (key, value) => map.set(key, value),
  };
  const store = createSaveStore(storage);
  store.save(answerQuestion(createGame(1), 2));
  store.save(answerQuestion(createGame(2), 0));
  store.save(createGame(3));
  const reloaded = createSaveStore(storage);
  assert.equal(reloaded.get(1).bowserHP, 4);
  assert.equal(reloaded.get(2).marioHP, 4);
  assert.equal(reloaded.get(3).progress, 0);
  assert.equal(reloaded.get(1).answers[0].choice, 2);
  assert.ok(map.get(SAVE_KEY));
  reloaded.save(createGame(1));
  assert.equal(reloaded.get(2).marioHP, 4);
});
test("blocked and corrupted storage do not prevent playing", () => {
  let warnings = 0;
  const blocked = createSaveStore(
    {
      getItem() {
        throw Error("blocked");
      },
      setItem() {
        throw Error("quota");
      },
    },
    () => warnings++,
  );
  assert.equal(blocked.save(createGame(3)), false);
  assert.equal(blocked.get(3).progress, 0);
  assert.equal(warnings, 2);
  const broken = createSaveStore({ getItem: () => "{bad" }, () => warnings++);
  assert.deepEqual(broken.all(), [null, null, null]);
  assert.equal(warnings, 3);
});
test("final responsibility answer is the corrected third option", () => {
  assert.equal(questions[4].answer, 2);
});

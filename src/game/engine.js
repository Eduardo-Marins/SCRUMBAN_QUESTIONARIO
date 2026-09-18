import { questions, BANK_VERSION } from "../data/questions.js";
export const MAX_HP = 5;
export const getOutcome = (marioHP, bowserHP) =>
  marioHP > bowserHP ? "victory" : "defeat";
export function createGame(slot, now = new Date().toISOString()) {
  if (![1, 2, 3].includes(slot)) throw new Error("Invalid save slot");
  return {
    version: 1,
    bankVersion: BANK_VERSION,
    slot,
    answers: [],
    progress: 0,
    marioHP: MAX_HP,
    bowserHP: MAX_HP,
    score: 0,
    result: null,
    startedAt: now,
    updatedAt: now,
  };
}
export function answerQuestion(game, choice, now = new Date().toISOString()) {
  const question = questions[game.progress];
  if (
    game.result ||
    !question ||
    !Number.isInteger(choice) ||
    choice < 0 ||
    choice >= question.options.length
  )
    return game;
  const correct = choice === question.answer;
  const next = {
    ...game,
    answers: [...game.answers, { questionId: question.id, choice, correct }],
    progress: game.progress + 1,
    marioHP: Math.max(0, game.marioHP - (correct ? 0 : 1)),
    bowserHP: Math.max(0, game.bowserHP - (correct ? 1 : 0)),
    score: game.score + (correct ? 100 : 0),
    updatedAt: now,
  };
  if (next.progress === questions.length)
    next.result = getOutcome(next.marioHP, next.bowserHP);
  return next;
}
// Replay answers instead of trusting stored HP, progress or score.
export function restoreGame(value, slot) {
  if (
    !value ||
    value.version !== 1 ||
    value.bankVersion !== BANK_VERSION ||
    value.slot !== slot ||
    !Array.isArray(value.answers) ||
    value.answers.length > questions.length ||
    !Number.isFinite(Date.parse(value.startedAt)) ||
    !Number.isFinite(Date.parse(value.updatedAt))
  )
    return null;
  let game = createGame(slot, value.startedAt);
  for (const [index, entry] of value.answers.entries()) {
    if (
      !entry ||
      entry.questionId !== questions[index].id ||
      !Number.isInteger(entry.choice) ||
      entry.choice < 0 ||
      entry.choice >= questions[index].options.length
    )
      return null;
    game = answerQuestion(game, entry.choice, value.updatedAt);
  }
  return { ...game, updatedAt: value.updatedAt };
}

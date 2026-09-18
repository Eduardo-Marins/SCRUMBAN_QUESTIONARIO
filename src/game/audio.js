// Tiny original synthesized cues. Nothing plays before the sound toggle is used.
let context;
let enabled = false;
export function toggleSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;
  if (!context) context = new AudioContext();
  enabled = !enabled;
  if (enabled) {
    context.resume().catch(() => {});
    playSound("select");
  }
  return enabled;
}
export function playSound(kind) {
  if (!enabled || !context) return;
  const notes = {
    select: [440, 660],
    correct: [523, 659, 784],
    wrong: [220, 165],
    victory: [523, 659, 784, 1047],
    defeat: [294, 262, 196],
  }[kind] || [440];
  notes.forEach((frequency, i) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + i * 0.09;
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.025, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.13);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  });
}

const clamp = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function mountScrollScene(root) {
  const story = root.querySelector(".scroll-story");
  const intro = root.querySelector(".hero-intro");
  const object = root.querySelector(".cabinet-object");
  const frames = [...root.querySelectorAll(".cabinet-frame")];
  const shadow = root.querySelector(".cabinet-shadow");
  const wash = root.querySelector(".portal-wash");
  const menu = root.querySelector(".portal-menu");
  const progressBar = root.querySelector(".scroll-progress span");
  const orbits = [...root.querySelectorAll(".hero-orbit")];
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let frameId = 0;
  let progress = 0;
  let target = 0;
  let distance = 1;
  let disposed = false;
  let menuActive = false;
  const measure = () => {
    distance = Math.max(1, story.offsetHeight - innerHeight);
    onScroll();
  };
  function draw() {
    const delta = target - progress;
    progress =
      motion.matches || Math.abs(delta) < 0.0002
        ? target
        : progress + delta * 0.14;
    const p = progress;
    const fade = smoothstep((p - 0.07) / 0.23);
    const zoom = smoothstep((p - 0.43) / 0.37);
    const rotation = clamp((p - 0.13) / 0.38) * (frames.length - 1);
    const current = Math.floor(rotation);
    const mix = rotation - current;
    intro.style.opacity = 1 - fade;
    intro.inert = p > 0.3;
    intro.style.transform = `translate3d(0, ${-p * 90}px, 0)`;
    object.style.transform = motion.matches
      ? "none"
      : `translate3d(${Math.sin(p * Math.PI) * 30}px, ${-p * 25}px, 0) rotate(${-7 + p * 14}deg) scale(${1 + p * 0.4 + zoom * 7})`;
    object.style.opacity = 1 - smoothstep((p - 0.84) / 0.1);
    const blend = smoothstep((mix - 0.35) / 0.3);
    frames.forEach((frame, i) => {
      frame.style.opacity =
        i === current ? 1 - blend : i === current + 1 ? blend : 0;
      frame.style.zIndex = i === current + 1 ? 2 : 1;
    });
    shadow.style.opacity = 1 - fade;
    orbits.forEach((orbit, i) => {
      orbit.style.transform = `translate3d(${p * (i % 2 ? -190 : 240)}px, ${p * -160}px, 0) rotate(${p * 30}deg)`;
      orbit.style.filter = `blur(${motion.matches ? 0 : p * 8}px)`;
    });
    const menuProgress = smoothstep((p - 0.82) / 0.15);
    wash.style.opacity = menuProgress;
    menu.style.opacity = menuProgress;
    menu.style.transform = `translate3d(0, ${(1 - menuProgress) * 25}px, 0)`;
    menu.inert = p < 0.91;
    if (p >= 0.91 && !menuActive) {
      document.querySelector("#announcement").textContent =
        "Novo mundo desbloqueado. O botão Jogar está disponível.";
      menuActive = true;
    } else if (p < 0.85) menuActive = false;
    progressBar.style.transform = `scaleX(${p})`;
    if (!disposed && progress !== target) frameId = requestAnimationFrame(draw);
    else frameId = 0;
  }
  function onScroll() {
    target = clamp(scrollY / distance);
    if (!frameId) frameId = requestAnimationFrame(draw);
  }
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  motion.addEventListener("change", measure);
  // Other angles decode after first paint; battle sprites are loaded only on entry.
  const idle =
    window.requestIdleCallback || ((callback) => setTimeout(callback, 180));
  const idleId = idle(() => {
    if (!disposed)
      frames.slice(1).forEach((img) => {
        img.loading = "eager";
        img.decode().catch(() => {});
      });
  });
  return {
    explore() {
      window.scrollTo({
        top: distance,
        behavior: motion.matches ? "instant" : "smooth",
      });
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frameId);
      (window.cancelIdleCallback || clearTimeout)(idleId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", measure);
    },
  };
}

import { test } from "node:test";
import assert from "node:assert/strict";
import { mountScrollScene } from "../src/motion/scroll-scene.js";

// Small DOM/scheduler harness: exercise the real scroll controller without a browser dependency.
function sceneHarness(reduced) {
  const globals = [
    "window",
    "document",
    "matchMedia",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    "scrollY",
    "innerHeight",
  ];
  const previous = new Map(
    globals.map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  const raf = new Map();
  const listeners = new Map();
  let nextId = 0;
  const node = () => ({
    style: {},
    inert: false,
    textContent: "",
    decode: () => Promise.resolve(),
  });
  const nodes = new Map(
    [
      ".scroll-story",
      ".hero-intro",
      ".cabinet-object",
      ".cabinet-shadow",
      ".portal-wash",
      ".portal-menu",
      ".scroll-progress span",
    ].map((key) => [key, node()]),
  );
  nodes.get(".scroll-story").offsetHeight = 3000;
  const frames = Array.from({ length: 6 }, node);
  const motion = {
    matches: reduced,
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.innerHeight = 1000;
  globalThis.scrollY = 0;
  globalThis.document = { querySelector: () => node() };
  globalThis.matchMedia = () => motion;
  globalThis.requestAnimationFrame = (callback) => {
    raf.set(++nextId, callback);
    return nextId;
  };
  globalThis.cancelAnimationFrame = (id) => raf.delete(id);
  globalThis.window = {
    addEventListener: (event, callback) => listeners.set(event, callback),
    removeEventListener: (event) => listeners.delete(event),
    requestIdleCallback: () => 1,
    cancelIdleCallback() {},
    scrollTo({ top }) {
      globalThis.scrollY = top;
      listeners.get("scroll")?.();
    },
  };
  const controller = mountScrollScene({
    querySelector: (key) => nodes.get(key),
    querySelectorAll: (key) => (key === ".cabinet-frame" ? frames : []),
  });
  const flush = () => {
    let ticks = 0;
    while (raf.size) {
      assert.ok(
        ++ticks < 150,
        "animation must settle and stop requesting frames",
      );
      const batch = [...raf.values()];
      raf.clear();
      batch.forEach((callback) => callback());
    }
  };
  return {
    controller,
    nodes,
    frames,
    listeners,
    flush,
    scrollTo(y) {
      window.scrollTo({ top: y });
      flush();
    },
    cleanup() {
      controller.destroy();
      for (const [key, descriptor] of previous) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete globalThis[key];
      }
    },
  };
}

test("scroll scene reveals the back, zooms, unlocks menu, reverses and cleans up", () => {
  const scene = sceneHarness(false);
  try {
    scene.flush();
    assert.equal(scene.frames[0].style.opacity, 1);
    assert.equal(scene.nodes.get(".portal-menu").inert, true);
    scene.scrollTo(1200);
    assert.equal(scene.frames[5].style.opacity, 1);
    assert.notEqual(scene.nodes.get(".cabinet-object").style.transform, "none");
    scene.controller.explore();
    scene.flush();
    assert.equal(scene.nodes.get(".portal-menu").inert, false);
    assert.equal(scene.nodes.get(".portal-menu").style.opacity, 1);
    scene.scrollTo(0);
    assert.equal(scene.frames[0].style.opacity, 1);
    assert.equal(scene.nodes.get(".portal-menu").inert, true);
    scene.controller.destroy();
    assert.equal(scene.listeners.size, 0);
  } finally {
    scene.cleanup();
  }
});

test("reduced motion disables zoom and rotation but preserves access to the menu", () => {
  const scene = sceneHarness(true);
  try {
    scene.flush();
    assert.equal(scene.nodes.get(".cabinet-object").style.transform, "none");
    scene.controller.explore();
    scene.flush();
    assert.equal(scene.nodes.get(".cabinet-object").style.transform, "none");
    assert.equal(scene.nodes.get(".portal-menu").inert, false);
    assert.equal(scene.nodes.get(".portal-menu").style.opacity, 1);
  } finally {
    scene.cleanup();
  }
});

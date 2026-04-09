const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const bootDelayMs = prefersReducedMotion ? 0 : 1600;
const fallDurationMs = prefersReducedMotion ? 0 : 1150;
const bootShellDurationMs = prefersReducedMotion ? 0 : 1550;

const bootItems = Array.from(document.querySelectorAll(".boot-item"));

if (bootItems.length > 0) {
  bootItems.forEach((item, index) => {
    const offset = 80 + index * 70;
    item.style.animationDelay = `${offset}ms`;
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("boot-eject");

    setTimeout(() => {
      document.body.classList.remove("booting");
      document.body.classList.add("boot-complete");

      const bootShell = document.querySelector(".boot-shell");
      const bootScreen = document.querySelector(".boot-screen");

      const removeBootScreen = () => {
        if (bootScreen) bootScreen.remove();
      };

      if (prefersReducedMotion) {
        removeBootScreen();
        return;
      }

      if (bootShell) {
        const onAnimEnd = (event) => {
          if (event.animationName === "bootEject") removeBootScreen();
        };
        bootShell.addEventListener("animationend", onAnimEnd, { once: true });
      }

      const fallbackMs = Math.max(bootShellDurationMs, fallDurationMs + bootItems.length * 70) + 400;
      setTimeout(removeBootScreen, fallbackMs);
    }, prefersReducedMotion ? 0 : 120);
  }, bootDelayMs);
});

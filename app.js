const bootDelayMs = 2000;
const fallDurationMs = 900;

const bootItems = Array.from(document.querySelectorAll(".boot-item"));

if (bootItems.length > 0) {
  bootItems.forEach((item, index) => {
    const offset = 80 + index * 70;
    item.style.animationDelay = `${offset}ms`;
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.remove("booting");
    document.body.classList.add("boot-complete");

    const totalDuration = fallDurationMs + bootItems.length * 70 + 200;
    setTimeout(() => {
      const bootScreen = document.querySelector(".boot-screen");
      if (bootScreen) {
        bootScreen.remove();
      }
    }, totalDuration);
  }, bootDelayMs);
});

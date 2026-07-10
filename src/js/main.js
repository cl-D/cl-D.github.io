// Minimal enhancements — the site works fully without JavaScript.

// Keep the footer year current.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Hero "whoami" typing animation (Root page only).
// The full command is already in the HTML, so no-JS and reduced-motion
// visitors see the finished state.
const typedEl = document.getElementById("typed-cmd");
const outputEl = document.getElementById("hero-output");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typedEl && outputEl && !reducedMotion) {
  const command = typedEl.textContent;
  typedEl.textContent = "";
  outputEl.classList.add("pending");

  let i = 0;
  const typeNext = () => {
    if (i < command.length) {
      typedEl.textContent += command[i++];
      setTimeout(typeNext, 55 + Math.random() * 70);
    } else {
      // brief pause before the "output" appears, like a real command
      setTimeout(() => outputEl.classList.remove("pending"), 250);
    }
  };
  setTimeout(typeNext, 400);
}

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

// Tab-away prank: while this tab is hidden, its title and favicon switch to a
// random fake "suspicious" tab; both revert the instant the visitor returns.
// Icon paths are absolute because this script runs at every page depth.
const fakeTabs = [
  ["how to exit vim - Google Search", "google.ico"],
  ["is deleting System32 bad - Google Search", "google.ico"],
  ["Rick Astley - Never Gonna Give You Up - YouTube", "youtube.ico"],
  ["r/sysadmin on Reddit", "reddit.ico"],
  ["birds aren't real at DuckDuckGo", "duckduckgo.ico"],
  ["The internet used to be fun | Hacker News", "hackernews.ico"],
  ["did I just delete the production tenant - Google Search", "google.ico"],
  ["how to undo Intune wipe on ALL devices - ChatGPT", "chatgpt.ico"],
  ["is turning it off and on again a real fix - Google Search", "google.ico"],
  ["why is Exchange Online down again - r/sysadmin", "reddit.ico"],
  ["resignation letter template - Google Search", "google.ico"],
  ["how much do farmers make - Google Search", "google.ico"],
  ["Amazon.com: waifu pillow", "amazon.ico"],
  ["rust programming socks - Google Shopping", "google.ico"],
  ["am I boring - Google Search", "google.ico"],
  ["how to hack coworker's phone - Google Search", "google.ico"],
  ["is a VPN enough to hide from the FBI - Google Search", "google.ico"],
  ["ransomware as a service pricing - ChatGPT", "chatgpt.ico"],
];

const iconEl = document.querySelector("link[rel='icon']");
if (iconEl) {
  const realTitle = document.title;
  const realIcon = iconEl.href;
  let lastIndex = -1;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      let index;
      do {
        index = Math.floor(Math.random() * fakeTabs.length);
      } while (index === lastIndex); // never the same fake twice in a row
      lastIndex = index;
      document.title = fakeTabs[index][0];
      iconEl.href = "/img/tab/" + fakeTabs[index][1];
    } else {
      document.title = realTitle;
      iconEl.href = realIcon;
    }
  });
}

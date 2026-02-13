// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Side nav highlight
const sideLinksWrap = document.getElementById("sideLinks");
const indicator = document.getElementById("sideIndicator");
const sideLinks = Array.from(document.querySelectorAll(".sideLink"));
const sections = sideLinks.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);

function setActive(id){
  sideLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  const active = sideLinks.find(a => a.classList.contains("active"));
  if (!active || !indicator || !sideLinksWrap) return;

  const wrapRect = sideLinksWrap.getBoundingClientRect();
  const aRect = active.getBoundingClientRect();
  const y = aRect.top - wrapRect.top;
  indicator.style.transform = `translateY(${y}px)`;
}

const obs = new IntersectionObserver((entries) => {
  const best = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (best?.target?.id) setActive(best.target.id);
}, {
  root: null,
  rootMargin: "-20% 0px -65% 0px",
  threshold: [0.08, 0.18, 0.35, 0.55]
});

sections.forEach(s => obs.observe(s));

window.addEventListener("load", () => setActive(sections[0]?.id || "summary"));
window.addEventListener("resize", () => {
  const current = sideLinks.find(a => a.classList.contains("active"));
  if (current) setActive(current.getAttribute("href").slice(1));
});

// Subtle global matrix
const canvas = document.getElementById("matrix");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    canvas.width = 2; canvas.height = 2;
    ctx.fillStyle = "#05080d";
    ctx.fillRect(0,0,2,2);
  } else {
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%*+-";
    let w, h, cols, drops, fontSize;

    function resize(){
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      w = window.innerWidth;
      h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fontSize = Math.max(14, Math.floor(w / 95));
      cols = Math.floor(w / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * h);

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
    }

    function step(){
      // softer fade
      ctx.fillStyle = "rgba(5, 8, 13, 0.10)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i];

        ctx.fillStyle = "rgba(122, 255, 175, 0.55)";
        ctx.fillText(text, x, y);

        // slower motion
        drops[i] += fontSize * (0.50 + Math.random() * 0.40);

        if (drops[i] > h + 60 && Math.random() > 0.985) {
          drops[i] = -Math.random() * 260;
        }
      }

      requestAnimationFrame(step);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(step);
  }
}

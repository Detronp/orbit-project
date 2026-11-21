// Twinkling starfield with occasional shooting stars
(() => {
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let meteors = [];

  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    const count = Math.floor((innerWidth * innerHeight) / 2500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 * devicePixelRatio,
      t: Math.random() * Math.PI * 2,
      s: 0.01 + Math.random() * 0.03,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const st of stars) {
      st.t += st.s;
      ctx.globalAlpha = 0.4 + Math.sin(st.t) * 0.4;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (Math.random() < 0.006) {
      meteors.push({ x: Math.random() * canvas.width, y: 0, life: 1 });
    }
    ctx.lineWidth = 2 * devicePixelRatio;
    for (const m of meteors) {
      ctx.globalAlpha = m.life;
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - 60 * devicePixelRatio, m.y - 30 * devicePixelRatio);
      ctx.stroke();
      m.x += 14 * devicePixelRatio;
      m.y += 7 * devicePixelRatio;
      m.life -= 0.02;
    }
    meteors = meteors.filter((m) => m.life > 0);

    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  addEventListener("resize", resize);
  resize();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) frame();
})();

// Space facts
async function loadFact() {
  const el = document.getElementById("fact");
  el.style.opacity = 0;
  try {
    const res = await fetch("/api/fact");
    const data = await res.json();
    setTimeout(() => { el.textContent = data.fact; el.style.opacity = 1; }, 250);
  } catch {
    el.textContent = "Lost contact with the server.";
    el.style.opacity = 1;
  }
}
document.getElementById("new-fact").addEventListener("click", loadFact);
loadFact();

// Container info
function fmtUptime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return [h && `${h}h`, (h || m) && `${m}m`, `${sec}s`].filter(Boolean).join(" ");
}

async function loadInfo() {
  try {
    const data = await (await fetch("/api/info")).json();
    document.querySelectorAll("#info dd").forEach((dd) => {
      const v = data[dd.dataset.k];
      dd.textContent = dd.dataset.k === "uptime_seconds" ? fmtUptime(v) : v;
    });
  } catch { /* server unreachable; keep last values */ }
}
loadInfo();
setInterval(loadInfo, 5000);

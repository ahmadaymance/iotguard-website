/* ============================================================
   IOTGUARD — Modern Interactive Logic
   CLI, Counters, Waterfall, 3D Card Tilt, Scroll Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. CLI TERMINAL
     ============================================================ */
  const cliOutput = document.getElementById('cliOutput');
  const cliInput = document.getElementById('cliInput');
  const cmdBtns = document.querySelectorAll('.cmd-chip');

  const commands = {
    help: `Available commands:
  status      Engine health and model info
  simulate    Run a DDoS attack simulation
  inspect     SHAP breakdown for a sample event
  benchmark   Model comparison table
  rules       Active firewall rules
  clear       Clear terminal`,

    status: `[IoTGuard Engine Status]
  Status:        OPERATIONAL
  Socket:        /var/log/suricata/eve.json
  Model:         LightGBM v1.0.2 + IsolationForest
  ROC-AUC:       96.07%  |  PR-AUC: 97.10%
  Latency:       1.78 ms / window (13 features)
  Thresholds:    Alert >= 0.85  |  Block >= 0.90
  Memory:        48.2 MB RSS
  Tests:         112 / 112 passing`,

    simulate: `[Attack Simulation]
  [00:01] Injecting SYN Flood (5,000 pkt/s)...
  [00:02] Score: 0.998 — CRITICAL
  [00:02] Top features: flows_per_sec (+7.37), syn_ratio (+4.01)
  [00:02] → nftables blacklist { 192.168.1.104 }
  [00:03] Flow mitigated.`,

    inspect: `[SHAP Breakdown — Event #4092]
  Base E[f(x)] = 0.124
  ─────────────────────────────────────────────
  Feature              Value        SHAP
  ─────────────────────────────────────────────
  flows_per_sec        4,821/s      +7.37
  syn_ratio            0.98         +4.01
  bytes_total          1.42 MB      +2.57
  http_ratio           0.02         -0.84
  ─────────────────────────────────────────────
  f(x) = 0.998 → DDoS (SYN Flood)`,

    benchmark: `[Benchmark — CIC-IoT-2023]
  Model              ROC-AUC   PR-AUC   Latency    Memory
  ─────────────────────────────────────────────────────────
  LightGBM (ours)    96.07%    97.10%   1.78 ms    48.2 MB
  XGBoost            95.82%    96.85%   4.12 ms    112 MB
  Random Forest      93.40%    94.10%   8.45 ms    210 MB
  MLP                91.15%    92.05%   12.3 ms    340 MB`,

    rules: `[Firewall Rules]
  #1  BLOCK  192.168.1.104  DDoS SYN Flood    (KILL)
  #2  BLOCK  192.168.1.189  Port Scan         (HARD)
  #3  ALERT  192.168.1.201  HTTP Injection    (1/3 grace)`
  };

  function runCmd(str) {
    const cmd = str.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'clear') { if (cliOutput) cliOutput.innerHTML = ''; return; }

    const block = document.createElement('div');
    block.style.marginBottom = '10px';

    const line = document.createElement('div');
    line.className = 't-line';
    line.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">iotguard ${cmd}</span>`;

    const out = document.createElement('div');
    out.className = 't-output';

    if (commands[cmd]) {
      out.textContent = commands[cmd];
    } else {
      out.textContent = `Unknown command: '${cmd}'. Type 'help' for options.`;
      out.style.color = 'var(--red)';
    }

    block.appendChild(line);
    block.appendChild(out);

    if (cliOutput) {
      cliOutput.appendChild(block);
      cliOutput.parentElement.scrollTop = cliOutput.parentElement.scrollHeight;
    }
  }

  if (cliInput) {
    cliInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { runCmd(cliInput.value); cliInput.value = ''; }
    });
  }

  cmdBtns.forEach(btn => {
    btn.addEventListener('click', () => { if (btn.dataset.cmd) runCmd(btn.dataset.cmd); });
  });

  /* ============================================================
     2. ANIMATED STAT COUNTERS (works for both .stat-value and .bento-stat)
     ============================================================ */
  const counters = document.querySelectorAll('[data-target]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = target.toString().includes('.')
        ? target.toString().split('.')[1].length : 0;
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObs.observe(el));

  /* ============================================================
     3. BENTO CARD 3D TILT EFFECT
     ============================================================
     Cards subtly tilt toward the mouse cursor on hover.
  */
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // max 4 degrees
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ============================================================
     4. SHAP WATERFALL BAR ANIMATION
     ============================================================ */
  const waterfall = document.querySelector('.waterfall');
  if (waterfall) {
    const wfObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const rows = entry.target.querySelectorAll('.wf-row');
        rows.forEach((row, i) => {
          const val = parseFloat(row.dataset.val);
          const bar = row.querySelector('.wf-bar');
          if (bar) {
            setTimeout(() => {
              bar.style.width = `${Math.min(Math.abs(val) * 12, 100)}%`;
            }, 200 + i * 180);
          }
        });
        wfObs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    wfObs.observe(waterfall);
  }

  /* ============================================================
     5. SCROLL REVEAL
     ============================================================ */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.06 });
  reveals.forEach(el => revealObs.observe(el));

  /* ============================================================
     6. ACTIVE NAV HIGHLIGHTING
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  function updateNav() {
    const y = window.scrollY + 150;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h = sec.offsetHeight;
      const id = sec.id;
      if (y >= top && y < top + h) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ============================================================
     7. MOBILE MENU
     ============================================================ */
  const ham = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (ham && drawer) {
    ham.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      ham.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        ham.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     8. HERO TERMINAL TYPING EFFECT
     ============================================================
     Simulates typing the terminal output when page loads.
  */
  const heroTermBody = document.querySelector('.hero-terminal-body');
  if (heroTermBody) {
    const originalHTML = heroTermBody.innerHTML;
    heroTermBody.innerHTML = '';
    heroTermBody.style.opacity = '1';

    // Convert to text chunks for typing
    const wrapper = document.createElement('div');
    wrapper.innerHTML = originalHTML;
    const fullText = wrapper.textContent;

    let charIndex = 0;
    const speed = 12; // ms per character

    function typeChar() {
      if (charIndex <= fullText.length) {
        // Rebuild with original HTML, but slice to current position
        // Simple approach: reveal the whole thing character-mapped
        heroTermBody.innerHTML = originalHTML;
        heroTermBody.style.clipPath = `inset(0 ${100 - (charIndex / fullText.length) * 100}% 0 0)`;
        charIndex += 2;
        requestAnimationFrame(() => setTimeout(typeChar, speed));
      } else {
        heroTermBody.style.clipPath = 'none';
      }
    }

    // Start after a brief delay
    setTimeout(typeChar, 600);
  }

});

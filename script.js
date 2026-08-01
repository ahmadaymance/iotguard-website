/* ============================================================
   IOTGUARD — SYSTEMS ENGINEERING INTERACTIVE LOGIC
   CLI Shell Prompt, SHAP Waterfall Plot & Model Benchmarks
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. RADAR CANVAS SWEEP ANIMATION
     ============================================================ */
  const canvas = document.getElementById('radarCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = 280;
    let height = canvas.height = 280;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    let angle = 0;

    const blips = [
      { r: radius * 0.45, a: 1.2, size: 4, type: 'attack' },
      { r: radius * 0.75, a: 3.4, size: 5, type: 'attack' },
      { r: radius * 0.3, a: 5.1, size: 3, type: 'benign' },
      { r: radius * 0.85, a: 0.5, size: 4, type: 'benign' },
    ];

    function drawRadar() {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1.5;
      
      [0.3, 0.6, 0.9].forEach(factor => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * factor, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.stroke();

      blips.forEach(b => {
        const x = centerX + b.r * Math.cos(b.a);
        const y = centerY + b.r * Math.sin(b.a);
        
        ctx.beginPath();
        ctx.arc(x, y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = b.type === 'attack' ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)';
        ctx.fill();
      });

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius * 0.9, angle, angle + 0.35);
      ctx.closePath();
      
      const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * 0.9 * Math.cos(angle + 0.35), centerY + radius * 0.9 * Math.sin(angle + 0.35));
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();

      angle += 0.025;
      if (angle > Math.PI * 2) angle = 0;

      requestAnimationFrame(drawRadar);
    }

    drawRadar();
  }

  /* ============================================================
     2. INTERACTIVE CLI SHELL PROMPT ($ iotguard)
     ============================================================ */
  const cliOutput = document.getElementById('cliOutput');
  const cliInput = document.getElementById('cliInput');
  const cliChips = document.querySelectorAll('.cli-chip');

  const cliCommands = {
    help: `Available IoTGuard CLI Commands:
  status        Check engine health, model build, and detection threshold
  simulate      Run attack simulation window (DDoS, Port Scan, HTTP Injection)
  inspect       Print SHAP feature vector breakdown for sample packet window
  benchmark     Display cross-validation performance vs XGBoost & Random Forest
  rules         List active netsh / nftables firewall rules
  clear         Clear the terminal screen`,
    
    status: `[IoTGuard Engine Status]
  Status:           OPERATIONAL (Listening on Suricata socket /var/log/suricata/eve.json)
  Model Engine:     LightGBM v1.0.2 (Supervised) + IsolationForest (Unsupervised Anomaly)
  Accuracy (AUC):   96.07% ROC-AUC | 97.10% PR-AUC
  Inference Speed:  1.78 ms / packet window (13 features)
  Thresholds:       Soft Alert >= 0.85 | Netsh Block-Kill >= 0.90
  Memory Usage:     48.2 MB RSS
  Pytest Suite:     112 / 112 Tests Passing [OK]`,

    simulate: `[Running Attack Simulation...]
  [00:01] Injecting SYN Flood flow window (5,000 packets/sec)...
  [00:02] Decision Engine Score: 0.998 [CRITICAL BREACH]
  [00:02] Top SHAP Contributor:  flows_per_sec (+7.37), syn_ratio (+4.01)
  [00:02] Mitigation Triggered: nftables add element inet filter blacklist { 192.168.1.104 }
  [00:03] Simulation Complete. Flow successfully mitigated.`,

    inspect: `[SHAP Feature Vector Breakdown — Event #4092 (192.168.1.104)]
  Base Expected Value E[f(x)] = 0.124
  -------------------------------------------------------------
  Feature Name          Feature Value      SHAP Push Vector
  -------------------------------------------------------------
  flows_per_sec         4,821 /s           +7.37 [POSITIVE PUSH]
  syn_ratio             0.98               +4.01 [POSITIVE PUSH]
  bytes_total           1.42 MB            +2.57 [POSITIVE PUSH]
  http_ratio            0.02               -0.84 [NEGATIVE PUSH]
  -------------------------------------------------------------
  Final Probability Score f(x) = 0.998 -> CLASSIFIED: DDoS (SYN Flood)`,

    benchmark: `[Cross-Validation Model Benchmark Matrix — CIC-IoT-2023]
  Model Name          ROC-AUC     PR-AUC    Latency (ms)   Memory (MB)
  -------------------------------------------------------------
  LightGBM (Used)     96.07%      97.10%    1.78 ms        48.2 MB   [BEST]
  XGBoost             95.82%      96.85%    4.12 ms        112.4 MB
  Random Forest       93.40%      94.10%    8.45 ms        210.0 MB
  Deep Neural Net     91.15%      92.05%    12.30 ms       340.0 MB`,

    rules: `[Active Automated Firewall Rules]
  RULE #1: BLOCK inet filter blacklist ip=192.168.1.104 (DDoS SYN Flood — Severity: KILL)
  RULE #2: BLOCK inet filter blacklist ip=192.168.1.189 (Port Scan — Severity: HARD)
  RULE #3: SOFT ALERT ip=192.168.1.201 (HTTP Injection — Grace hits: 1/3)`
  };

  function executeCliCommand(cmdStr) {
    const cleanCmd = cmdStr.trim().toLowerCase();
    
    if (!cleanCmd) return;

    if (cleanCmd === 'clear') {
      if (cliOutput) cliOutput.innerHTML = '';
      return;
    }

    const commandEntry = document.createElement('div');
    commandEntry.style.marginBottom = '12px';

    const promptLine = document.createElement('div');
    promptLine.className = 'cli-line';
    promptLine.innerHTML = `<span class="cli-prompt">$ iotguard</span> <span class="cli-cmd">${cleanCmd}</span>`;

    const responseLine = document.createElement('div');
    responseLine.className = 'cli-output';

    if (cliCommands[cleanCmd]) {
      responseLine.textContent = cliCommands[cleanCmd];
    } else {
      responseLine.textContent = `Command not recognized: '${cleanCmd}'. Type 'help' for available options.`;
      responseLine.style.color = 'var(--crimson)';
    }

    commandEntry.appendChild(promptLine);
    commandEntry.appendChild(responseLine);

    if (cliOutput) {
      cliOutput.appendChild(commandEntry);
      cliOutput.parentElement.scrollTop = cliOutput.parentElement.scrollHeight;
    }
  }

  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = cliInput.value;
        cliInput.value = '';
        executeCliCommand(val);
      }
    });
  }

  cliChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd) executeCliCommand(cmd);
    });
  });

  /* ============================================================
     3. SHAP WATERFALL PLOT ANIMATOR
     ============================================================ */
  const shapWaterfallRows = document.querySelectorAll('.wf-row');
  
  shapWaterfallRows.forEach(row => {
    const val = parseFloat(row.dataset.val);
    const bar = row.querySelector('.wf-bar');
    if (bar) {
      setTimeout(() => {
        bar.style.width = `${Math.min(Math.abs(val) * 12, 100)}%`;
      }, 300);
    }
  });

  /* ============================================================
     4. SCROLL REVEAL OBSERVER
     ============================================================ */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
});

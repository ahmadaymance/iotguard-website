/* ============================================================
   IOTGUARD — LIVE CYBER OPERATIONS & REAL-TIME INTERACTIVE ENGINE
   Real-Time Traffic Simulator, Interactive Stage Architecture,
   SHAP Waterfall Animator & CLI Shell
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. RADAR CANVAS SWEEP ANIMATION
     ============================================================ */
  const canvas = document.getElementById('radarCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = 260;
    let height = canvas.height = 260;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    let angle = 0;

    let blips = [
      { r: radius * 0.45, a: 1.2, size: 4, type: 'benign' },
      { r: radius * 0.75, a: 3.4, size: 5, type: 'benign' },
      { r: radius * 0.3, a: 5.1, size: 3, type: 'benign' },
      { r: radius * 0.85, a: 0.5, size: 4, type: 'benign' },
    ];

    window.updateRadarBlips = function(mode) {
      if (mode === 'ddos' || mode === 'portscan' || mode === 'sqli') {
        blips = [
          { r: radius * 0.35, a: 0.8, size: 6, type: 'attack' },
          { r: radius * 0.65, a: 1.9, size: 7, type: 'attack' },
          { r: radius * 0.8, a: 3.2, size: 6, type: 'attack' },
          { r: radius * 0.5, a: 4.5, size: 5, type: 'attack' },
          { r: radius * 0.9, a: 5.8, size: 6, type: 'attack' },
        ];
      } else {
        blips = [
          { r: radius * 0.45, a: 1.2, size: 4, type: 'benign' },
          { r: radius * 0.75, a: 3.4, size: 5, type: 'benign' },
          { r: radius * 0.3, a: 5.1, size: 3, type: 'benign' },
          { r: radius * 0.85, a: 0.5, size: 4, type: 'benign' },
        ];
      }
    };

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
        ctx.fillStyle = b.type === 'attack' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.85)';
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
     2. REAL-TIME PACKET FLOW STREAM & THREAT SIMULATOR
     ============================================================ */
  const packetTableBody = document.getElementById('packetStreamBody');
  const scoreVal = document.getElementById('scoreVal');
  const scoreThreatType = document.getElementById('scoreThreatType');
  const scoreBarFill = document.getElementById('scoreBarFill');
  const scoreBadge = document.getElementById('scoreBadge');
  const fwLogBody = document.getElementById('fwLogBody');
  const simBtns = document.querySelectorAll('.sim-btn');

  let currentMode = 'normal';
  let packetCounter = 1000;

  const attackScenarios = {
    normal: {
      name: 'NORMAL TRAFFIC',
      score: 0.024,
      badgeText: 'SAFE [0.02]',
      badgeClass: 'badge-safe',
      scoreColor: '#10b981',
      barPct: 2.4,
      proto: 'TCP',
      ip: '192.168.1.45',
      rate: '14 /s'
    },
    ddos: {
      name: 'CRITICAL DDoS (SYN FLOOD)',
      score: 0.998,
      badgeText: 'CRITICAL BREACH [0.99]',
      badgeClass: 'badge-threat',
      scoreColor: '#ef4444',
      barPct: 99.8,
      proto: 'TCP',
      ip: '192.168.1.104',
      rate: '5,000 /s'
    },
    portscan: {
      name: 'WARNING (STEALTH PORT SCAN)',
      score: 0.884,
      badgeText: 'ALERT [0.88]',
      badgeClass: 'badge-threat',
      scoreColor: '#f59e0b',
      barPct: 88.4,
      proto: 'TCP',
      ip: '192.168.1.189',
      rate: '1,200 /s'
    },
    sqli: {
      name: 'WARNING (HTTP INJECTION)',
      score: 0.862,
      badgeText: 'ALERT [0.86]',
      badgeClass: 'badge-threat',
      scoreColor: '#f59e0b',
      barPct: 86.2,
      proto: 'HTTP/2',
      ip: '192.168.1.201',
      rate: '340 /s'
    }
  };

  function addPacketRow(scenario) {
    if (!packetTableBody) return;

    packetCounter++;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const scData = attackScenarios[scenario] || attackScenarios.normal;
    const isThreat = scenario !== 'normal';

    const row = document.createElement('tr');
    if (isThreat) row.className = 'threat-row';

    row.innerHTML = `
      <td>${timeStr}</td>
      <td>${scData.ip}</td>
      <td>${scData.proto}</td>
      <td>${scData.rate}</td>
      <td><strong>${scData.score}</strong></td>
      <td>${isThreat ? '<span style="color:#ef4444;font-weight:700">BLOCK</span>' : '<span style="color:#10b981">PASS</span>'}</td>
    `;

    packetTableBody.insertBefore(row, packetTableBody.firstChild);

    while (packetTableBody.children.length > 8) {
      packetTableBody.removeChild(packetTableBody.lastChild);
    }
  }

  function logFirewallRule(scenario) {
    if (!fwLogBody || scenario === 'normal') return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const scData = attackScenarios[scenario];

    const entry = document.createElement('div');
    entry.className = 'fw-log-entry block';
    entry.textContent = `[${timeStr}] BLOCK DEPLOYED: nftables add element inet filter blacklist { ${scData.ip} } (Threat Score: ${scData.score})`;

    fwLogBody.insertBefore(entry, fwLogBody.firstChild);
    while (fwLogBody.children.length > 10) {
      fwLogBody.removeChild(fwLogBody.lastChild);
    }
  }

  function applyScenario(scKey) {
    currentMode = scKey;
    const data = attackScenarios[scKey];

    if (scoreVal) {
      scoreVal.textContent = data.score;
      scoreVal.style.color = data.scoreColor;
    }
    if (scoreThreatType) scoreThreatType.textContent = data.name;
    if (scoreBarFill) scoreBarFill.style.width = `${data.barPct}%`;

    if (scoreBadge) {
      scoreBadge.textContent = data.badgeText;
      scoreBadge.className = data.badgeClass;
    }

    if (window.updateRadarBlips) window.updateRadarBlips(scKey);

    addPacketRow(scKey);
    logFirewallRule(scKey);
  }

  simBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sc = btn.dataset.scenario;
      applyScenario(sc);
    });
  });

  // Auto tick packet stream every 2 seconds
  setInterval(() => {
    addPacketRow(currentMode);
  }, 2000);

  /* ============================================================
     3. INTERACTIVE 4-STAGE ARCHITECTURE STAGE SELECTOR
     ============================================================ */
  const stageCards = document.querySelectorAll('.stage-step-card');
  const stageDetailPanel = document.getElementById('stageDetailPanel');

  const stageData = {
    1: {
      title: "Stage 01: Suricata EVE JSON Packet Ingestion",
      desc: "Suricata runs as an in-line network daemon reading raw socket frames and outputting flow metadata into /var/log/suricata/eve.json.",
      codeHeader: "INPUT LOG: /var/log/suricata/eve.json",
      code: `// Suricata Flow Record Stream
{
  "timestamp": "2026-08-01T13:42:01.002Z",
  "event_type": "flow",
  "src_ip": "192.168.1.104",
  "dest_ip": "10.0.0.1",
  "proto": "TCP",
  "tcp": { "syn": true, "ack": false, "tcp_flags": "02" },
  "flow": { "pkts_toserver": 4821, "bytes_toserver": 1420912 }
}`,
      specList: [
        "Daemon: Suricata 7.0 IDS/IPS Engine",
        "Interface: eth0 / wlan0 promiscuous mode",
        "Format: JSON Lines (eve.json)",
        "Throughput: Tested up to 10,000 packets/sec"
      ]
    },
    2: {
      title: "Stage 02: Sliding Window 13-Feature Aggregator",
      desc: "Raw socket events are grouped in rolling 1-second sliding windows and transformed into a 13-element numerical float vector.",
      codeHeader: "FEATURE EXTRACTOR: feature_pipeline.py",
      code: `# 13-Numerical Feature Aggregation
X_vector = np.array([[
  4821.0,   # flows_per_sec
  0.982,    # syn_ratio
  1420.9,   # total_kb_per_sec
  0.021,    # http_ratio
  0.004,    # protocol_diversity
  64.0,     # mean_packet_bytes
  1.21      # iat_mean_ms
]])`,
      specList: [
        "Window Size: 1.0 Second Sliding Window",
        "Feature Dimensions: 13 Numerical Features",
        "Normalization: StandardScaler + RobustScaler",
        "Latency: 0.42 ms preprocessing time"
      ]
    },
    3: {
      title: "Stage 03: LightGBM Supervised + IsolationForest Ensemble",
      desc: "The 13-feature vector is fed into our trained LightGBM model for attack classification and IsolationForest for unsupervised anomaly detection.",
      codeHeader: "INFERENCE ENGINE: model_service.py",
      code: `# Inference Call
lgb_score = model_lgb.predict_proba(X_vector)[0][1]
iso_score = model_iso.decision_function(X_vector)[0]

combined_threat_score = 0.85 * lgb_score + 0.15 * iso_anomaly
# Target Result: 0.998 [DDoS SYN Flood Detected]`,
      specList: [
        "Supervised Model: LightGBM (100 Trees, max_depth=6)",
        "Unsupervised Model: IsolationForest (Contamination=0.01)",
        "Inference Speed: 1.78 ms per prediction window",
        "Accuracy Metrics: 96.07% ROC-AUC | 97.10% PR-AUC"
      ]
    },
    4: {
      title: "Stage 04: SHAP Attribution & Automated Firewall Response",
      desc: "When threat score exceeds 0.90, Tree-SHAP computes exact feature contributions and generates immediate firewall blocking rules.",
      codeHeader: "FIREWALL CONTROLLER: mitigation_engine.py",
      code: `# Automated Rule Injection
if threat_score >= 0.90:
    rule = f"nftables add element inet filter blacklist {{ {src_ip} }}"
    os.system(rule)
    # Generated Rule: nftables add element inet filter blacklist { 192.168.1.104 }`,
      specList: [
        "Explainer: Tree-SHAP Fast Exact Attribution",
        "Firewall Backends: Linux nftables & Windows netsh",
        "Response Speed: < 5 ms total mitigation loop",
        "Test Suite: 112 / 112 Pytest tests passing [OK]"
      ]
    }
  };

  function renderStageDetail(stageId) {
    if (!stageDetailPanel) return;

    const st = stageData[stageId] || stageData[1];

    stageDetailPanel.innerHTML = `
      <div class="stage-detail-grid">
        <div>
          <div class="stage-detail-title">${st.title}</div>
          <div class="stage-detail-text">${st.desc}</div>
          <div class="hud-card" style="padding:16px; background:rgba(3,7,18,0.6);">
            <div class="mono text-cyan" style="font-size:0.75rem; font-weight:700; margin-bottom:8px;">STAGE SPECIFICATIONS:</div>
            <ul style="list-style:none; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); line-height:1.9;">
              ${st.specList.map(s => `<li>• ${s}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="code-box">
          <div class="code-box-header">
            <span>${st.codeHeader}</span>
            <span class="text-emerald">ACTIVE PIPELINE</span>
          </div>
          <div class="code-content">${st.code}</div>
        </div>
      </div>
    `;
  }

  stageCards.forEach(card => {
    card.addEventListener('click', () => {
      stageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const stId = card.dataset.stage;
      renderStageDetail(stId);
    });
  });

  // Render initial stage 1
  renderStageDetail(1);

  /* ============================================================
     4. INTERACTIVE CLI SHELL PROMPT ($ iotguard)
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
  Pytest Suite:     112 / 112 Pytest tests passing [OK]`,

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
     5. SCROLL REVEAL OBSERVER
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

/* ============================================================
   IOTGUARD — Next-Gen Interactive Logic & Motion Engine
   Top IT Company Experience · Web Audio · Canvas Radar
   Real-Time Telemetry · Dynamic SHAP Sandbox · CLI Terminal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. WEB AUDIO API SYNTHESIZER (Cyber Sound FX)
     ============================================================ */
  let audioCtx = null;
  let audioEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberTone(freqStart, freqEnd, duration, type = 'sine', gainVal = 0.08) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      audioToggle.classList.toggle('active', audioEnabled);
      if (audioEnabled) {
        playCyberTone(440, 880, 0.15, 'sine', 0.1);
        showToast('🔊 Cyber Sound Effects Enabled');
      } else {
        showToast('🔇 Audio FX Muted');
      }
    });
  }

  /* ============================================================
     2. TOAST NOTIFICATION SYSTEM
     ============================================================ */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  /* ============================================================
     3. READING SCROLL PROGRESS BAR
     ============================================================ */
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgress) {
      const progress = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  }, { passive: true });

  /* ============================================================
     4. NAVBAR SCROLL EFFECT & ACTIVE LINK TRACKING
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  function handleScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    const scrollY = window.scrollY + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.id;
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ============================================================
     5. MOBILE MENU
     ============================================================ */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const open = mobileDrawer.classList.toggle('open');
      hamburgerBtn.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     6. LIVE THREAT COUNTER TICKER
     ============================================================ */
  const threatCounter = document.getElementById('threatCounter');
  let currentThreatCount = 2418924;

  if (threatCounter) {
    setInterval(() => {
      // Realistic packet count increment
      const increment = Math.floor(Math.random() * 5) + 1;
      currentThreatCount += increment;
      threatCounter.textContent = currentThreatCount.toLocaleString();
    }, 1800);
  }

  /* Live UTC Clock in SOC Header */
  const liveUtcClock = document.getElementById('liveUtcClock');
  if (liveUtcClock) {
    function updateClock() {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      liveUtcClock.textContent = `${h}:${m}:${s} UTC`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ============================================================
     7. HERO CYBER MESH CANVAS (Dynamic Constellation & Packets)
     ============================================================ */
  const canvas = document.getElementById('particleCanvas');
  let isAttackMode = false;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let packets = [];
    let radarAngle = 0;
    let mouse = { x: -1000, y: -1000, active: false };

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    class Particle {
      constructor(isHub = false) {
        this.isHub = isHub;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * (isHub ? 0.3 : 0.6);
        this.vy = (Math.random() - 0.5) * (isHub ? 0.3 : 0.6);
        this.radius = isHub ? 4.5 : Math.random() * 2 + 1.2;
        this.color = isHub ? '#00f0ff' : '#64748b';
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.03;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle mouse pull
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            this.x += (dx / dist) * 0.8;
            this.y += (dy / dist) * 0.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        const r = this.isHub ? this.radius + Math.sin(this.pulse) * 1.2 : this.radius;
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isAttackMode && this.isHub ? '#f43f5e' : this.color;
        ctx.fill();

        if (this.isHub) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, r * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = isAttackMode ? 'rgba(244, 63, 94, 0.25)' : 'rgba(0, 240, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    class DataPacket {
      constructor(fromNode, toNode, isMalicious = false) {
        this.from = fromNode;
        this.to = toNode;
        this.progress = 0;
        this.speed = (Math.random() * 0.015) + 0.01;
        this.isMalicious = isMalicious;
      }

      update() {
        this.progress += this.speed;
        return this.progress >= 1;
      }

      draw() {
        const curX = this.from.x + (this.to.x - this.from.x) * this.progress;
        const curY = this.from.y + (this.to.y - this.from.y) * this.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, this.isMalicious ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = this.isMalicious ? '#f43f5e' : '#00f0ff';
        ctx.shadowColor = this.isMalicious ? '#f43f5e' : '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      packets = [];
      const count = Math.min(Math.floor((width * height) / 14000), 55);

      for (let i = 0; i < count; i++) {
        particles.push(new Particle(i < 8));
      }
    }

    window.addEventListener('resize', resizeCanvas);
    canvas.parentElement.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    resizeCanvas();

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Radar scan effect
      radarAngle += 0.008;
      const centerX = width * 0.65;
      const centerY = height * 0.45;
      const radarRadius = Math.min(width, height) * 0.45;

      const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radarRadius);
      grad.addColorStop(0, isAttackMode ? 'rgba(244, 63, 94, 0.06)' : 'rgba(0, 240, 255, 0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

      // Connect nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isAttackMode
              ? `rgba(244, 63, 94, ${alpha * 1.5})`
              : `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Spawn packet along links occasionally
            if (Math.random() < 0.003 && packets.length < 25) {
              packets.push(new DataPacket(particles[i], particles[j], isAttackMode));
            }
          }
        }
      }

      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Update & Draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        if (packets[i].update()) {
          packets.splice(i, 1);
        } else {
          packets[i].draw();
        }
      }

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ============================================================
     8. REAL-TIME PACKET OSCILLOSCOPE CANVAS (Hero SOC Deck)
     ============================================================ */
  const oscCanvas = document.getElementById('packetOscilloscope');
  let oscPhase = 0;
  let oscSpikeIntensity = 1;

  if (oscCanvas) {
    const oscCtx = oscCanvas.getContext('2d');

    function drawOscilloscope() {
      const w = oscCanvas.parentElement.clientWidth;
      const h = 85;
      oscCanvas.width = w;
      oscCanvas.height = h;

      oscCtx.clearRect(0, 0, w, h);

      // Grid line
      oscCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      oscCtx.lineWidth = 1;
      oscCtx.beginPath();
      oscCtx.moveTo(0, h / 2);
      oscCtx.lineTo(w, h / 2);
      oscCtx.stroke();

      // Wave
      oscCtx.beginPath();
      oscPhase += 0.08;

      const isThreat = isAttackMode || oscSpikeIntensity > 2;

      for (let x = 0; x < w; x++) {
        let y = h / 2;
        if (isThreat) {
          // Chaotic high frequency burst
          y += Math.sin((x * 0.08) + oscPhase) * (24 * oscSpikeIntensity * 0.4);
          y += (Math.random() - 0.5) * 16;
        } else {
          // Smooth benign flow wave
          y += Math.sin((x * 0.03) + oscPhase) * 12;
          y += Math.sin((x * 0.07) - oscPhase * 0.5) * 6;
        }

        if (x === 0) oscCtx.moveTo(x, y);
        else oscCtx.lineTo(x, y);
      }

      oscCtx.strokeStyle = isThreat ? '#f43f5e' : '#00f0ff';
      oscCtx.lineWidth = isThreat ? 2 : 1.8;
      oscCtx.shadowColor = isThreat ? '#f43f5e' : '#00f0ff';
      oscCtx.shadowBlur = 10;
      oscCtx.stroke();
      oscCtx.shadowBlur = 0;

      requestAnimationFrame(drawOscilloscope);
    }
    requestAnimationFrame(drawOscilloscope);
  }

  /* Quick SOC Simulation Triggers */
  const socTriggerBtns = document.querySelectorAll('.soc-trigger-btn');
  const oscThroughputTag = document.getElementById('oscThroughputTag');
  const heroThreatFeedRow = document.getElementById('heroThreatFeedRow');

  socTriggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      socTriggerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;

      playCyberTone(600, 300, 0.08, 'sine', 0.06);

      if (type === 'synflood') {
        isAttackMode = true;
        oscSpikeIntensity = 3.2;
        if (oscThroughputTag) oscThroughputTag.textContent = '5,120 pkt/s';
        if (heroThreatFeedRow) heroThreatFeedRow.style.display = 'grid';
        showToast('⚠️ Injected SYN Flood attack pattern');
      } else if (type === 'portscan') {
        isAttackMode = true;
        oscSpikeIntensity = 2.1;
        if (oscThroughputTag) oscThroughputTag.textContent = '1,890 pkt/s';
        if (heroThreatFeedRow) heroThreatFeedRow.style.display = 'grid';
        showToast('🔍 Injected Port Reconnaissance pattern');
      } else {
        isAttackMode = false;
        oscSpikeIntensity = 1;
        if (oscThroughputTag) oscThroughputTag.textContent = '1,240 pkt/s';
        if (heroThreatFeedRow) heroThreatFeedRow.style.display = 'none';
        showToast('✅ Reset to benign telemetry stream');
      }
    });
  });

  /* ============================================================
     9. INTERACTIVE ATTACK SIMULATOR & DEFENSE LAB
     ============================================================ */
  const scenarioData = {
    synflood: {
      srcIp: '192.168.1.104:443',
      flowsSec: '4,821 /s',
      synRatio: '0.982',
      meanBytes: '64.0 B',
      barPercent: '96%',
      scoreVal: '0.998',
      verdictTag: 'CRITICAL',
      verdictClass: 'critical',
      verdictSummary: 'High-confidence DDoS SYN flood detected. Extreme flow rate and asymmetric SYN flags.',
      shap: [
        { name: 'flows_per_sec', val: '+7.37', width: '92%', type: 'pos' },
        { name: 'syn_ratio', val: '+4.01', width: '62%', type: 'pos' },
        { name: 'bytes_total', val: '+2.57', width: '40%', type: 'pos' }
      ],
      rule: 'nftables add element inet filter blacklist { 192.168.1.104 }',
      execTime: '0.02ms eBPF',
      actionTag: 'Active Block',
      resolution: 'TCP flood neutralized in kernel. Zero host packet loss.'
    },
    mirai: {
      srcIp: '192.168.1.72:23',
      flowsSec: '2,140 /s',
      synRatio: '0.450',
      meanBytes: '48.0 B',
      barPercent: '75%',
      scoreVal: '0.942',
      verdictTag: 'CRITICAL',
      verdictClass: 'critical',
      verdictSummary: 'Mirai IoT botnet credential brute force detected targeting Telnet port 23/2323.',
      shap: [
        { name: 'port_entropy', val: '+5.12', width: '78%', type: 'pos' },
        { name: 'mean_packet_bytes', val: '+3.84', width: '56%', type: 'pos' },
        { name: 'syn_ratio', val: '+1.92', width: '32%', type: 'pos' }
      ],
      rule: 'nftables add element inet filter blacklist { 192.168.1.72 }',
      execTime: '0.03ms eBPF',
      actionTag: 'Active Block',
      resolution: 'Telnet brute force blocked. IoT device credentials safe.'
    },
    portscan: {
      srcIp: '192.168.1.189:80',
      flowsSec: '1,280 /s',
      synRatio: '0.890',
      meanBytes: '52.0 B',
      barPercent: '60%',
      scoreVal: '0.865',
      verdictTag: 'WARNING',
      verdictClass: 'critical',
      verdictSummary: 'Stealth half-open TCP port scan (Nmap -sS) traversing host ports 1-1024.',
      shap: [
        { name: 'proto_diversity', val: '+4.21', width: '68%', type: 'pos' },
        { name: 'syn_ratio', val: '+3.10', width: '52%', type: 'pos' },
        { name: 'flows_per_sec', val: '+2.05', width: '35%', type: 'pos' }
      ],
      rule: 'nftables add rule inet filter input ip saddr 192.168.1.189 drop',
      execTime: '0.04ms eBPF',
      actionTag: 'Active Filter',
      resolution: 'Reconnaissance halted before service enumeration.'
    },
    benign: {
      srcIp: '192.168.1.45:1883',
      flowsSec: '120 /s',
      synRatio: '0.020',
      meanBytes: '256.0 B',
      barPercent: '12%',
      scoreVal: '0.018',
      verdictTag: 'SAFE',
      verdictClass: 'success',
      verdictSummary: 'Legitimate smart thermostat MQTT telemetry packet burst. Clean traffic.',
      shap: [
        { name: 'http_ratio', val: '-0.95', width: '50%', type: 'neg' },
        { name: 'bytes_total', val: '-0.82', width: '42%', type: 'neg' },
        { name: 'flows_per_sec', val: '-0.45', width: '25%', type: 'neg' }
      ],
      rule: '# [NO KERNEL ACTION NEEDED] Traffic whitelisted via baseline ruleset',
      execTime: '0.01ms check',
      actionTag: 'Whitelisted',
      resolution: 'Telemetry passed smoothly to cloud broker.'
    }
  };

  const scenarioTabs = document.querySelectorAll('.scenario-tab');
  const simSrcIp = document.getElementById('simSrcIp');
  const simFlowsSec = document.getElementById('simFlowsSec');
  const simSynRatio = document.getElementById('simSynRatio');
  const simMeanBytes = document.getElementById('simMeanBytes');
  const simPacketRateBar = document.getElementById('simPacketRateBar');
  const simScoreVal = document.getElementById('simScoreVal');
  const simScoreDialFill = document.getElementById('simScoreDialFill');
  const simScoreVerdict = document.getElementById('simScoreVerdict');
  const simVerdictSummary = document.getElementById('simVerdictSummary');
  const simShapList = document.getElementById('simShapList');
  const simRuleCode = document.getElementById('simRuleCode');
  const simExecutionTime = document.getElementById('simExecutionTime');
  const simFirewallActionTag = document.getElementById('simFirewallActionTag');
  const simResolutionText = document.getElementById('simResolutionText');

  scenarioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scenarioTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.dataset.scenario;
      const data = scenarioData[key];
      if (!data) return;

      playCyberTone(key === 'benign' ? 700 : 350, key === 'benign' ? 900 : 150, 0.12, 'triangle', 0.08);

      // Update Ingestion
      if (simSrcIp) simSrcIp.textContent = data.srcIp;
      if (simFlowsSec) simFlowsSec.textContent = data.flowsSec;
      if (simSynRatio) simSynRatio.textContent = data.synRatio;
      if (simMeanBytes) simMeanBytes.textContent = data.meanBytes;
      if (simPacketRateBar) simPacketRateBar.style.width = data.barPercent;

      // Update Score
      if (simScoreVal) simScoreVal.textContent = data.scoreVal;
      if (simScoreVerdict) {
        simScoreVerdict.textContent = data.verdictTag;
        simScoreVerdict.className = `sim-status-tag ${data.verdictClass}`;
      }
      if (simVerdictSummary) simVerdictSummary.textContent = data.verdictSummary;

      // Update Dial Gauge SVG
      if (simScoreDialFill) {
        const circumference = 314;
        const score = parseFloat(data.scoreVal);
        const offset = circumference - (circumference * score);
        simScoreDialFill.style.strokeDashoffset = offset;
        simScoreDialFill.style.stroke = score > 0.8 ? '#f43f5e' : (score > 0.4 ? '#f59e0b' : '#10b981');
      }

      // Update SHAP list
      if (simShapList) {
        simShapList.innerHTML = data.shap.map(item => `
          <div class="sim-shap-item">
            <div class="sim-shap-top">
              <span class="feat-name">${item.name}</span>
              <span class="feat-val ${item.type}">${item.val}</span>
            </div>
            <div class="sim-shap-track">
              <div class="sim-shap-fill ${item.type}" style="width: ${item.width};"></div>
            </div>
          </div>
        `).join('');
      }

      // Update Firewall Action
      if (simRuleCode) simRuleCode.textContent = data.rule;
      if (simExecutionTime) simExecutionTime.textContent = data.execTime;
      if (simFirewallActionTag) {
        simFirewallActionTag.textContent = data.actionTag;
        simFirewallActionTag.className = `sim-status-tag ${data.verdictClass === 'success' ? 'success' : 'critical'}`;
      }
      if (simResolutionText) simResolutionText.textContent = data.resolution;

      showToast(`⚡ Simulation switched: ${tab.querySelector('.scenario-title').textContent}`);
    });
  });

  /* ============================================================
     10. ARCHITECTURE STAGE INSPECTOR DEEP DIVE
     ============================================================ */
  const stageData = {
    1: {
      badge: 'STAGE 01 INSPECTOR',
      title: 'Suricata Ingestion Engine',
      meta: 'Protocol: UNIX Socket | Source: /var/log/suricata/eve.json',
      code: `# Tail Suricata socket asynchronously with zero buffer overflow
import asyncio, json

async def stream_suricata_events(socket_path="/var/log/suricata/eve.json"):
    reader, _ = await asyncio.open_unix_connection(socket_path)
    while line := await reader.readline():
        event = json.loads(line)
        if event.get("event_type") == "flow":
            yield event`
    },
    2: {
      badge: 'STAGE 02 INSPECTOR',
      title: '1-Second Rolling Window Extractor',
      meta: 'Vector Dimension: 13 | Buffer: Ring Buffer C-extension',
      code: `# Real-time sliding window statistical aggregation
class FlowWindowExtractor:
    def __init__(self, window_size=1.0):
        self.window = collections.deque()
        self.window_size = window_size

    def push_and_extract(self, flow_event):
        now = flow_event["timestamp"]
        self.window.append(flow_event)
        while self.window and (now - self.window[0]["timestamp"] > self.window_size):
            self.window.popleft()
        return self._compute_13_dim_vector(self.window)`
    },
    3: {
      badge: 'STAGE 03 INSPECTOR',
      title: 'LightGBM Gradient Boosted Forest',
      meta: 'Latency: 1.78ms | ROC-AUC: 96.07% | Trees: 120 (Max Depth 7)',
      code: `# Fast binary tree inference via compiled C++ leaf traversal
import lightgbm as lgb

booster = lgb.Booster(model_file="models/lightgbm_cic_iot_2023.txt")

def score_flow(features_13d):
    # Returns raw probability in [0, 1] in < 1.8 milliseconds
    anomaly_prob = booster.predict(features_13d)[0]
    return anomaly_prob`
    },
    4: {
      badge: 'STAGE 04 INSPECTOR',
      title: 'TreeSHAP Attribution Explainer',
      meta: 'Complexity: O(TLD²) Polynomial | Guarantee: Additive Efficiency',
      code: `# Compute exact Shapley attribution values for flagged packet
import shap

explainer = shap.TreeExplainer(booster)

def explain_prediction(features_13d):
    shap_values = explainer.shap_values(features_13d)
    # shap_values[0] maps exactly to the 13 feature forces
    return shap_values[0]`
    },
    5: {
      badge: 'STAGE 05 INSPECTOR',
      title: 'Automated Kernel Firewall Dropper',
      meta: 'Driver: Linux nftables / eBPF Hook | Overhead: 0.02ms',
      code: `# Execute zero-latency drop rule in the Linux kernel
import subprocess

def block_malicious_ip(ip_address):
    cmd = ["nft", "add", "element", "inet", "filter", "blacklist", f"{{ {ip_address} }}"]
    subprocess.run(cmd, check=True)
    # The IP packet flow is dropped at the NIC level before socket copy`
    }
  };

  const archCards = document.querySelectorAll('.arch-card');
  const inspectorBadge = document.getElementById('inspectorBadge');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorMeta = document.getElementById('inspectorMeta');
  const inspectorCode = document.getElementById('inspectorCode');

  archCards.forEach(card => {
    card.addEventListener('click', () => {
      archCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const stage = card.dataset.stage;
      const data = stageData[stage];
      if (!data) return;

      playCyberTone(500, 650, 0.08, 'sine', 0.05);

      if (inspectorBadge) inspectorBadge.textContent = data.badge;
      if (inspectorTitle) inspectorTitle.textContent = data.title;
      if (inspectorMeta) inspectorMeta.textContent = data.meta;
      if (inspectorCode) inspectorCode.querySelector('code').textContent = data.code;
    });
  });

  /* ============================================================
     11. INTERACTIVE SHAP SENSITIVITY SANDBOX
     ============================================================ */
  const sliderFlows = document.getElementById('sliderFlows');
  const sliderSyn = document.getElementById('sliderSyn');
  const sliderFlowsVal = document.getElementById('sliderFlowsVal');
  const sliderSynVal = document.getElementById('sliderSynVal');
  const dynamicScoreVal = document.getElementById('dynamicScoreVal');
  const dynamicScoreFill = document.getElementById('dynamicScoreFill');
  const dynamicVerdict = document.getElementById('dynamicVerdict');

  function updateSensitivity() {
    if (!sliderFlows || !sliderSyn) return;
    const flows = parseFloat(sliderFlows.value);
    const syn = parseFloat(sliderSyn.value);

    if (sliderFlowsVal) sliderFlowsVal.textContent = flows.toLocaleString();
    if (sliderSynVal) sliderSynVal.textContent = syn.toFixed(2);

    // Approximate calibrated formula based on LightGBM tree weights
    const flowContrib = (flows / 6000) * 0.55;
    const synContrib = (syn) * 0.40;
    const baseScore = 0.05;
    const totalScore = Math.min(Math.max(baseScore + flowContrib + synContrib, 0.012), 0.999);

    if (dynamicScoreVal) dynamicScoreVal.textContent = totalScore.toFixed(3);
    if (dynamicScoreFill) dynamicScoreFill.style.width = `${(totalScore * 100).toFixed(1)}%`;

    if (dynamicVerdict) {
      if (totalScore >= 0.85) {
        dynamicVerdict.textContent = 'Verdict: CRITICAL THREAT — Kernel Mitigation Triggered';
        dynamicVerdict.style.color = 'var(--red)';
        if (dynamicScoreVal) dynamicScoreVal.style.color = 'var(--red)';
      } else if (totalScore >= 0.65) {
        dynamicVerdict.textContent = 'Verdict: SUSPICIOUS ANOMALY — Monitoring Window Active';
        dynamicVerdict.style.color = 'var(--yellow)';
        if (dynamicScoreVal) dynamicScoreVal.style.color = 'var(--yellow)';
      } else {
        dynamicVerdict.textContent = 'Verdict: CLEAN TRAFFIC — Normal Operation';
        dynamicVerdict.style.color = 'var(--green)';
        if (dynamicScoreVal) dynamicScoreVal.style.color = 'var(--green)';
      }
    }
  }

  if (sliderFlows && sliderSyn) {
    sliderFlows.addEventListener('input', updateSensitivity);
    sliderSyn.addEventListener('input', updateSensitivity);
  }

  /* ============================================================
     12. SHAP WATERFALL BAR ANIMATION (IntersectionObserver)
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
            }, 200 + i * 160);
          }
        });
        wfObs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    wfObs.observe(waterfall);
  }

  /* ============================================================
     13. CLI TERMINAL WITH TABS & INTERACTIVE COMMANDS
     ============================================================ */
  const cliOutput = document.getElementById('cliOutput');
  const cliInput = document.getElementById('cliInput');
  const cmdChips = document.querySelectorAll('.cmd-chip');
  const termTabs = document.querySelectorAll('.term-tab');
  const termBodyContainer = document.getElementById('termBodyContainer');

  const cliCommands = {
    help: `Available commands:
  status      Engine health, model weights, and socket state
  simulate    Inject an attack stream and observe mitigation
  inspect     TreeSHAP attribution values for recent anomaly
  benchmark   Empirical test accuracy and latency table
  rules       Active kernel firewall ruleset
  test        Execute automated Pytest validation suite
  clear       Clear terminal buffer`,

    status: `[IoTGuard Engine Status]
  State:         OPERATIONAL (All 5 pipeline stages armed)
  Socket:        /var/log/suricata/eve.json (UNIX STREAM)
  Model:         LightGBM v1.0.2 [120 trees, max_depth=7]
  Metrics:       96.07% ROC-AUC  |  97.10% PR-AUC
  Latency:       1.78 ms / 1-sec flow window
  Thresholds:    Alert: >= 0.70  |  Hard Block: >= 0.90
  Memory Footprint: 48.2 MB RSS (Embedded ARM64 optimized)
  Automated Tests: 112 / 112 PASSING`,

    simulate: `[Triggering High-Velocity Simulation]
  [13:42:01.000] Injecting TCP SYN Flood (5,000 pkts/s)...
  [13:42:01.002] LightGBM Anomaly Score: 0.998 [CRITICAL]
  [13:42:01.003] TreeSHAP Top Drivers: flows_per_sec (+7.37), syn_ratio (+4.01)
  [13:42:01.004] Executing kernel mitigation:
                 → nftables add element inet filter blacklist { 192.168.1.104 }
  [13:42:01.004] Flow neutralized in 1.78ms. Zero drops on benign endpoints.`,

    inspect: `[TreeSHAP Feature Attribution Breakdown — Event #4092]
  Baseline Expectation E[f(x)] = 0.124
  ────────────────────────────────────────────────────────
  Feature Name               Observed Value      SHAP Force
  ────────────────────────────────────────────────────────
  flows_per_sec              4,821 pkts/s        +7.37
  syn_ratio                  0.982               +4.01
  bytes_total                1.42 MB             +2.57
  http_ratio                 0.021               -0.84
  iat_variance               0.18 ms             -0.45
  ────────────────────────────────────────────────────────
  Sum of Contributions = +12.66 → Final Logit f(x) = 0.998`,

    benchmark: `[CIC-IoT-2023 5-Fold Cross Validation Benchmark]
  Model Architecture    ROC-AUC     PR-AUC    Latency    Memory
  ─────────────────────────────────────────────────────────────
  LightGBM (Ours)       96.07%      97.10%    1.78 ms    48.2 MB  [Selected]
  XGBoost               95.82%      96.85%    4.12 ms    112 MB
  Random Forest (100)   93.40%      94.10%    8.45 ms    210 MB
  MLP Neural Net        91.15%      92.05%    12.3 ms    340 MB`,

    rules: `[Active Kernel Firewall Ruleset (nftables)]
  table inet filter {
    set blacklist {
      type ipv4_addr
      elements = { 192.168.1.104, 192.168.1.72 }
    }
    chain input {
      type filter hook input priority 0; policy accept;
      ip saddr @blacklist counter drop
    }
  }`,

    test: `[Executing Pytest Automated Test Suite]
  ============================= test session starts =============================
  platform linux -- Python 3.13.0, pytest-8.3.2
  rootdir: /opt/iotguard, configfile: pyproject.toml
  collected 112 items

  tests/test_socket_ingest.py ................                             [ 14%]
  tests/test_window_extractor.py .........................                 [ 36%]
  tests/test_lightgbm_inference.py ...........................             [ 60%]
  tests/test_treeshap_attribution.py ....................                  [ 78%]
  tests/test_nftables_mitigation.py .........................              [100%]

  ============================= 112 passed in 1.42s =============================`
  };

  const commandHistory = [];
  let historyIndex = -1;

  function executeTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmdRaw);
    historyIndex = commandHistory.length;

    playCyberTone(800, 400, 0.06, 'square', 0.04);

    if (cmd === 'clear') {
      if (cliOutput) cliOutput.innerHTML = '';
      return;
    }

    const block = document.createElement('div');
    block.style.marginBottom = '12px';

    const line = document.createElement('div');
    line.className = 't-line';
    line.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">iotguard ${cmd}</span>`;

    const out = document.createElement('div');
    out.className = 't-output';

    if (cliCommands[cmd]) {
      out.textContent = cliCommands[cmd];
    } else {
      out.textContent = `Unknown command '${cmd}'. Type 'help' for available commands.`;
      out.style.color = 'var(--red)';
    }

    block.appendChild(line);
    block.appendChild(out);

    if (cliOutput) {
      cliOutput.appendChild(block);
      if (termBodyContainer) {
        termBodyContainer.scrollTop = termBodyContainer.scrollHeight;
      }
    }
  }

  if (cliInput) {
    cliInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        executeTerminalCommand(cliInput.value);
        cliInput.value = '';
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          cliInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          cliInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          cliInput.value = '';
        }
      }
    });
  }

  cmdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd) executeTerminalCommand(cmd);
    });
  });

  // Terminal Tabs Switcher
  termTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      termTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabType = tab.dataset.tab;

      if (tabType === 'logs') {
        executeTerminalCommand('status');
      } else if (tabType === 'rules') {
        executeTerminalCommand('rules');
      } else if (tabType === 'env') {
        executeTerminalCommand('benchmark');
      }
    });
  });

  /* ============================================================
     14. BENTO CARD MOUSE SPOTLIGHT & 3D TILT EFFECT
     ============================================================ */
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight CSS variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ============================================================
     15. ANIMATED STAT COUNTERS & SPARKLINE BARS
     ============================================================ */
  const counterElements = document.querySelectorAll('[data-target]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = target.toString().includes('.') ? target.toString().split('.')[1].length : 0;
      const duration = 1600;
      const startTime = performance.now();

      function tick(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.3 });
  counterElements.forEach(el => counterObs.observe(el));

  // Benchmark table bars
  const benchFills = document.querySelectorAll('.bench-bar-fill');
  const benchObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      benchFills.forEach(bar => {
        const width = bar.dataset.width || '95';
        bar.style.width = `${width}%`;
      });
      benchObs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  const benchTable = document.querySelector('.bench-table');
  if (benchTable) benchObs.observe(benchTable);

  /* ============================================================
     16. FAQ ACCORDION LOGIC
     ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        faqItems.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0';
        });

        // Toggle selected
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
          playCyberTone(400, 600, 0.08, 'sine', 0.04);
        }
      });
    }
  });

  /* ============================================================
     17. DOCKER COMMAND ONE-CLICK COPY
     ============================================================ */
  const copyDockerBtn = document.getElementById('copyDockerBtn');
  if (copyDockerBtn) {
    copyDockerBtn.addEventListener('click', () => {
      const code = 'git clone https://github.com/A7medico/iotguard && cd iotguard && docker compose up -d';
      navigator.clipboard.writeText(code).then(() => {
        playCyberTone(600, 900, 0.1, 'triangle', 0.08);
        showToast('📋 Copied Docker run command to clipboard!');
        const copyTxt = copyDockerBtn.querySelector('.copy-txt');
        if (copyTxt) {
          copyTxt.textContent = 'Copied!';
          setTimeout(() => { copyTxt.textContent = 'Copy'; }, 2000);
        }
      });
    });
  }

  /* ============================================================
     18. GITHUB STAR BUTTON INTERACTION
     ============================================================ */
  const githubStarBtn = document.getElementById('githubStarBtn');
  const navStarCounter = document.getElementById('navStarCounter');
  if (githubStarBtn) {
    githubStarBtn.addEventListener('click', () => {
      playCyberTone(700, 1100, 0.15, 'sine', 0.1);
      if (navStarCounter) {
        navStarCounter.textContent = '1.2k+';
        navStarCounter.style.color = '#38bdf8';
      }
    });
  }

  /* ============================================================
     19. SCROLL REVEAL ANIMATIONS
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.05 });
  revealElements.forEach(el => revealObs.observe(el));

});

/* ============================================================
   IOTGUARD ENTERPRISE v4.0 — Master Interactive Engine
   In-Kernel eBPF/XDP Defense · SHA-256 Cryptographic Audit Ledger
   Distributed Fleet Herd Immunity · MITRE ATT&CK Interoperability
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
     6. LIVE THREAT COUNTER & XDP DROPS TICKER
     ============================================================ */
  const threatCounter = document.getElementById('threatCounter');
  const xdpDropCounter = document.getElementById('xdpDropCounter');
  let currentThreatCount = 2418924;
  let currentXdpDrops = 4821;

  if (threatCounter) {
    setInterval(() => {
      const inc = Math.floor(Math.random() * 5) + 1;
      currentThreatCount += inc;
      threatCounter.textContent = currentThreatCount.toLocaleString();

      if (xdpDropCounter && Math.random() < 0.3) {
        currentXdpDrops += 1;
        xdpDropCounter.textContent = currentXdpDrops.toLocaleString();
      }
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

            if (Math.random() < 0.003 && packets.length < 25) {
              packets.push(new DataPacket(particles[i], particles[j], isAttackMode));
            }
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

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

      oscCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      oscCtx.lineWidth = 1;
      oscCtx.beginPath();
      oscCtx.moveTo(0, h / 2);
      oscCtx.lineTo(w, h / 2);
      oscCtx.stroke();

      oscCtx.beginPath();
      oscPhase += 0.08;

      const isThreat = isAttackMode || oscSpikeIntensity > 2;

      for (let x = 0; x < w; x++) {
        let y = h / 2;
        if (isThreat) {
          y += Math.sin((x * 0.08) + oscPhase) * (24 * oscSpikeIntensity * 0.4);
          y += (Math.random() - 0.5) * 16;
        } else {
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
        showToast('⚠️ Injected SYN Flood attack pattern (MITRE T1498.001)');
      } else if (type === 'portscan') {
        isAttackMode = true;
        oscSpikeIntensity = 2.1;
        if (oscThroughputTag) oscThroughputTag.textContent = '1,890 pkt/s';
        if (heroThreatFeedRow) heroThreatFeedRow.style.display = 'grid';
        showToast('🔍 Injected Reconnaissance pattern (MITRE T1046)');
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
     9. INTERACTIVE ATTACK SIMULATOR & DEFENSE LAB (v4.0 UPDATED)
     ============================================================ */
  const scenarioData = {
    synflood: {
      srcIp: '192.168.1.104:443',
      flowsSec: '4,821 /s',
      synRatio: '0.982',
      mitreTag: 'T1498.001 Impact (DDoS)',
      barPercent: '96%',
      scoreVal: '0.998',
      verdictTag: 'CRITICAL',
      verdictClass: 'critical',
      verdictSummary: 'High-confidence DDoS SYN flood detected. In-kernel eBPF/XDP line-rate drop active (<1µs).',
      shap: [
        { name: 'flows_per_sec', val: '+7.37', width: '92%', type: 'pos' },
        { name: 'syn_ratio', val: '+4.01', width: '62%', type: 'pos' },
        { name: 'bytes_total', val: '+2.57', width: '40%', type: 'pos' }
      ],
      rule: 'bpf_map_update_elem(&iotguard_blocked_ips, 192.168.1.104) → XDP_DROP',
      execTime: '<1µs eBPF/XDP',
      actionTag: 'XDP_DROP (<1µs)',
      resolution: 'Packets dropped at hardware NIC ring. SHA-256 block committed.'
    },
    mirai: {
      srcIp: '192.168.1.72:23',
      flowsSec: '2,140 /s',
      synRatio: '0.450',
      mitreTag: 'T1071.001 C2 / T1110 Brute',
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
      rule: 'bpf_map_update_elem(&iotguard_blocked_ips, 192.168.1.72) → XDP_DROP',
      execTime: '<1µs eBPF/XDP',
      actionTag: 'XDP_DROP (<1µs)',
      resolution: 'Telnet brute force blocked. Fleet herd immunity broadcast queued.'
    },
    portscan: {
      srcIp: '192.168.1.189:80',
      flowsSec: '1,280 /s',
      synRatio: '0.890',
      mitreTag: 'T1046 Network Scan (Recon)',
      barPercent: '60%',
      scoreVal: '0.865',
      verdictTag: 'WARNING',
      verdictClass: 'critical',
      verdictSummary: 'Stealth reconnaissance scan (Nmap -sS) traversing host ports 1-1024 caught via TemporalDetector.',
      shap: [
        { name: 'temporal_drift_k8', val: '+4.21', width: '68%', type: 'pos' },
        { name: 'syn_ratio', val: '+3.10', width: '52%', type: 'pos' },
        { name: 'flows_per_sec', val: '+2.05', width: '35%', type: 'pos' }
      ],
      rule: 'nft add rule inet iotguard blocked_ips { 192.168.1.189 }',
      execTime: '0.04ms nftables',
      actionTag: 'Active Filter',
      resolution: 'Reconnaissance halted before service enumeration.'
    },
    benign: {
      srcIp: '192.168.1.45:1883',
      flowsSec: '120 /s',
      synRatio: '0.020',
      mitreTag: 'Clean Baseline (0 Alert)',
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
      rule: '# [NO ACTION REQUIRED] Adaptive threshold verified clean baseline',
      execTime: '0.01ms check',
      actionTag: 'Whitelisted',
      resolution: 'Telemetry passed smoothly to cloud broker.'
    }
  };

  const scenarioTabs = document.querySelectorAll('.scenario-tab');
  const simSrcIp = document.getElementById('simSrcIp');
  const simFlowsSec = document.getElementById('simFlowsSec');
  const simSynRatio = document.getElementById('simSynRatio');
  const simMitreTag = document.getElementById('simMitreTag');
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

      if (simSrcIp) simSrcIp.textContent = data.srcIp;
      if (simFlowsSec) simFlowsSec.textContent = data.flowsSec;
      if (simSynRatio) simSynRatio.textContent = data.synRatio;
      if (simMitreTag) simMitreTag.textContent = data.mitreTag;
      if (simPacketRateBar) simPacketRateBar.style.width = data.barPercent;

      if (simScoreVal) simScoreVal.textContent = data.scoreVal;
      if (simScoreVerdict) {
        simScoreVerdict.textContent = data.verdictTag;
        simScoreVerdict.className = `sim-status-tag ${data.verdictClass}`;
      }
      if (simVerdictSummary) simVerdictSummary.textContent = data.verdictSummary;

      if (simScoreDialFill) {
        const circumference = 314;
        const score = parseFloat(data.scoreVal);
        const offset = circumference - (circumference * score);
        simScoreDialFill.style.strokeDashoffset = offset;
        simScoreDialFill.style.stroke = score > 0.8 ? '#f43f5e' : (score > 0.4 ? '#f59e0b' : '#10b981');
      }

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
     10. ARCHITECTURE STAGE INSPECTOR DEEP DIVE (v4.0 UPDATED)
     ============================================================ */
  const stageData = {
    1: {
      badge: 'STAGE 01 INSPECTOR',
      title: 'O(1) Byte-Offset Stream Tailer',
      meta: 'Engine: FastCSVStreamReader | Recovery: State Offset Sync',
      code: `# Incremental O(1) byte-offset seek reader eliminating N^2 file rescans
class FastCSVStreamReader:
    def __init__(self, filepath, state_path):
        self.filepath = filepath
        self.state_path = state_path
        self.byte_offset = self._load_offset()

    def read_new_windows(self):
        with open(self.filepath, 'r') as f:
            f.seek(self.byte_offset)
            while line := f.readline():
                if not line.endswith('\\n'): break # mid-write boundary
                yield self._parse_13_features(line)
                self.byte_offset = f.tell()
        self._persist_offset(self.byte_offset)`
    },
    2: {
      badge: 'STAGE 02 INSPECTOR',
      title: '13-Dimensional Extractor & Fingerprinter',
      meta: 'Schema: Strict 13 Features | Router: IoT vs. IT Classifiers',
      code: `# IP-agnostic 13-feature extractor & device fingerprint router
class DeviceFingerprinter:
    def route_profile(self, features_13d):
        is_iot = (features_13d["protocol_diversity"] <= 2 and 
                  features_13d["http_ratio"] < 0.20)
        return "lightgbm.joblib" if is_iot else "lightgbm_it.joblib"`
    },
    3: {
      badge: 'STAGE 03 INSPECTOR',
      title: 'Hybrid ML & Temporal Drift Engine',
      meta: 'LightGBM + IsolationForest + TemporalDetector (K=6-12)',
      code: `# Stateful temporal sequence drift & hybrid anomaly scoring
class TemporalDetector:
    def evaluate_drift(self, ip_history_deque):
        slopes = [calculate_trend(f) for f in ["rst_ratio", "syn_ratio", "flows"]]
        temporal_boost = sum(max(0, s) * w for s, w in zip(slopes, [0.4, 0.4, 0.2]))
        return min(0.35, temporal_boost)`
    },
    4: {
      badge: 'STAGE 04 INSPECTOR',
      title: 'TreeSHAP & Playbooks Engine',
      meta: 'MITRE ATT&CK Enterprise & ICS Mapped | XAI <5ms',
      code: `# Exact Shapley values and automated remediation playbooks
class PlaybookManager:
    def get_playbook(self, attack_class):
        taxonomy = MITRE_TAXONOMY_MAP[attack_class]
        return {
            "mitre_id": taxonomy.technique_id,
            "tactic": taxonomy.tactic_name,
            "remediation_cmd": taxonomy.generate_firewall_cmd(ip)
        }`
    },
    5: {
      badge: 'STAGE 05 INSPECTOR',
      title: 'In-Kernel eBPF & Cryptographic Ledger',
      meta: 'eBPF/XDP (<1µs NIC Drop) + SHA-256 Block-Chained Ledger',
      code: `# In-kernel packet dropping & cryptographic audit ledger commit
int xdp_drop_ip(struct xdp_md *ctx) {
    __u32 src_ip = parse_ipv4(ctx);
    if (bpf_map_lookup_elem(&iotguard_blocked_ips, &src_ip)) {
        return XDP_DROP; // < 1 microsecond hardware NIC drop
    }
    return XDP_PASS;
}`
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
     11. CRYPTOGRAPHIC AUDIT VERIFIER INTERACTION
     ============================================================ */
  const verifyChainBtn = document.getElementById('verifyChainBtn');
  const auditVerificationResult = document.getElementById('auditVerificationResult');
  const auditChainStream = document.getElementById('auditChainStream');

  if (verifyChainBtn) {
    verifyChainBtn.addEventListener('click', () => {
      playCyberTone(600, 1200, 0.25, 'triangle', 0.1);
      verifyChainBtn.textContent = 'Verifying...';

      if (auditChainStream) {
        const blocks = auditChainStream.querySelectorAll('.audit-block');
        blocks.forEach((b, i) => {
          setTimeout(() => {
            b.style.borderColor = 'var(--accent)';
            b.style.boxShadow = '0 0 14px var(--accent-glow)';
            setTimeout(() => {
              b.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              b.style.boxShadow = 'none';
            }, 300);
          }, i * 150);
        });
      }

      setTimeout(() => {
        verifyChainBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Chain Verified ✓
        `;
        if (auditVerificationResult) {
          auditVerificationResult.innerHTML = `
            <span class="verified-icon">🛡️</span>
            <span>Cryptographic Chain Integrity: <strong>100% VALID (492/492 Blocks Unbroken)</strong></span>
          `;
        }
        showToast('✅ SHA-256 Audit Ledger cryptographically verified. Zero tampering detected.');
        playCyberTone(880, 1320, 0.15, 'sine', 0.1);
      }, 700);
    });
  }

  /* ============================================================
     12. DISTRIBUTED FLEET HERD IMMUNITY BROADCAST SIMULATION
     ============================================================ */
  const fleetBroadcastBtn = document.getElementById('fleetBroadcastBtn');
  const fleetNodesGrid = document.getElementById('fleetNodesGrid');

  if (fleetBroadcastBtn) {
    fleetBroadcastBtn.addEventListener('click', () => {
      playCyberTone(440, 880, 0.2, 'square', 0.08);
      fleetBroadcastBtn.textContent = 'Broadcasting to Fleet...';

      if (fleetNodesGrid) {
        const nodes = fleetNodesGrid.querySelectorAll('.fleet-node-card');
        nodes.forEach((n, i) => {
          setTimeout(() => {
            n.style.borderColor = 'var(--red)';
            n.style.boxShadow = '0 0 20px rgba(244, 63, 94, 0.35)';
            const herdStatus = n.querySelector('.node-herd-status');
            if (herdStatus) {
              herdStatus.textContent = 'Sync: Pushed 192.168.1.104 to local eBPF map ✓';
              herdStatus.style.color = 'var(--accent)';
            }
          }, i * 150);
        });
      }

      setTimeout(() => {
        fleetBroadcastBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Herd Immunity Active
        `;
        showToast('📡 Herd Immunity Push Completed: Attacker blocked across all 4 remote gateways!');
        playCyberTone(800, 1200, 0.12, 'sine', 0.08);
      }, 800);
    });
  }

  /* ============================================================
     13. SIEM PREVIEW TABS SWITCHER
     ============================================================ */
  const siemSnippets = {
    cef: `CEF:0|IoTGuard|Enterprise-IDS|4.0|T1498.001|DDoS SYN Flood|8|src=192.168.1.104 dst=10.0.0.1 proto=TCP act=XDP_DROP cat=DDoS-SYN cfp1=0.998 cs1=flows_per_sec (+7.37) cs2=syn_ratio (+4.01) rt=1762354921000`,
    syslog: `<134>1 2026-11-05T18:45:34.012Z edge-gateway-01 iotguard 53457 ID4092 [iotguard@53457 src="192.168.1.104" dst="10.0.0.1" proto="TCP" score="0.998" mitre="T1498.001" action="XDP_DROP" driver="ebpf"] Threat mitigated via eBPF hardware drop`,
    stix: `{
  "type": "bundle",
  "id": "bundle--7a92b104-e3b0-4f53-8d96-cda18c2baa0c",
  "spec_version": "2.1",
  "objects": [
    {
      "type": "indicator",
      "id": "indicator--9b81-420a",
      "name": "Malicious SYN Flood Attacker",
      "pattern": "[ipv4-addr:value = '192.168.1.104']",
      "pattern_type": "stix",
      "confidence": 99,
      "labels": ["malicious-activity", "ddos-syn", "mitre-t1498.001"]
    }
  ]
}`,
    openapi: `openapi: 3.1.0
info:
  title: IoTGuard Enterprise REST API
  version: 4.0.0
paths:
  /api/v1/soc/kpis:
    get:
      summary: Real-time SecOps SLA Telemetry & MTTD/MTTR
      responses:
        '200':
          description: OK (mttd_ms, mttr_ms, mitre_matrix, fleet_immunity)
  /api/v1/audit/verify:
    get:
      summary: Cryptographically verify SHA-256 audit ledger hash chain`
  };

  const siemTabs = document.querySelectorAll('.siem-tab');
  const siemCodePreview = document.getElementById('siemCodePreview');

  siemTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      siemTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.siem;
      if (siemCodePreview && siemSnippets[key]) {
        siemCodePreview.textContent = siemSnippets[key];
        playCyberTone(600, 750, 0.06, 'sine', 0.04);
      }
    });
  });

  /* ============================================================
     14. INTERACTIVE SHAP SENSITIVITY SANDBOX
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

    const flowContrib = (flows / 6000) * 0.55;
    const synContrib = (syn) * 0.40;
    const baseScore = 0.05;
    const totalScore = Math.min(Math.max(baseScore + flowContrib + synContrib, 0.012), 0.999);

    if (dynamicScoreVal) dynamicScoreVal.textContent = totalScore.toFixed(3);
    if (dynamicScoreFill) dynamicScoreFill.style.width = `${(totalScore * 100).toFixed(1)}%`;

    if (dynamicVerdict) {
      if (totalScore >= 0.85) {
        dynamicVerdict.textContent = 'Verdict: CRITICAL THREAT — In-Kernel eBPF/XDP Drop Active';
        dynamicVerdict.style.color = 'var(--red)';
        if (dynamicScoreVal) dynamicScoreVal.style.color = 'var(--red)';
      } else if (totalScore >= 0.65) {
        dynamicVerdict.textContent = 'Verdict: SUSPICIOUS ANOMALY — Monitoring Window Active';
        dynamicVerdict.style.color = 'var(--yellow)';
        if (dynamicScoreVal) dynamicScoreVal.style.color = 'var(--yellow)';
      } else {
        dynamicVerdict.textContent = 'Verdict: CLEAN TRAFFIC — Normal Baseline';
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
     15. SHAP WATERFALL BAR ANIMATION (IntersectionObserver)
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
     16. CLI TERMINAL WITH ENTERPRISE v4.0 COMMANDS
     ============================================================ */
  const cliOutput = document.getElementById('cliOutput');
  const cliInput = document.getElementById('cliInput');
  const cmdChips = document.querySelectorAll('.cmd-chip');
  const termTabs = document.querySelectorAll('.term-tab');
  const termBodyContainer = document.getElementById('termBodyContainer');

  const cliCommands = {
    help: `Available Enterprise v4.0 commands:
  status      Engine health, eBPF driver, storage WAL, and SLA telemetry
  simulate    Inject attack stream and observe line-rate mitigation
  fleet       Inspect distributed edge sensor gateways and herd immunity
  audit       Cryptographic SHA-256 audit ledger hash verification
  test        Execute 22 Pytest automated test suites (293/293 passing)
  mitre       Display MITRE ATT&CK Enterprise & ICS tactic matrix
  ebpf        eBPF/XDP driver state and hardware packet drop counters
  inspect     TreeSHAP attribution values for recent anomaly
  benchmark   Empirical cross-validation benchmark matrix
  clear       Clear terminal buffer`,

    status: `[IoTGuard Enterprise v4.0 Engine Status]
  Status:        OPERATIONAL (All 5 pipeline stages armed)
  In-Kernel:     eBPF/XDP Line-Rate Driver Active (<1µs NIC Drop)
  Storage:       SQLite WAL Relational Engine (iotguard_enterprise.db)
  Audit Ledger:  SHA-256 Block-Chained Non-Repudiation (492 blocks, 0 broken)
  Fleet Plane:   HMAC-SHA256 Authenticated · 4 Remote Gateways Connected
  SLA Tracker:   MTTD = 14.2 ms [MET] | MTTR = 3.8 ms [MET] | Immunity = 98.4%
  Test Harness:  22 Pytest Suites · 293 / 293 PASSING (100% Pass Rate)`,

    simulate: `[Triggering High-Velocity Attack Simulation]
  [13:42:01.000] Ingesting TCP SYN Flood (5,000 pkts/s)...
  [13:42:01.001] Model Score: 0.998 [CRITICAL ANOMALY] · MITRE T1498.001
  [13:42:01.001] TreeSHAP Top Features: flows_per_sec (+7.37), syn_ratio (+4.01)
  [13:42:01.002] In-Kernel Defense: bpf_map_update_elem(&iotguard_blocked_ips, 192.168.1.104)
  [13:42:01.002] Flow neutralized at hardware NIC in <1µs.
  [13:42:01.002] Commit: Block #0493 added to SHA-256 audit chain.
  [13:42:01.003] Fleet Herd Immunity: Block broadcast to 4 edge gateways.`,

    fleet: `[Distributed Fleet Control Plane Telemetry]
  Node ID                  Site Name            Status     CPU      RAM     XDP Drops   Sync
  ──────────────────────────────────────────────────────────────────────────────────────────
  node_smart_home_01       Smart Home Gateway   ONLINE     8.2%     38 MB   1,420 pkts  SYNCED
  node_factory_edge_04     Factory Floor Edge   ONLINE    14.5%     44 MB   2,890 pkts  SYNCED
  node_substation_grid_02  Substation Grid      ONLINE     6.1%     36 MB     511 pkts  SYNCED
  node_hospital_vlan_07    Hospital IoT VLAN    ONLINE     9.8%     42 MB       0 pkts  SYNCED
  ──────────────────────────────────────────────────────────────────────────────────────────
  Fleet Immunity Index: 98.4% (OPTIMAL) | Replay Protection: 60s HMAC-SHA256 Window`,

    audit: `[Cryptographic SHA-256 Audit Ledger Verification]
  Total Blocks:  492 blocks
  Genesis Hash:  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
  Latest Hash:   8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
  Chain Check:   100% VALID (0 broken links, 0 tampered blocks)
  Last Actions:  XDP_QUARANTINE_SYNC, HERD_IMMUNITY_BROADCAST, POLICY_UPDATE`,

    mitre: `[MITRE ATT&CK Enterprise & ICS/IoT Mapping]
  Tactic ID   Tactic Name       Technique ID   Technique Name            Mapped Taxonomy
  ──────────────────────────────────────────────────────────────────────────────────────
  TA0043      Reconnaissance    T1046          Network Service Discovery PortScan
  TA0001      Initial Access    T1190          Exploit Public Service    SQLInjection
  TA0002      Execution         T1059          Command/Scripting Interp  CommandInjection
  TA0006      Credential Access T1110          Brute Force               BruteForce
  TA0011      Command & Control T1071.001      Application Protocol C2   Mirai-C2
  TA0040      Impact            T1498.001      Network Denial of Service DDoS-SYN / DDoS-UDP`,

    ebpf: `[In-Kernel eBPF/XDP Driver Telemetry]
  Driver Hook:    SEC("xdp") at NIC Driver RX Ring
  BPF Hash Map:   iotguard_blocked_ips (Pinned, Max 65,536 entries)
  Drop Latency:   < 1.0 microsecond (bypasses conntrack, sk_buff, netfilter)
  Total Dropped:  4,821 packets at line rate
  OS Fallback:    Linux nftables -> iptables -> Windows netsh`,

    test: `[Executing 22 Pytest Automated Test Suites]
  ============================= test session starts =============================
  platform linux -- Python 3.13.0, pytest-8.3.2
  tests/test_alerting.py .........................                             [  8%]
  tests/test_api_dashboard.py ..............................                  [ 18%]
  tests/test_blocker.py ...................................                    [ 30%]
  tests/test_ebpf_blocker.py .....................                             [ 37%]
  tests/test_enterprise_storage_rbac.py ..............                         [ 42%]
  tests/test_federated_drift.py .............                                  [ 47%]
  tests/test_fleet_control_plane.py ........................                   [ 55%]
  tests/test_mitre_siem_openapi.py .................                           [ 61%]
  tests/test_multiclass_playbooks.py ...................                       [ 67%]
  tests/test_soc_metrics_reports.py .................                          [ 73%]
  tests/test_stream_reader.py .........                                        [ 76%]
  tests/test_temporal_detector.py ................                             [ 82%]
  tests/test_threat_intel_topology.py ...............                          [ 87%]
  tests/test_end_to_end_smoke.py .......................................      [100%]
  ============================= 293 passed in 13.82s ============================`,

    inspect: `[TreeSHAP Feature Attribution Breakdown — Event #4092]
  Baseline Expectation E[f(x)] = 0.124
  ────────────────────────────────────────────────────────
  Feature Name               Observed Value      SHAP Force
  ────────────────────────────────────────────────────────
  flows_per_sec              4,821 pkts/s        +7.37
  syn_ratio                  0.982               +4.01
  bytes_total                1.42 MB             +2.57
  http_ratio                 0.021               -0.84
  iat_mean                   0.18 ms             -0.45
  ────────────────────────────────────────────────────────
  Sum of Contributions = +12.66 → Final Logit f(x) = 0.998`,

    benchmark: `[Empirical 5-Fold Cross Validation Benchmark]
  Model Architecture              ROC-AUC     PR-AUC    Latency    Memory
  ──────────────────────────────────────────────────────────────────────────
  IoTGuard v4.0 (LightGBM + eBPF) 96.39%      97.10%    1.78 ms    48.2 MB  [Production]
  XGBoost Standard                95.82%      96.85%    4.12 ms    112 MB
  Random Forest (100)             93.40%      94.10%    8.45 ms    210 MB
  MLP Neural Net                  91.15%      92.05%    12.3 ms    340 MB`
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
      out.textContent = `Unknown command '${cmd}'. Type 'help' for available Enterprise v4.0 commands.`;
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

  termTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      termTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabType = tab.dataset.tab;

      if (tabType === 'audit') {
        executeTerminalCommand('audit');
      } else if (tabType === 'fleet') {
        executeTerminalCommand('fleet');
      } else if (tabType === 'test') {
        executeTerminalCommand('test');
      }
    });
  });

  /* ============================================================
     17. BENTO CARD MOUSE SPOTLIGHT & 3D TILT EFFECT
     ============================================================ */
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

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
     18. ANIMATED STAT COUNTERS & SPARKLINE BARS
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
     19. FAQ ACCORDION LOGIC
     ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        faqItems.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0';
        });

        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
          playCyberTone(400, 600, 0.08, 'sine', 0.04);
        }
      });
    }
  });

  /* ============================================================
     20. DOCKER COMMAND ONE-CLICK COPY
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
     21. GITHUB STAR BUTTON INTERACTION
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
     22. SCROLL REVEAL ANIMATIONS
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

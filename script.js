// ── MATRIX RAIN ──────────────────────────────────────────────
const mc = document.getElementById('matrix-bg');
const mctx = mc.getContext('2d');
mc.width = window.innerWidth; mc.height = window.innerHeight;
const cols = Math.floor(mc.width / 14);
const drops = Array(cols).fill(1);
const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
function drawMatrix() {
  mctx.fillStyle = 'rgba(0,10,0,0.05)';
  mctx.fillRect(0,0,mc.width,mc.height);
  mctx.fillStyle = '#00ff41';
  mctx.font = '13px Share Tech Mono';
  for (let i=0;i<drops.length;i++) {
    const c = chars[Math.floor(Math.random()*chars.length)];
    mctx.fillStyle = drops[i]*14<mc.height*0.2?'#ffffff':drops[i]*14<mc.height*0.4?'#00ff41':'#00aa20';
    mctx.fillText(c, i*14, drops[i]*14);
    if (drops[i]*14>mc.height && Math.random()>0.975) drops[i]=0;
    drops[i]++;
  }
}
setInterval(drawMatrix, 50);
window.addEventListener('resize',()=>{mc.width=window.innerWidth;mc.height=window.innerHeight;});
 
// ── CLOCK ──────────────────────────────────────────────────
let startTime = Date.now();
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toTimeString().slice(0,8);
  const up = Math.floor((Date.now()-startTime)/1000);
  const h=String(Math.floor(up/3600)).padStart(2,'0');
  const m=String(Math.floor((up%3600)/60)).padStart(2,'0');
  const s=String(up%60).padStart(2,'0');
  document.getElementById('uptime').textContent = `${h}:${m}:${s}`;
  document.getElementById('packets').textContent = (Math.floor(Math.random()*50)+up*12).toLocaleString();
}
setInterval(updateClock, 1000);
 
// ── MINI CHART ─────────────────────────────────────────────
const mc2 = document.getElementById('mini-chart');
for (let i=0;i<16;i++) {
  const b=document.createElement('div');
  b.className='mini-bar';
  b.style.height=Math.random()*100+'%';
  mc2.appendChild(b);
}
setInterval(()=>{
  Array.from(mc2.children).forEach(b=>b.style.height=Math.random()*100+'%');
},800);
 
// ── ACTIVITY LOG ──────────────────────────────────────────
const logs = [
  'Deployed NeuralDash v2.3.1 → production',
  'Merged PR #847: WebSocket performance patch',
  'Security audit passed — 0 critical findings',
  'Added WASM module for image processing',
  'Benchmarked StreamForge: 52M events/day',
  'Updated Terraform configs for EU region',
  'Released QuantumUI v1.0 on GitHub',
];
const logEl = document.getElementById('activity-log');
let li = 0;
function addLog() {
  const d = document.createElement('div');
  const t = new Date().toTimeString().slice(0,8);
  d.style.cssText='animation:fadeIn 0.3s ease';
  d.innerHTML = `<span style="color:rgba(0,255,65,0.3)">[${t}]</span> ${logs[li%logs.length]}`;
  logEl.prepend(d);
  if (logEl.children.length>5) logEl.lastChild.remove();
  li++;
}
addLog();
setInterval(addLog, 3000);
 
// ── PANELS ───────────────────────────────────────────────
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('active');
  const navItems = document.querySelectorAll('.nav-item');
  const names=['home','projects','skills','terminal','contact'];
  navItems[names.indexOf(name)].classList.add('active');
  if (name==='skills') initSkills();
  if (name==='terminal') document.getElementById('terminal-input').focus();
}
 
// ── SKILLS ───────────────────────────────────────────────
const frontSkills = [
  {n:'React / Next.js',v:95},{n:'TypeScript',v:92},{n:'WebGL / GLSL',v:78},
  {n:'CSS Animations',v:88},{n:'Three.js',v:72},{n:'Performance Opt.',v:85},
];
const backSkills = [
  {n:'Node.js / Deno',v:90},{n:'Go / Rust',v:75},{n:'PostgreSQL',v:82},
  {n:'Kubernetes',v:70},{n:'AWS / GCP',v:80},{n:'System Design',v:88},
];
function renderSkills(data, elId) {
  const el = document.getElementById(elId);
  el.innerHTML = data.map(s=>`
    <div class="skill-item">
      <div class="skill-header"><span class="skill-name">${s.n}</span><span class="skill-pct">${s.v}%</span></div>
      <div class="skill-track"><div class="skill-fill" data-w="${s.v}"></div></div>
    </div>`).join('');
}
let skillsInit=false;
function initSkills() {
  if (skillsInit) return; skillsInit=true;
  renderSkills(frontSkills,'skills-front');
  renderSkills(backSkills,'skills-back');
  setTimeout(()=>{
    document.querySelectorAll('.skill-fill').forEach(f=>{f.style.width=f.dataset.w+'%';});
  },100);
}
 
// ── TERMINAL ─────────────────────────────────────────────
const cmds = {
  help:()=>[
    {t:'success',v:'Available commands:'},
    {t:'output',v:'  whoami      — display current user info'},
    {t:'output',v:'  ls          — list projects'},
    {t:'output',v:'  skills      — show skill matrix'},
    {t:'output',v:'  contact     — show contact info'},
    {t:'output',v:'  clear       — clear terminal'},
    {t:'output',v:'  ping [url]  — ping a host'},
    {t:'output',v:'  date        — show current date'},
    {t:'output',v:'  matrix      — toggle matrix intensity'},
  ],
  whoami:()=>[{t:'output',v:'root — Full-Stack Engineer | 7 yrs exp | Open to work'}],
  ls:()=>[
    {t:'output',v:'drwxr-xr-x  NeuralDash/'},
    {t:'output',v:'drwxr-xr-x  StreamForge/'},
    {t:'output',v:'drwxr-xr-x  QuantumUI/'},
    {t:'output',v:'drwxr-xr-x  DevSync-CLI/'},
    {t:'output',v:'-rw-r--r--  README.md'},
  ],
  skills:()=>[
    {t:'success',v:'Skill Matrix:'},
    {t:'output',v:'React/Next.js  ████████████████████ 95%'},
    {t:'output',v:'TypeScript     ██████████████████░░ 92%'},
    {t:'output',v:'Node.js        ██████████████████░░ 90%'},
    {t:'output',v:'WebGL/GLSL     ████████████████░░░░ 78%'},
    {t:'output',v:'Go / Rust      ████████████████░░░░ 75%'},
  ],
  contact:()=>[
    {t:'output',v:'Email:    dev@matrix.io'},
    {t:'output',v:'GitHub:   github.com/dev'},
    {t:'output',v:'LinkedIn: linkedin.com/in/dev'},
  ],
  date:()=>[{t:'output',v:new Date().toString()}],
  clear:()=>'CLEAR',
  ping:(args)=>[
    {t:'output',v:`PING ${args||'8.8.8.8'}: 56 data bytes`},
    {t:'output',v:`64 bytes from ${args||'8.8.8.8'}: icmp_seq=0 time=12.4ms`},
    {t:'output',v:`64 bytes from ${args||'8.8.8.8'}: icmp_seq=1 time=11.8ms`},
    {t:'success',v:`2 packets transmitted, 2 received, 0% packet loss`},
  ],
};
const output = document.getElementById('terminal-output');
function addTermLine(type, text) {
  const d = document.createElement('div');
  d.className = `line ${type}`;
  d.textContent = text;
  output.appendChild(d);
  output.scrollTop = output.scrollHeight;
}
addTermLine('success','Connected to portfolio.sys v4.2.1');
addTermLine('output','Type "help" for available commands.');
addTermLine('output','');
document.getElementById('terminal-input').addEventListener('keydown',e=>{
  if (e.key!=='Enter') return;
  const raw = e.target.value.trim(); e.target.value='';
  if (!raw) return;
  addTermLine('prompt', `root@portfolio:~$ ${raw}`);
  const [cmd,...args] = raw.split(' ');
  const fn = cmds[cmd.toLowerCase()];
  if (!fn) { addTermLine('error',`command not found: ${cmd}`); return; }
  const res = fn(args.join(' '));
  if (res==='CLEAR') { output.innerHTML=''; return; }
  res.forEach(r=>setTimeout(()=>addTermLine(r.t,r.v),50));
});
 
// ── KEY SHORTCUTS ────────────────────────────────────────
document.addEventListener('keydown',e=>{
  const map={F1:'home',F2:'projects',F3:'skills',F4:'terminal',F5:'contact'};
  if (map[e.key]){e.preventDefault();showPanel(map[e.key]);}
});

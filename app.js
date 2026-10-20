// Call Centre app: plain JS, hash-less state router, no build step.
const D = window.DATA, $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const inr = n => '\u20B9' + n.toLocaleString('en-IN');
const S = { route: 'dashboard', open: null, page: 0, lead: null, cal: new Date(), msgs: [...D.msgs], answer: null, callOpen: false, inCall: false, ai: null, myId: null };
const PAGE = 4;

// ---------- shell ----------
const NAV = [['dashboard', 'Dashboard'], ['plan', 'Plan', [['calls', 'Calls to make'], ['incoming', 'Incoming'], ['recent', 'Recent'], ['practice', 'Practise a call']]], ['calendar', 'Calendar'], ['pulse', 'Pulse']];
function shell() {
  $('#top').innerHTML = `<b>On-Ground.ai</b><span>${esc(D.user.co)}</span><span><span class="pill">76</span><span class="pill">${esc(D.user.name)}</span></span>`;
  $('#side').innerHTML = NAV.map(([id, t, subs]) => {
    const on = S.route === id || (S.route === 'channel' && id === 'pulse');
    return `<a class="${id === 'pulse' ? 'pulse ' : ''}${on ? 'on' : ''}" data-go="${subs ? 'calls' : id}">${t}</a>` +
      (subs ? subs.map(([s, st]) => `<a class="sub ${S.route === s ? 'on' : ''}" ${s === 'practice' ? 'data-act="ai"' : `data-go="${s}"`}>${st}</a>`).join('') : '');
  }).join('');
}

// ---------- pages ----------
const bars = (arr, cls, suf = '') => `<div class="bars ${cls}">${arr.map(v => `<div style="height:${v / Math.max(...arr) * 100}%">${v}${suf}</div>`).join('')}</div><div class="lbl">${D.days.map(d => `<span>${d}</span>`).join('')}</div>`;
const pages = {
  dashboard: () => `
    <div class="hero"><h1>Good afternoon, ${esc(D.user.name)}</h1><small>${esc(D.user.co)}</small></div>
    <div class="grid g4">${D.kpis.map(k => `<div class="card kpi"><b>${k[0]}</b><small>${k[1]}</small> ${k[2] ? `<span class="tag">${k[2]}</span>` : ''}</div>`).join('')}</div>
    <div class="grid g2" style="margin-top:10px">
      <div class="grid">
        <div class="card"><h2>My progress today</h2><b style="font-size:18px">${D.progress.leads} leads handled, ${D.progress.closed} closed</b>
          <h2 style="margin-top:10px">Who is waiting</h2>${D.waiting.map(w => `<div class="row"><span>${w[0]}<small>${w[1]}</small></span><span class="tag r">${w[2]}</span></div>`).join('')}</div>
        <div class="card"><h2>Calls handled, last 7 days</h2>${bars(D.calls7, '')}<h2>Conversion trend, last 7 days</h2>${bars(D.conv7, 'b', '%')}</div>
      </div>
      <div class="grid" style="align-content:start">
        <div class="card"><h2>My earnings this month</h2><b style="font-size:22px">${inr(D.earn.month)}</b> <small>${inr(D.earn.planned)} from planned calls</small>
          <div class="meter"><i style="width:${D.earn.month / D.earn.target * 100}%"></i></div></div>
        <div class="card"><h2>My tasks</h2>
          <div class="row" data-go="incoming"><span>2 callbacks</span><span class="tag y">due</span></div>
          <div class="row" data-lead="0"><span>2 hot leads</span><span class="tag r">open</span></div>
          <div class="row" data-go="channel"><span>1 outcome</span><span class="tag">pinned</span></div></div>
      </div>
    </div>`,
  calls: () => {
    const pages = Math.ceil(D.planned.length / PAGE), list = D.planned.slice(S.page * PAGE, S.page * PAGE + PAGE);
    return `<h1>Planned outgoing calls</h1><h2>Ranked by lead score. Tap a lead to expand.</h2>` + list.map(([n, i, sc, v, note]) => `
      <div class="row" data-open="${n}"><span>${n}<small>${i} · ${inr(v)}</small></span><span class="tag">${sc}</span></div>
      ${S.open === n ? `<div class="xp">${note}<br><button class="go" data-act="ai" data-n="${n}">Call now</button> <a href="tel:+917982015371"><button>Phone call</button></a></div>` : ''}`).join('') +
      `<div class="pager"><button data-pg="-1" ${S.page ? '' : 'disabled'}>Prev</button>Page ${S.page + 1} of ${pages}<button data-pg="1" ${S.page < pages - 1 ? '' : 'disabled'}>Next</button></div>`;
  },
  incoming: () => `<h1>Missed calls</h1><h2>Ranked by expected value, highest first</h2>
    <div class="card" style="margin:8px 0"><b>${D.incoming.length}</b> missed today · <b>${inr(D.incoming.reduce((a, x) => a + x[2], 0))}</b> expected value at stake</div>` +
    D.incoming.map(([n, d, v]) => `<div class="row"><span>${n}<small>${d}</small></span><span><b>${v ? inr(v) + ' at risk' : 'Unknown value'}</b> <button class="go" data-act="ai" data-n="${n}">Call back</button></span></div>`).join(''),
  recent: () => `<h1>Recent calls</h1><h2>Tap a call to review it</h2>` + D.recent.map(([n, t, w, l], i) => `
    <div class="row" data-open="r${i}"><span>${n}<small>${t} · ${w} · ${l}</small></span><span class="tag ${t === 'Missed' ? 'r' : ''}">${t}</span></div>
    ${S.open === 'r' + i ? `<div class="xp">Call review: ${t} call with ${n}, length ${l}. Greeting delivered within 10s. Next step: send quote on WhatsApp.</div>` : ''}`).join(''),
  calendar: () => {
    const c = S.cal, y = c.getFullYear(), m = c.getMonth(), first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate(), now = new Date();
    const cells = [...Array(first).fill(''), ...Array.from({ length: days }, (_, i) => i + 1)];
    return `<div class="cal"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><button data-mo="-1">&lt;</button><b>${c.toLocaleString('en', { month: 'long' })} ${y}</b><span><button data-mo="0">Today</button> <button data-mo="1">&gt;</button></span></div>
      <div class="d">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<small>${d}</small>`).join('')}${cells.map(d => {
        const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        return d ? `<div class="${d === now.getDate() && m === now.getMonth() && y === now.getFullYear() ? 't ' : ''}${D.events.includes(key) ? 'e' : ''}">${d}</div>` : '<span></span>';
      }).join('')}</div></div>`;
  },
  pulse: () => `<div class="pv"><b>AvaniBot</b> <span class="tag">agents on</span><p>Ask me about anything happening in Pulse.</p><button>Daily brief</button><button>Ask a question</button></div>
    <h2>Role agents</h2><div class="row ch" data-go="channel"><span># callcentre-agent<small>Call Centre Agent</small></span></div>
    <h2 style="margin-top:10px">Task agents</h2>${D.agents.slice(1).map(a => `<div class="row ch"><span># ${a[0]}<small>${a[1]}</small></span></div>`).join('')}
    <h2 style="margin-top:10px">Channels</h2><div class="row ch" data-go="channel"><span># callcentre-team<small>Your channel</small></span><span class="tag y">1 pinned</span></div>
    <div class="row" style="background:#fdf0d0"><span><b>Kudos</b><small>Send a shout-out to a teammate</small></span></div>`,
  channel: () => `<div style="display:flex;gap:8px;align-items:center"><button data-go="pulse">Back</button><b># callcentre-team</b></div>
    <div class="need" style="margin-top:10px"><b>Needs your input</b> <span class="tag r">pinned</span><p>Confirm the 4:30pm callback</p>
      ${S.answer ? `<p class="tag">Answered: ${esc(S.answer)}</p>` : `<button class="go" data-ans="Confirmed">Confirmed</button> <button data-ans="Reschedule">Reschedule</button>
      <div style="display:flex;gap:6px;margin-top:6px"><input id="ans" placeholder="Or type your answer"><button class="go" data-ans="">Send</button></div>`}</div>
    <div class="chat">${S.msgs.map(([w, t, x]) => `<div class="b ${w === 'You' ? 'me' : ''}"><small>${w} ${t}</small><br>${esc(x)}</div>`).join('')}</div>
    <div style="display:flex;gap:6px"><input id="msg" placeholder="Message #callcentre-team"><button class="go" data-send>Send</button></div>`
};

// ---------- leads modal ----------
function modal() {
  if (S.lead == null) return $('#modal').innerHTML = '';
  const L = D.leads[S.lead];
  $('#modal').innerHTML = `<div class="ov" data-act="close"><div class="md"><header><span>Leads<br><small>Lead ${S.lead + 1} of ${D.leads.length}</small></span><button data-act="close">&times;</button></header><section>
    <b>${L.n}</b> <small>Interested: ${L.i} · ${inr(L.v)}</small> <span class="tag y">${L.left}</span>
    <div class="need" style="margin:8px 0">${L.q}</div>
    ICP ${L.icp}%<div class="meter"><i style="width:${L.icp}%"></i></div>Lead intent score ${L.intent}%<div class="meter"><i style="width:${L.intent}%"></i></div>
    <details><summary>ICP fit breakdown</summary>Budget, product fit and location all match.</details>
    <details open><summary>Where we picked up signals</summary>${L.sig.map(s => `<p><b>${s[0]}</b><br><i>${s[1]}</i></p>`).join('')}</details>
    <div class="pager"><button data-ld="-1" ${S.lead ? '' : 'disabled'}>Previous</button><button data-ld="1" ${S.lead < D.leads.length - 1 ? '' : 'disabled'}>Next</button></div>
  </section></div></div>`;
}

function render() {
  shell(); $('#v').innerHTML = pages[S.route](); modal();
  const f = S.focus; if (f && $(f)) $(f).focus(); S.focus = null;
}

// ---------- calling: WebRTC human call (PeerJS) + AI voice call ----------
let peer, cur, local, rec;
function initPeer() {
  if (peer || !window.Peer) return;
  peer = new Peer();
  peer.on('open', id => { S.myId = id; paintCall(); });
  peer.on('call', c => navigator.mediaDevices.getUserMedia({ audio: true }).then(st => { local = st; c.answer(st); attach(c); }));
}
function attach(c) {
  cur = c; c.on('stream', s => { $('#ra').srcObject = s; });
  c.on('close', endCall); S.inCall = true; S.ai = null; paintCall();
}
function dial(id) {
  if (!id || !peer) return;
  navigator.mediaDevices.getUserMedia({ audio: true }).then(st => { local = st; attach(peer.call(id, st)); }).catch(() => alert('Allow microphone access to place a call.'));
}
function endCall() {
  if (cur) { cur.close(); cur = null; }
  if (local) local.getTracks().forEach(t => t.stop());
  speechSynthesis.cancel(); if (rec) try { rec.abort(); } catch (e) { }
  S.inCall = false; S.ai = null; paintCall();
}
const REPLIES = [[/emi|instal/, 'EMI would help. What is the monthly amount on the 24 month plan?'], [/price|cost|discount|offer/, 'A competitor quoted me lower. Can you match that price?'], [/warrant/, 'How long is the warranty, and does it cover sagging?'], [/trial|night/, 'A 100 night trial sounds good. How do returns work?'], [/./, 'Okay, I will think about it. Can you send the details on WhatsApp?']];
function aiCall(name) {
  S.callOpen = true; S.inCall = true; S.ai = { name, log: [] };
  say(`Hello, this is ${name}. I looked at the Ortho GRID mattress in your store. Can you tell me about the price?`);
}
function say(t) {
  if (!S.ai) return; S.ai.log.push(['ai', t]); paintCall();
  speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-IN'; u.onend = listen; speechSynthesis.speak(u);
}
function listen() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR || !S.ai) return;
  rec = new SR(); rec.lang = 'en-IN'; rec.onresult = e => hear(e.results[0][0].transcript);
  try { rec.start(); } catch (e) { }
}
function hear(t) {
  if (!S.ai) return; S.ai.log.push(['me', t]); paintCall();
  const r = REPLIES.find(x => x[0].test(t.toLowerCase()))[1]; setTimeout(() => say(r), 600);
}
function paintCall() {
  const c = $('#call');
  if (!S.callOpen && !S.inCall) return c.innerHTML = '';
  c.innerHTML = `<div class="cp"><div style="display:flex;justify-content:space-between"><b>Calling</b><button data-act="cx">&times;</button></div>` + (S.inCall
    ? `<small>${S.ai ? 'AI customer: ' + esc(S.ai.name) + ' (speak, or type)' : 'Connected, human to human'}</small>
       <div id="log">${S.ai ? S.ai.log.map(l => `<p class="${l[0]}">${esc(l[1])}</p>`).join('') : ''}</div>
       ${S.ai ? '<input id="say" placeholder="Type reply, press Enter">' : ''}<button class="red" data-act="end">End call</button>`
    : `<small>Your ID (share it so someone can call you)</small><code>${S.myId || 'connecting...'}</code>
       <input id="pid" placeholder="Paste a peer ID to call"><button class="go" data-act="dial">Call person</button>
       <button data-act="ai" data-n="Priya Iyer">AI customer call</button><a href="tel:+917982015371"><button style="width:100%">Phone call</button></a>`) + `</div>`;
}

// ---------- events ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go],[data-act],[data-open],[data-pg],[data-mo],[data-lead],[data-ld],[data-ans],[data-send]'); if (!t) return;
  const d = t.dataset;
  if (d.go) { S.route = d.go; S.open = null; S.page = 0; render(); if (d.go === 'channel') scrollTo(0, 0); }
  else if (d.open) { S.open = S.open === d.open ? null : d.open; render(); }
  else if (d.pg) { S.page += +d.pg; S.open = null; render(); }
  else if (d.mo !== undefined) { S.cal = d.mo === '0' ? new Date() : new Date(S.cal.getFullYear(), S.cal.getMonth() + +d.mo, 1); render(); }
  else if (d.lead !== undefined) { S.lead = +d.lead; render(); }
  else if (d.ld) { S.lead += +d.ld; render(); }
  else if (d.ans !== undefined) { const v = d.ans || ($('#ans') || {}).value; if (v) { S.answer = v; render(); } }
  else if (t.hasAttribute('data-send')) sendMsg();
  else if (d.act === 'close') { if (e.target === t) { S.lead = null; modal(); } }
  else if (d.act === 'cx') { S.callOpen = !S.callOpen; paintCall(); }
  else if (d.act === 'end') endCall();
  else if (d.act === 'dial') dial(($('#pid') || {}).value.trim());
  else if (d.act === 'ai') aiCall(d.n || 'Priya Iyer');
});
function sendMsg() {
  const i = $('#msg'); if (!i || !i.value.trim()) return;
  const now = new Date().toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '');
  S.msgs.push(['You', now, i.value.trim()]); S.focus = '#msg'; render(); $('#v').scrollTop = 1e6;
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'msg') sendMsg();
  else if (e.target.id === 'say') { const v = e.target.value.trim(); if (v) hear(v); }
  else if (e.target.id === 'ans' && e.target.value.trim()) { S.answer = e.target.value.trim(); render(); }
});
render(); initPeer();

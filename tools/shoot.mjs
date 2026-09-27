/* نَسَق (NASAQ) — Copyright (c) 2026 Mohammed S. Ellouh. All rights reserved.
   ملكية خاصة: يُمنع النسخ أو التعديل أو إعادة النشر أو التقليد دون إذن كتابي. انظر ملف LICENSE. */
/* لقطات وفحص تصميم لكل طابع ووضع وعرض وتبويب — بمتصفح Edge المثبّت عبر بروتوكول DevTools، بلا أي تنزيل.
   الاستعمال (على نسخة اختبار بلا جسر، لا على المنصة المنشورة):
     node tools/shoot.mjs --base http://localhost:8937 --out tools/shots/before [--palettes ,nasaq,nasaq360]
                          [--modes light,dark] [--widths 1440,390] [--tabs board,tasks,flow,projects,expenses]
   يحفظ لقطة كاملة لكل حالة، وملف audit.json بنتائج tools/design-audit.js لكل حالة. */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:8937');
const OUT = arg('out', 'tools/shots/before');
const PALETTES = arg('palettes', ',nasaq,nasaq360').split(',');        /* '' = كلاسيكي قبل الترحيل */
const MODES = arg('modes', 'light,dark').split(',');
const WIDTHS = arg('widths', '1440,390').split(',').map(Number);
const TABS = arg('tabs', 'board,tasks,flow,projects,expenses').split(',');
const AUDIT_TABS = new Set(arg('audit', 'board').split(','));
const PREP = arg('prep', '');
const EDGE = arg('edge', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe');
const PORT = 9300 + Math.floor(Math.random() * 500);
const AUDIT = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'design-audit.js'), 'utf8');
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* --freeze: وقت ثابت وعشوائية ثابتة وبلا حركة، لتُقارن لقطات «قبل» و«بعد» بكسلًا بكسلًا */
const FROZEN = arg('freeze', '');
const FREEZE = !FROZEN ? '' : `;(()=>{ const T=${JSON.stringify(FROZEN)}, base=new Date(T).getTime(), t0=performance.now(), N=Date;
  const F=function(...a){ return a.length ? new N(...a) : new N(base + (performance.now()-t0)); };
  F.prototype=N.prototype; F.now=()=>base + (performance.now()-t0); F.parse=N.parse; F.UTC=N.UTC; Date=F;
  let s=20260927; Math.random=()=>((s=(s*1103515245+12345)%2147483648)/2147483648);
  addEventListener('DOMContentLoaded',()=>{ const st=document.createElement('style');
    st.textContent='*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important;caret-color:transparent!important}';
    document.head.appendChild(st); }); })();`;

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl); let id = 0; const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } };
  const ready = new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  return { ready, close: () => ws.close(),
    send: (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); }) };
}
async function evalIn(c, expr) {
  const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}

const profile = mkdtempSync(join(tmpdir(), 'nasaq-shoot-'));
const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', '--mute-audio', '--disable-extensions',
  '--disable-component-extensions-with-background-pages', '--no-default-browser-check', '--disable-features=msEdgeSidebarV2,msShoppingExp',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
let version; for (let i = 0; i < 50 && !version; i++) { await sleep(200); try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch (e) {} }
if (!version) { edge.kill(); throw new Error('تعذّر تشغيل Edge'); }

mkdirSync(OUT, { recursive: true });
const results = {};
try {
  for (const pal of PALETTES) for (const mode of MODES) for (const w of WIDTHS) {
    const mobile = w < 768, h = mobile ? 844 : 900;
    const page = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
    const c = cdp(page.webSocketDebuggerUrl); await c.ready;
    await c.send('Page.enable'); await c.send('Runtime.enable');
    await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
    if (mobile) await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: mode }] });
    /* حالة نظيفة لكل حالة: طابع ووضع محدّدان، ونفس الوقت كل مرة */
    await c.send('Page.addScriptToEvaluateOnNewDocument', { source:
      `if(!sessionStorage.__seed){ localStorage.clear(); localStorage.setItem('daily-board-palette', ${JSON.stringify(pal)});
        localStorage.setItem('daily-board-theme', ${JSON.stringify(mode)}); sessionStorage.__seed = 1; }` + FREEZE });
    await c.send('Page.navigate', { url: BASE + '/index.html#today' }); await sleep(2500);
    /* 3 مهام تجريبية عبر حقل الإضافة حتى لا تكون الصفحة فارغة */
    await evalIn(c, `(async()=>{ for (const t of ['مراجعة تقرير مشروع G016 المرحلي','اتصال بمنسق عيادة خانيونس','تجهيز كشوف مستفيدي الحليب']){
      const i=document.getElementById('tText'); i.value=t; i.dispatchEvent(new Event('input',{bubbles:true}));
      document.getElementById('addBtn').click(); await new Promise(r=>setTimeout(r,150)); } })()`);
    if (PREP) await evalIn(c, PREP);   /* --prep: تجهيز حالة للتصوير (مهمة منجزة، ختم…) */
    for (const tab of TABS) {
      await evalIn(c, `document.getElementById('tab${tab[0].toUpperCase() + tab.slice(1)}Btn').click(); scrollTo(0,0)`);
      await sleep(tab === 'projects' ? 3500 : 1200);
      await evalIn(c, 'document.fonts.ready.then(()=>new Promise(r=>setTimeout(r,300)))');   /* لا تصوير قبل اكتمال الخطوط: لقطات ثابتة للمقارنة */
      if (FROZEN) await evalIn(c, `document.getAnimations().forEach(a=>{ try{ a.finish(); }catch(e){ a.pause(); a.currentTime=0; } })`);
      const key = `${pal || 'classic'}-${mode}-${w}-${tab}`;
      const height = Math.min(9000, await evalIn(c, 'document.documentElement.scrollHeight'));
      const shot = await c.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height, scale: 1 } });
      writeFileSync(join(OUT, key + '.png'), Buffer.from(shot.data, 'base64'));
      if (AUDIT_TABS.has(tab)) results[key] = await evalIn(c, AUDIT.replace('console.table(report); return report;', 'return report;'));
      process.stdout.write('.');
    }
    c.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${page.id}`).catch(() => {});
  }
} finally {
  writeFileSync(join(OUT, 'audit.json'), JSON.stringify(results, null, 1));
  edge.kill(); await sleep(500); try { rmSync(profile, { recursive: true, force: true }); } catch (e) {}
}
console.log('\nتم:', Object.keys(results).length, 'فحصًا، واللقطات في', OUT);

/* نَسَق — حسابات «نبض المشاريع»، مشتركة بين صفحة النبض وبطاقتها في اللوح.
   analyse(DATA) يعيد: المشاريع الجارية، ومجموعات الاستحقاقات (متأخرة/أسبوع/شهر/لاحقًا)،
   وصحّة كل مشروع (الوقت مقابل الإنجاز، والأسباب، ودرجة الإلحاح). الأرقام إنجليزية. */
window.NasaqPulse = (function(){
const AR = n => String(n);
const LOC = 'ar-EG-u-nu-latn';
const today = (()=>{ const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const toDate = s => { if(!s) return null; const d = new Date(String(s).slice(0, 10) + 'T00:00:00'); return isNaN(d) ? null : d; };
const daysTo = s => { const d = toDate(s); return d ? Math.round((d - today) / 864e5) : null; };
const RUNNING = new Set(['قيد التنفيذ', 'نشط']);
const fmtDay = s => { const d = toDate(s); return d ? d.toLocaleDateString(LOC, {day: 'numeric', month: 'short'}) : '—'; };
/* المعدود بصيغته الصحيحة: 1 مشروع، 2 مشروعان، 3–10 مشاريع، 11+ مشروعًا */
function cnt(n, f){ return n === 1 ? f[0] : n === 2 ? f[1] : AR(n) + ' ' + (n <= 10 ? f[2] : f[3]); }
const W_PROJ = ['مشروع واحد', 'مشروعان', 'مشاريع', 'مشروعًا'], W_REP = ['تقرير واحد', 'تقريران', 'تقارير', 'تقريرًا'];
function days(n){ n = Math.abs(n); return n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : n <= 10 ? AR(n) + ' أيام' : AR(n) + ' يومًا'; }
function whenText(n){
  if(n == null) return {txt: 'بلا تاريخ', cls: ''};
  if(n < 0) return {txt: 'متأخر ' + days(n), cls: 'late'};
  if(n === 0) return {txt: 'اليوم', cls: 'soon'};
  if(n === 1) return {txt: 'غدًا', cls: 'soon'};
  return {txt: 'بعد ' + days(n), cls: n <= 7 ? 'soon' : ''};
}

/* ================= الحساب ================= */
function analyse(DATA){
  const byId = new Map(DATA.projects.map(p=>[p.id, p]));
  const running = DATA.projects.filter(p=>RUNNING.has(p.status));
  const open = DATA.deliverables.filter(x=>x.status !== 'صدر' && byId.has(x.project));
  const dues = open.map(x=>({x, p: byId.get(x.project), n: daysTo(x.due)}));
  const groups = {
    late:  dues.filter(o=>o.n != null && o.n < 0).sort((a, b)=>a.n - b.n),
    week:  dues.filter(o=>o.n != null && o.n >= 0 && o.n <= 7).sort((a, b)=>a.n - b.n),
    month: dues.filter(o=>o.n != null && o.n > 7 && o.n <= 31).sort((a, b)=>a.n - b.n),
    later: dues.filter(o=>o.n != null && o.n > 31 && o.n <= 90).sort((a, b)=>a.n - b.n)
  };
  /* صحّة كل مشروع جارٍ: الوقت مقابل الإنجاز، والتقارير، والنهاية */
  const health = running.map(p=>{
    const s = toDate(p.start), e = toDate(p.end), endIn = daysTo(p.end);
    const elapsed = s && e && e > s ? Math.min(1, Math.max(0, (today - s) / (e - s))) : null;
    const plan = DATA.plan.filter(x=>x.project === p.id), dels = DATA.deliverables.filter(x=>x.project === p.id);
    const progress = plan.length ? plan.filter(x=>x.status === 'منجز').length / plan.length
                   : dels.length ? dels.filter(x=>x.status === 'صدر').length / dels.length : null;
    const lateDels = dues.filter(o=>o.p === p && o.n != null && o.n < 0);
    const nextDel = dues.filter(o=>o.p === p && o.n != null && o.n >= 0).sort((a, b)=>a.n - b.n)[0];
    const finalDone = dels.some(x=>/ختامي/.test(x.kind || '') && x.status === 'صدر');
    const reasons = [];
    if(lateDels.length) reasons.push(lateDels.length === 1 ? 'تقرير متأخر: ' + lateDels[0].x.kind + ' ' + AR(lateDels[0].x.num || '') : 'متأخر: ' + cnt(lateDels.length, W_REP));
    if(endIn != null && endIn < 0) reasons.push('تجاوز موعد انتهائه بـ' + days(endIn) + ' ولم يُغلق');
    else if(endIn != null && endIn <= 30) reasons.push('ينتهي بعد ' + days(endIn) + (finalDone ? '' : ' — والتقرير الختامي لم يصدر'));
    const behind = elapsed != null && progress != null && elapsed - progress > .25;
    if(behind) reasons.push('الوقت سبق الإنجاز: ' + AR(Math.round(elapsed * 100)) + '% من المدة مقابل ' + AR(Math.round(progress * 100)) + '% إنجاز');
    if(nextDel && nextDel.n <= 7) reasons.push('يستحق ' + nextDel.x.kind + ' ' + whenText(nextDel.n).txt);
    const score = lateDels.length * 3 + (endIn != null && endIn < 0 ? 3 : 0) + (endIn != null && endIn >= 0 && endIn <= 30 ? 2 : 0) + (behind ? 2 : 0) + (nextDel && nextDel.n <= 7 ? 1 : 0);
    return {p, elapsed, progress, endIn, lateDels, nextDel, reasons, score, behind};
  }).sort((a, b)=>b.score - a.score || (a.endIn ?? 1e9) - (b.endIn ?? 1e9));
  return {running, groups, health};
}

return {today, toDate, daysTo, fmtDay, cnt, W_PROJ, W_REP, days, whenText, analyse, RUNNING, LOC};
})();

/* نَسَق (NASAQ) — Copyright (c) 2026 Mohammed S. Ellouh. All rights reserved.
   ملكية خاصة: يُمنع النسخ أو التعديل أو إعادة النشر أو التقليد دون إذن كتابي. انظر ملف LICENSE. */
/* نَسَق — قناة الاتصال بالجسر، مشتركة بين اللوح وصفحة المشاريع.
   كانت منسوخة في الصفحتين، فاختلفت إحداهما عن الأخرى وظهر خطأ «لم يستجب الجسر».
   الترتيب: إطار مخفي (postMessage) ← JSONP ← fetch، مع إعادة محاولة للعمليات الآمنة.
   الاستعمال: NasaqBridge.configure(()=>bridgeUrl) ثم NasaqBridge.post(payload)
   ويُستدعى NasaqBridge.reset() عند تغيير رابط الجسر. */
window.NasaqBridge = (function(){
let getUrl = function(){ return ""; };
function URL_(){ return getUrl() || ""; }
/* ---------- النقل إلى الجسر ----------
   تطبيقات Apps Script تردّ بإعادة توجيه إلى رابط مؤقّت على script.googleusercontent.com.
   استرجاع ذلك الرابط عبر fetch يفشل بـ 404 في بعض المتصفحات رغم أن السكربت نفّذ ونجح.
   تحميل الرد كسكربت (JSONP) يسلك المسار نفسه الذي ينجح حين تفتح الرابط في شريط العنوان،
   فنستخدمه ما دام الطلب يسع في رابط، ونعود إلى fetch للطلبات الكبيرة (رفع الحالة). */
let jsonpSeq = 0;
function jsonpPost(payload){
  return new Promise((resolve, reject)=>{
    const cb = '__db_cb_' + (++jsonpSeq) + '_' + Date.now();
    const url = URL_() + (URL_().indexOf('?') < 0 ? '?' : '&')
              + 'cb=' + cb + '&p=' + encodeURIComponent(JSON.stringify(payload));
    const s = document.createElement('script');
    let done = false;
    const cleanup = ()=>{ try{ delete window[cb]; }catch(e){ window[cb] = undefined; }
                          if(s.parentNode) s.parentNode.removeChild(s); };
    const timer = setTimeout(()=>{
      if(done) return; done = true; cleanup();
      reject(new Error('لم يردّ الجسر خلال 60 ثانية.'));
    }, 60000);
    window[cb] = d=>{ if(done) return; done = true; clearTimeout(timer); cleanup(); resolve(d); };
    s.onerror = ()=>{ if(done) return; done = true; clearTimeout(timer); cleanup();
                      reject(new Error('تعذّر الوصول إلى الجسر — تحقّق من الرابط والاتصال.')); };
    s.src = url;
    document.head.appendChild(s);
  });
}

/* ---------- القناة الأساسية: إطار مخفي من الجسر + postMessage ----------
   ردود Apps Script العادية (fetch وJSONP) تمرّ عبر رابط مؤقت على googleusercontent
   يعيد 404 بشكل متقطّع. الإطار يحمّل صفحة HtmlService من الجسر، وهي تنفّذ الطلبات عبر
   google.script.run — بلا ذلك الرابط وبلا حدّ حجم. إن لم يستجب الإطار (جسر قديم لا يعرفه،
   أو متصفح يحجبه) نعود تلقائيًا إلى JSONP/fetch مع إعادة المحاولة للعمليات الآمنة. */
let rpcFrame = null, rpcWin = null, rpcOrigin = '', rpcReady = null, rpcReadyDone = null;
let rpcSeq = 0, rpcDisabled = false;
const rpcPending = new Map();
window.addEventListener('message', ev=>{
  const m = ev.data;
  if(!m || m.__nasaq !== 1) return;
  let host = ''; try{ host = new URL(ev.origin).hostname; }catch(e){ return; }
  if(!/\.googleusercontent\.com$/.test(host)) return;
  if(m.type === 'ready'){ rpcWin = ev.source; rpcOrigin = ev.origin; if(rpcReadyDone) rpcReadyDone(); return; }
  if(m.type === 'result' && ev.origin === rpcOrigin){
    const p = rpcPending.get(m.id); if(!p) return;
    rpcPending.delete(m.id); clearTimeout(p.timer);
    if(m.ok) p.resolve(m.body); else p.reject(new Error(m.error || 'خطأ في الجسر'));
  }
});
function rpcReset(){
  if(rpcFrame && rpcFrame.parentNode) rpcFrame.parentNode.removeChild(rpcFrame);
  rpcFrame = null; rpcWin = null; rpcOrigin = ''; rpcReady = null; rpcReadyDone = null; rpcDisabled = false;
}
function rpcInit(){
  if(rpcReady) return rpcReady;
  rpcReady = new Promise((resolve, reject)=>{
    const t = setTimeout(()=>reject(new Error('rpc-init-timeout')), 15000);
    rpcReadyDone = ()=>{ clearTimeout(t); resolve(); };
    rpcFrame = document.createElement('iframe');
    rpcFrame.setAttribute('aria-hidden', 'true'); rpcFrame.tabIndex = -1; rpcFrame.title = 'nasaq-bridge';
    rpcFrame.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
    rpcFrame.src = URL_() + (URL_().indexOf('?') < 0 ? '?' : '&') + 'frame=1&o=' + encodeURIComponent(location.origin);
    document.body.appendChild(rpcFrame);
  });
  /* لم يستجب الإطار: نزيله ونعتمد الطريقة الاحتياطية بقية الجلسة */
  rpcReady.catch(()=>{ rpcReset(); rpcDisabled = true; });
  return rpcReady;
}
function rpcCall(payload){
  return rpcInit().then(()=>new Promise((resolve, reject)=>{
    const id = ++rpcSeq;
    const timer = setTimeout(()=>{ rpcPending.delete(id); reject(new Error('لم يردّ الجسر خلال 60 ثانية.')); }, 60000);
    rpcPending.set(id, {resolve, reject, timer});
    rpcWin.postMessage({__nasaq:1, type:'call', id, payload: JSON.stringify(payload)}, rpcOrigin);
  })).then(txt=>JSON.parse(txt));
}

/* عمليات يصحّ تكرارها إن ضاع ردّها — لا تُنشئ شيئًا مرتين ولا ترسل بريدًا */
const RETRY_SAFE = new Set(['auth_login','auth_me','boot','ping','options','search','state_get','state_set','calendar_today','telegram_status',
  'expense_options','expense_summary','admin_list_users','set_status','delete']);
function jsonpWithRetry(payload){
  const tries = RETRY_SAFE.has(payload.action) ? 3 : 1;
  let n = 0;
  const attempt = ()=>jsonpPost(payload).catch(e=>{
    if(++n < tries && !/60 ثانية/.test(e.message)) return new Promise(r=>setTimeout(r, 700*n)).then(attempt);
    throw e;
  });
  return attempt();
}
function legacyPost(payload){
  const raw = JSON.stringify(payload);
  /* حدّ الرابط الآمن ~8000 حرف؛ ما دون ذلك يمرّ عبر JSONP */
  if(URL_().length + encodeURIComponent(raw).length + 80 < 7000) return jsonpWithRetry(payload);
  return fetchPost(raw);
}

function fetchPost(raw){
  /* مهلة زمنية: بلا هذا يبقى اللوح معلّقًا للأبد إن لم يردّ الجسر */
  const ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  const t0 = Date.now();
  const timer = ctl ? setTimeout(()=>ctl.abort(), 60000) : null;
  return fetch(URL_(), {
    method:'POST', redirect:'follow',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body: raw,
    signal: ctl ? ctl.signal : undefined
  }).catch(err=>{
    if(timer) clearTimeout(timer);
    if(err && err.name === 'AbortError')
      throw new Error('لم يردّ الجسر خلال 60 ثانية. غالبًا النشر معطوب — أنشئ نشرًا جديدًا (Deploy ← New deployment) وحدّث الرابط.');
    throw new Error('تعذّر الوصول إلى الجسر: '+err.message);
  }).then(r=>{
    if(timer) clearTimeout(timer);
    return r.text().then(txt=>({status:r.status, txt:txt, ms:Date.now()-t0}));
  }).then(res=>{
    let d;
    try{ d = JSON.parse(res.txt); }
    catch(err){
      /* الجسر ردّ بشيء ليس JSON — عادةً صفحة HTML من جوجل. اكشف محتواها بدل رسالة غامضة. */
      console.error('رد غير متوقّع من الجسر — الحالة', res.status, '| المدة', res.ms+'ms', '\nالرابط:', URL_(), '\n', res.txt.slice(0,1500));
      const head = res.txt.slice(0,600);
      if(res.status === 404)
        throw new Error('الرابط لا يشير إلى نشر موجود (404). في Apps Script افتح Deploy ← Manage deployments وانسخ رابط /exec الحالي، ثم ضعه هنا عبر "رابط الجسر خاطئ؟ غيّره هنا".');
      if(/accounts\.google\.com|ServiceLogin|AccountChooser|Choose an account/i.test(head))
        throw new Error('جوجل طلبت تسجيل دخول بدل الرد. افتح رابط الجسر في تبويب جديد، اختر حسابك، ثم أعد المحاولة (أو استخدم نافذة بحساب جوجل واحد فقط).');
      if(/Moved Temporarily|Temporary Redirect|Moved Permanently/i.test(head))
        throw new Error('الجسر أعاد توجيهًا لم يكتمل. أعد النشر بنسخة جديدة (New deployment) وحدّث الرابط.');
      if(/Sorry, unable to open the file|unable to open/i.test(head))
        throw new Error('الرابط الموجود ليس رابط ويب آب. تأكّد أنه ينتهي بـ /exec وليس رابط درايف.');
      if(/Authorization is required|Authorization required/i.test(head))
        throw new Error('السكربت يحتاج تفويضًا. افتح Apps Script ونفّذ أي دالة يدويًا ووافق على الأذونات، ثم أعد النشر.');
      throw new Error('رد الجسر ليس JSON (الحالة '+res.status+'). افتح Console لرؤية الرد الكامل.');
    }
    return d;
  });
}


function legacyOrRpc(payload){
  if(!URL_()) return Promise.reject(new Error("لا يوجد رابط جسر"));
  /* الإطار يحتاج صفحة عبر http(s) — من file:// نذهب مباشرة إلى الطريقة الاحتياطية */
  if(/^https?:$/.test(location.protocol) && !rpcDisabled){
    return rpcCall(payload).catch(function(err){
      if(err && err.message === "rpc-init-timeout") return legacyPost(payload);
      throw err;
    });
  }
  return legacyPost(payload);
}

return { configure: function(f){ getUrl = f; }, post: legacyOrRpc, reset: rpcReset,
         get disabled(){ return rpcDisabled; } };
})();

/* ---------- جلسة الدخول — مشتركة بين اللوح وصفحتي المشاريع والنبض ----------
   لا تُخزَّن كلمة السر في المتصفح إطلاقًا؛ المحفوظ رمز الجلسة وحده (والاسم لتعبئة الحقل).
   «ابقَ مسجّل الدخول»: الرمز في localStorage (جلسة طويلة يمنحها الجسر).
   بدونه: في sessionStorage فقط، فتنتهي الجلسة بإغلاق التبويب/المتصفح.
   المفتاح daily-board-auth نفسه في المخزنين، فلا تنفصل الجلسات القديمة. */
window.NasaqAuth = (function(){
  var KEY = 'daily-board-auth', USER_KEY = 'daily-board-remember-user', OLD_KEY = 'daily-board-remember';
  function get(store){ try{ return JSON.parse(window[store].getItem(KEY) || 'null'); }catch(e){ return null; } }
  function del(store, k){ try{ window[store].removeItem(k); }catch(e){} }
  /* ترحيل لمرة واحدة: النسخة القديمة كانت تحفظ اسم المستخدم وكلمة السر نصًّا صريحًا */
  (function migrate(){
    var old = null;
    try{ old = JSON.parse(localStorage.getItem(OLD_KEY) || 'null'); }catch(e){}
    try{ if(localStorage.getItem(OLD_KEY) !== null) localStorage.removeItem(OLD_KEY); }catch(e){}
    if(old && old.u){ try{ if(!localStorage.getItem(USER_KEY)) localStorage.setItem(USER_KEY, String(old.u)); }catch(e){} }
  })();
  function load(){ return get('sessionStorage') || get('localStorage'); }
  function persistent(){ return !!get('localStorage'); }
  /* persist غير محدَّد: يبقى الرمز في المخزن الذي هو فيه الآن (تحديث بعد الإقلاع أو تغيير كلمة السر) */
  function save(a, persist){
    if(!a){ clear(); return; }
    if(persist === undefined) persist = persistent() || !get('sessionStorage');
    var to = persist ? 'localStorage' : 'sessionStorage', other = persist ? 'sessionStorage' : 'localStorage';
    try{ window[to].setItem(KEY, JSON.stringify(a)); }catch(e){}
    del(other, KEY);
  }
  function clear(){ del('localStorage', KEY); del('sessionStorage', KEY); }
  function rememberedUser(){ try{ return localStorage.getItem(USER_KEY) || ''; }catch(e){ return ''; } }
  function rememberUser(u){ try{ u ? localStorage.setItem(USER_KEY, u) : localStorage.removeItem(USER_KEY); }catch(e){} }
  return { load: load, save: save, clear: clear, persistent: persistent,
           rememberedUser: rememberedUser, rememberUser: rememberUser };
})();

/* ---------- تهريب النصوص قبل إدخالها في HTML ----------
   كل نص يأتي من نوشن أو من المستخدم ويُدمج في innerHTML أو في خاصية (value="…" / title="…")
   يمرّ عبر esc(). ما لا يحتاج وسومًا يُكتب بـ textContent مباشرة. */
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c];
  });
}

/* ---------- الأرقام والتواريخ: إنجليزية (0-9) في المنصة كلها ----------
   لغة واحدة للعرض، ودوال مشتركة بدل toLocale*('ar-EG…') المتفرقة. التقويم الهجري بأم القرى.
   تُعرَّف على window (لا بـ function) كي لا تتعارض مع ثوابت محلية بالأسماء نفسها في الصفحات. */
window.NASAQ_LOCALE = 'ar-EG-u-nu-latn';
window.NASAQ_HIJRI_LOCALE = 'ar-SA-u-ca-islamic-umalqura-nu-latn';
/* YYYY-MM-DD يُقرأ بتوقيت الجهاز (لا UTC)، وما سواه كما هو */
window.nasaqDateOf = function(d){
  if(d instanceof Date) return d;
  if(typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d + 'T00:00:00');
  return new Date(d);
};
window.fmtNum = function(n, opts){
  var x = Number(n);
  return isFinite(x) ? x.toLocaleString(NASAQ_LOCALE, opts) : String(n == null ? '' : n);
};
/* المبلغ مقرّبًا لخانتين، والعملة بعده (الشيكل افتراضيًا) */
window.fmtMoney = function(n, cur){
  return fmtNum(Math.round(Number(n) * 100) / 100) + ' ' + (cur || '₪');
};
window.fmtDate = function(d, opts){
  return nasaqDateOf(d).toLocaleDateString(NASAQ_LOCALE, opts || {day: 'numeric', month: 'long', year: 'numeric'});
};
window.fmtTime = function(d, opts){
  return nasaqDateOf(d == null ? new Date() : d).toLocaleTimeString(NASAQ_LOCALE, opts || {hour: '2-digit', minute: '2-digit'});
};
/* يعيد '' إن لم يدعم المتصفح أم القرى — لا نعرض تاريخًا هجريًا تقريبيًا */
window.fmtHijri = function(d, opts){
  try{
    var f = new Intl.DateTimeFormat(NASAQ_HIJRI_LOCALE, opts || {day: 'numeric', month: 'long', year: 'numeric'});
    if(f.resolvedOptions().calendar !== 'islamic-umalqura') return '';
    return f.format(nasaqDateOf(d == null ? new Date() : d));
  }catch(e){ return ''; }
};
/* إدخال المستخدم: الأرقام العربية (٠-٩) والفارسية (۰-۹) وفواصلها تتحول إلى إنجليزية قبل الحساب */
window.toLatinDigits = function(s){
  return String(s == null ? '' : s)
    .replace(/[٠-٩]/g, function(c){ return String(c.charCodeAt(0) - 0x0660); })
    .replace(/[۰-۹]/g, function(c){ return String(c.charCodeAt(0) - 0x06F0); })
    .replace(/٫/g, '.').replace(/٬/g, ',');
};
/* حقول الأرقام (type=number أو inputmode=numeric/decimal): ما يُكتب أو يُلصق بالأرقام العربية يُدرج
   بالإنجليزية في موضع المؤشر. بدونه يرفض حقل number الأرقام العربية بصمت. الحقول النصية الحرة لا تُمَسّ. */
(function(){
  var AR_DIG = /[\u0660-\u0669\u06F0-\u06F9\u066B\u066C]/;
  function numeric(el){
    return el && el.tagName === 'INPUT' && (el.type === 'number' || /^(numeric|decimal)$/.test(el.inputMode || el.getAttribute('inputmode') || ''));
  }
  document.addEventListener('beforeinput', function(e){
    if(!numeric(e.target) || !e.data || !AR_DIG.test(e.data)) return;
    e.preventDefault();
    try{ document.execCommand('insertText', false, toLatinDigits(e.data)); }catch(err){}
  }, true);
  /* احتياط لمتصفح لا يدعم ما سبق (الحقول النصية فقط؛ حقل number لا يقبل القيمة أصلًا) */
  document.addEventListener('input', function(e){
    var el = e.target;
    if(!numeric(el) || el.type === 'number' || !AR_DIG.test(el.value)) return;
    var pos = el.selectionStart; el.value = toLatinDigits(el.value);
    try{ el.setSelectionRange(pos, pos); }catch(err){}
  }, true);
})();

/* ---------- الروابط الآتية من نوشن أو درايف أو المستخدم ----------
   safeUrl(u) لا يقبل إلا https: وhttp: وmailto: وtel: والمسارات النسبية، ويرجع '#' لغيرها
   (javascript: وdata: وvbscript: …). يُطبَّق على كل href وsrc من البيانات، ثم esc() إن دخل HTML.
   safeUrl(u, 'img') لوسم <img> فقط: يقبل أيضًا blob: وdata:image/… لأن الصور المرفوعة من الجهاز
   ولقطات الأفكار تُحفظ بهما، ولا تُنفَّذ فيهما سكربتات داخل <img>. */
window.safeUrl = function(u, kind){
  var s = String(u == null ? '' : u).trim();
  if(!s) return '#';
  /* المتصفح يتجاهل المسافات ومحارف التحكم داخل البادئة (java\tscript:)، فنفحصها بعد حذفها */
  var bare = s.replace(/[\u0000- \u007F-\u009F]+/g, '');
  var m = bare.match(/^([a-z][a-z0-9+.\-]*):/i);
  if(!m) return s;   /* مسار نسبي (أو //نطاق، ويرث http/https من الصفحة) */
  var scheme = m[1].toLowerCase();
  if(/^(https?|mailto|tel)$/.test(scheme)) return s;
  if(kind === 'img' && (scheme === 'blob' || /^data:image\/(png|jpe?g|gif|webp|avif|bmp);/i.test(bare))) return s;
  return '#';
};

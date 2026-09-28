/* نَسَق (NASAQ) — Copyright (c) 2026 Mohammed S. Ellouh. All rights reserved.
   ملكية خاصة: يُمنع النسخ أو التعديل أو إعادة النشر أو التقليد دون إذن كتابي. انظر ملف LICENSE. */
/* فحص تصميم نَسَق — الصقه في Console أي صفحة من المنصة، أو شغّله عبر Playwright.
   يعيد أرقامًا تُقارن بأهداف نظام التصميم. لا يغيّر شيئًا في الصفحة. */
(() => {
  /* ظاهر فعلًا: محتوى <details> المغلق (سوى summary) مخفي وإن كان له حجم في كروم */
  const vis = e => e.offsetParent !== null && getComputedStyle(e).visibility !== 'hidden' && !(e.closest('details:not([open])') && !e.closest('summary'));
  /* أي صيغة لون (rgb أو color(srgb …) أو oklab — ومنها ناتج color-mix) تُقرأ عبر لوحة رسم بكسل واحد */
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', {willReadFrequently: true});
  const rgba = c => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = 'rgba(0,0,0,0)'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = c => { const [r, g, b] = rgba(c).slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * r + .7152 * g + .0722 * b; };
  const bgOf = e => { while (e) { const c = getComputedStyle(e).backgroundColor;
    if (rgba(c)[3] > .5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
  const texts = [...document.querySelectorAll('body *')].filter(e => vis(e) &&
    [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
  const count = (arr) => arr.reduce((o, k) => (o[k] = (o[k] || 0) + 1, o), {});
  const lowContrast = [];
  texts.forEach(e => { const s = getComputedStyle(e), a = lum(s.color), b = lum(bgOf(e));
    if (a == null || b == null) return;
    const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
    if (ratio < (big ? 3 : 4.5) || +s.opacity < .6) lowContrast.push(`${e.innerText.trim().slice(0, 30)} (${ratio.toFixed(2)}, opacity ${s.opacity})`); });
  const controls = [...document.querySelectorAll('button,a[href],[role=button],input,select,textarea,summary')].filter(vis);
  const coarse = matchMedia('(pointer:coarse)').matches, minT = coarse ? 44 : 24;
  const small = controls.filter(e => { const r = e.getBoundingClientRect(); return r.width < minT || r.height < minT; })
    .map(e => `${(e.getAttribute('aria-label') || e.innerText || e.placeholder || e.tagName).trim().slice(0, 20)} ${Math.round(e.getBoundingClientRect().width)}×${Math.round(e.getBoundingClientRect().height)}`);
  const unlabeled = controls.filter(e => e.tagName === 'BUTTON' && !e.innerText.trim() && !e.getAttribute('aria-label') && !e.title).length;
  const emoji = [...document.querySelectorAll('h1,h2,h3,h4,button,label,summary,th,a')].filter(e => vis(e) && /\p{Extended_Pictographic}/u.test(e.innerText || '')).map(e => e.innerText.trim().slice(0, 20));
  const arabicDigits = texts.filter(e => /[٠-٩]/.test([...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(''))).length;
  const rules = []; const walk = rs => rs.forEach(r => { rules.push(r.cssText); if (r.cssRules) walk([...r.cssRules]); });
  [...document.styleSheets].forEach(s => { try { walk([...s.cssRules]); } catch (e) {} });
  const css = rules.join('\n');
  const scrollers = [...document.querySelectorAll('*')].filter(e => vis(e) && e.scrollHeight > e.clientHeight + 4 &&
    /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e !== document.documentElement && e !== document.body).length;
  const report = {
    fontSizes: Object.keys(count(texts.map(e => getComputedStyle(e).fontSize))).length + ' (الهدف ≤ 9)',
    fontFamilies: Object.keys(count(texts.map(e => getComputedStyle(e).fontFamily.split(',')[0]))).join(' / ') + ' (الهدف: Readex Pro + Alexandria)',
    fontWeights: Object.keys(count(texts.map(e => getComputedStyle(e).fontWeight))).join(' / ') + ' (الهدف: 400 / 600 / 700)',
    uniqueHexInCSS: new Set(css.match(/#[0-9a-f]{6}\b/gi)).size + ' (الهدف: الألوان في ملف الطابع فقط)',
    radii: Object.keys(count([...document.querySelectorAll('body *')].filter(vis).map(e => getComputedStyle(e).borderTopLeftRadius).filter(r => r !== '0px'))).length + ' (الهدف ≤ 6 في الطابع)',
    radiiDeclarations: new Set((css.match(/border-radius:\s*[^;]+/g) || [])).size + ' تصريحًا في كل ملفات CSS المحمّلة (للاطلاع)',
    lowContrast: lowContrast.length + ' (الهدف 0)', lowContrastSamples: lowContrast.slice(0, 10),
    smallTargets: `${small.length} من ${controls.length} أصغر من ${minT}px (الهدف 0)`, smallSamples: small.slice(0, 10),
    unlabeledIconButtons: unlabeled + ' (الهدف 0)',
    emojiInUI: emoji.length + ' (الهدف 0)', emojiSamples: emoji.slice(0, 10),
    arabicIndicDigits: arabicDigits + ' عنصر (الهدف 0 — الأرقام إنجليزية)',
    focusVisibleRules: (css.match(/:focus-visible/g) || []).length,
    outlineNone: (css.match(/outline:\s*(none|0)\b/g) || []).length + ' (كل واحدة تحتاج بديلًا بـ :focus-visible)',
    transitionAll: (css.match(/transition:\s*all/g) || []).length + ' (الهدف 0)',
    reducedMotion: /prefers-reduced-motion/.test(css) ? 'موجود' : 'مفقود',
    nestedScrollers: scrollers + ' (الهدف ≤ 1 في الشاشة)',
    pageHeight: document.documentElement.scrollHeight + 'px',
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth ? 'نعم — خلل' : 'لا',
  };
  console.table(report); return report;
})();

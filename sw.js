/* نَسَق (NASAQ) — Copyright (c) 2026 Mohammed S. Ellouh. All rights reserved.
   ملكية خاصة: يُمنع النسخ أو التعديل أو إعادة النشر أو التقليد دون إذن كتابي. انظر ملف LICENSE. */
/* نَسَق — عامل الخدمة (Service Worker)
 *
 * ثلاث وظائف:
 *  1. يجعل اللوح قابلًا للتثبيت كتطبيق على الهاتف والحاسوب.
 *  2. يفتح كل صفحة (اللوح، المشاريع، النبض) بآخر نسخة محفوظة منها إن انقطع الاتصال.
 *  3. الضغط على إشعار من نَسَق يعيدك إلى اللوح المفتوح (أو يفتحه).
 *
 * الصفحات وملفات JS وCSS الخاصة بالمنصة تُجلب "من الشبكة أولًا" دائمًا، كي يصل أي تعديل
 * فور رفعه ولا يعلق أحد على نسخة قديمة؛ والذاكرة احتياط عند انقطاع الاتصال فقط.
 * ولا يتدخّل أبدًا في طلبات الجسر أو نوشن أو الخطوط (نطاقات أخرى).
 *
 * عند تغيير قائمة SHELL أو منطق هذا الملف: ارفع رقم CACHE ليُستبدل القديم.
 */
const CACHE = 'daily-board-v5';   /* v4: صفحتا المشاريع والنبض والملفات المشتركة تعمل بلا اتصال */
const SHELL = [
  './',
  './index.html',
  './projects.html',
  './pulse.html',
  './nasaq-core.js',
  './nasaq-pulse.js',
  './nasaq-brand.js',
  './nasaq-art.js',
  './nasaq-theme.css',
  './nasaq-ui.css',
  './themes/classic.css',
  './themes/nasaq.css',
  './themes/nasaq360.css',
  './layouts/nav-side.css',
  './layouts/nav-top.css',
  './layouts/hero-page.css',
  './layouts/hero-brief.css',
  './layouts/hero-immersive.css',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
  /* مجلد brand/ لا تستعمله الصفحات وقت التشغيل: الشعار مضمَّن في nasaq-brand.js */
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if (isPage) {
    /* كل صفحة تُحفظ باسمها (بلا ?embed=1 أو ?org=…، فالملف واحد) وترجع من نسختها هي عند الانقطاع.
       no-cache: يتحقق من الخادم في كل فتح (رد 304 خفيف إن لم يتغيّر شيء) */
    const key = new URL(url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname, url).href;
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
          return res;
        })
        .catch(() => caches.match(key).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
          .then(hit => hit || Response.error()))
    );
    return;
  }

  /* ملفات JS وCSS الخاصة بالمنصة: من الشبكة أولًا ثم الذاكرة. تُطلب بـ ?v=… فتُحفظ نسخة واحدة
     باسم الملف بلا الاستعلام، ولا تتراكم نسخة لكل رقم إصدار */
  if (/\.(js|css)$/.test(url.pathname)) {
    const key = url.origin + url.pathname;
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
          return res;
        })
        .catch(() => caches.match(key).then(hit => hit || Response.error()))
    );
    return;
  }

  /* الأيقونات والملف التعريفي: من الذاكرة أولًا، ثم الشبكة */
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});

/* الضغط على إشعار: ركّز على تبويب نَسَق المفتوح، أو افتح اللوح */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const mine = list.find(c => new URL(c.url).origin === self.location.origin);
      return mine ? mine.focus() : self.clients.openWindow('./');
    })
  );
});

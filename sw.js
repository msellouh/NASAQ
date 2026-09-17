/* نَسَق — عامل الخدمة (Service Worker)
 *
 * ثلاث وظائف:
 *  ١. يجعل اللوح قابلًا للتثبيت كتطبيق على الهاتف والحاسوب.
 *  ٢. يفتح اللوح بآخر نسخة محفوظة إن انقطع الاتصال.
 *  ٣. الضغط على إشعار من نَسَق يعيدك إلى اللوح المفتوح (أو يفتحه).
 *
 * الصفحة تُجلب "من الشبكة أولًا" دائمًا، كي يصل أي تعديل فور رفعه ولا يعلق أحد
 * على نسخة قديمة. ولا يتدخّل أبدًا في طلبات الجسر أو نوشن أو الخطوط (نطاقات أخرى).
 *
 * عند تغيير قائمة SHELL أو منطق هذا الملف: ارفع رقم CACHE ليُستبدل القديم.
 */
const CACHE = 'daily-board-v2';   /* v2: أيقونات شعار نَسَق */
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon-32.png'
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
    /* no-cache: يتحقق من الخادم في كل فتح (رد 304 خفيف إن لم يتغيّر شيء) */
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
          return res;
        })
        .catch(() => caches.match('./index.html'))
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

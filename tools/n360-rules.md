# تصنيف قواعد «نَسَق 360» ونقلها (المرحلة 1)

كانت كلها داخل `<style>` في `index.html` بالبادئة `:root[data-palette="nasaq360"]`. صُنّفت آليًا ثم نُقلت:

| النوع | العدد | أين ذهب |
|---|---|---|
| ألوان وخطوط فقط | 58 | `themes/nasaq360.css` (طبقة theme) — تتحول قيمها إلى متغيرات في المرحلة 6 |
| بنيوية | 64 | `layouts/nav-top.css` أو `layouts/hero-immersive.css` (طبقة layouts) أو `nasaq-ui.css` (الحلقة والرسومات) |
| مختلطة | 45 | قُسمت: البنية إلى النمط، والمظهر إلى ملف الطابع بالمحدِّد نفسه (فلا تتغير الأولوية) |
| «حيوي» | 3 | حُذفت مع الطابع |

البادئة الجديدة حسب الغرض: `[data-nav="top"]` للتنقل العلوي، و`[data-hero="immersive"]` للواجهة، و`[data-orbit="on"]` لحلقة المدار، و`[data-art="glow"]` لرسومات التوهج. أي طابع مستقبلي يستعملها بسطر في `NASAQ_THEMES`.

قواعد `[data-palette^="nasaq"]` المشتركة بين نَسَق ونَسَق 360 (عناصر التحكم الحديثة) نُقلت كما هي إلى `nasaq-ui.css` بالمحدِّد `:root:is([data-palette="nasaq"],[data-palette="nasaq360"])` — تتحول إلى متغيرات في المرحلة 6.

**التحقق:** لقطات مجمّدة (وقت وعشوائية ثابتة، بلا حركة) لكل طابع ووضع وعرض وتبويب، قبل وبعد. الفرق الوحيد في «نَسَق 360»: زر الإعدادات في الشريط العلوي صار مثل جيرانه — كانت قاعدة `#settingsBtn` تغلب نمط الشريط بقوة المعرّف، والطبقات أنهت ذلك. تبويب المشاريع يتغير في كلاسيكي ونَسَق عمدًا: صار يتبع طابع المستخدم بدل «مَدار» الدائم.

| السطر الأصلي | الفئة | النوع | الوجهة | المحدِّد |
|---|---|---|---|---|
| 52 | حيوي (محذوف) | محذوفة | `—` | `:root:not([data-theme="light"])[data-palette="vibrant"]` |
| 92 | حيوي (محذوف) | محذوفة | `—` | `:root[data-palette="vibrant"]` |
| 105 | حيوي (محذوف) | محذوفة | `—` | `:root[data-theme="dark"][data-palette="vibrant"]` |
| 502 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card.has-photo .greet-media::after` |
| 861 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .fm-controls button` |
| 1348 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] body` |
| 1351 | رسومات التوهج | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] body::before` |
| 1353 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] :is(h1,h2,h3)` |
| 1354 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .greet-title` |
| 1355 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .greet-tagline` |
| 1356 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] :is(.pomo-time,.count,.sum-item b,.budget-overall .big,.exp` |
| 1360 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .orbit` |
| 1361 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .orbit::before` |
| 1364 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .orbit .brand-mark` |
| 1372 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock)` |
| 1373 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock) :is(.o-fill,.o-glint), :root[data-p` |
| 1378 | حلقة المدار | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock) .o-fill` |
| 1379 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock) .o-glint, :root[data-palette="nasaq` |
| 1383 | حلقة المدار | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit.clock,.ring-clock)::before` |
| 1384 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock) .o-now` |
| 1385 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock) .o-now b` |
| 1387 | حلقة المدار | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock).quiet .o-now b` |
| 1388 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .ring-clock .o-tick` |
| 1389 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .ring-clock .o-tick i` |
| 1391 | حلقة المدار | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock) :is(.o-fill,.o-now)` |
| 1392 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] :is(.orbit,.ring-clock) .o-glint,:root[data-palette="nasaq3` |
| 1397 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-glance` |
| 1398 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-glance .hero-meta` |
| 1399 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .ring-clock` |
| 1400 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .ring-clock::before` |
| 1409 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card.ring-big #heroRing` |
| 1441 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .greet-card.ring-big #heroRing.rest.prayer-now .o-now b` |
| 1459 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .greet-card.ring-big #heroRing.rest .o-now b` |
| 1464 | حلقة المدار | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .ring-clock.caps` |
| 1465 | حلقة المدار | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .ring-clock.caps::before` |
| 1467 | حلقة المدار | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .ring-clock.caps .o-fill` |
| 1468 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .ring-clock.caps :is(.o-fill,.o-glint)` |
| 1470 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .auth-brand .orbit` |
| 1471 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .auth-brand .orbit .brand-mark` |
| 1472 | مظهر الطابع | مختلطة | `—` | `:root[data-palette="nasaq360"] :is(.brand-name,.auth-brand h2)::after` |
| 1475 | مظهر الطابع | فارغة | `—` | `:root[data-palette="nasaq360"] .brand-latin::after` |
| 1478 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] :is(.add button,.pull button.go,.tools .primary,.modal .row` |
| 1483 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] :is(.add button,.pull button.go,.tools .primary,.modal .row` |
| 1488 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .tab.active, :root[data-palette="nasaq360"] .task-filters b` |
| 1491 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .rank` |
| 1493 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .tab.active` |
| 1496 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] :is(.add select,.pull select,.exp-add select)` |
| 1501 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .imp.a` |
| 1502 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .day-done.is-done` |
| 1505 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] :is(.progress .fill,.proj-bar i)` |
| 1508 | مظهر الطابع | مختلطة | `—` | `:root[data-palette="nasaq360"] .greet-card::before` |
| 1517 | مظهر الطابع | ألوان وخطوط | `—` | `:root[data-palette="nasaq360"] .close-day` |
| 1521 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .close-day .orbit` |
| 1522 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .close-day .close-mark` |
| 1523 | حلقة المدار | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .close-day .close-mark` |
| 1529 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .content` |
| 1530 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card` |
| 1539 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card::before` |
| 1545 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card.has-photo::before` |
| 1547 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card::after` |
| 1552 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-media` |
| 1555 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-media img` |
| 1559 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] :is(.greet-media .hero-empty,.hero-tools)` |
| 1561 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-media .hero-empty` |
| 1563 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-media .hero-empty:hover` |
| 1564 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] :is(.hero-add,.hero-del)` |
| 1566 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-text` |
| 1569 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-title` |
| 1571 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-tagline` |
| 1572 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-date` |
| 1573 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-meta` |
| 1579 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .plan-day` |
| 1581 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .plan-day:hover` |
| 1582 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .plan-day.done` |
| 1583 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .plan-day.done:hover` |
| 1584 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .plan-day:focus-visible` |
| 1586 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-dots:not(:empty)` |
| 1590 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-cue` |
| 1592 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-cue svg` |
| 1595 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-text > *` |
| 1596 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-text > :nth-child(2)` |
| 1597 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-text > :nth-child(3)` |
| 1598 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-text > :nth-child(4)` |
| 1599 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-text > :nth-child(5)` |
| 1602 | مظهر الطابع | مختلطة | `—` | `:root[data-palette="nasaq360"] .rv` |
| 1603 | مظهر الطابع | مختلطة | `—` | `:root[data-palette="nasaq360"] .rv.in` |
| 1605 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card` |
| 1606 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card.has-photo` |
| 1607 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card.has-photo .greet-media` |
| 1608 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-text` |
| 1609 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-title` |
| 1610 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-tagline` |
| 1611 | واجهة غامرة | ألوان وخطوط | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card::after` |
| 1613 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .plan-day` |
| 1614 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-cue` |
| 1616 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-media img` |
| 1617 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] :is(.greet-media .hero-empty,.hero-tools)` |
| 1618 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .hero-dots:not(:empty)` |
| 1621 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] :is(.greet-media img,.greet-text > *,.her` |
| 1622 | واجهة غامرة | مختلطة | `layouts/hero-immersive.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"][data-tab="board"] :is(.greet-text,.greet-media img)` |
| 1623 | مظهر الطابع | مختلطة | `—` | `:root[data-palette="nasaq360"] .rv` |
| 1632 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"]` |
| 1633 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .app` |
| 1634 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav` |
| 1638 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav::before` |
| 1640 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-over::before` |
| 1641 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid::before` |
| 1643 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-hidden` |
| 1644 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav:not(.tb-hidden)` |
| 1646 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav-brand` |
| 1647 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav .brand-latin` |
| 1648 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .brand-name` |
| 1649 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .sidenav .orbit` |
| 1650 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .sidenav .orbit .brand-mark` |
| 1651 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .brand-mark` |
| 1653 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav .tabbar` |
| 1654 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .tab` |
| 1655 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav .tab .ic` |
| 1656 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .tab:hover` |
| 1657 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .tab.active` |
| 1658 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .side-today` |
| 1660 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav-foot` |
| 1661 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .tabbar-sync` |
| 1662 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav .tabbar-sync #syncMsg` |
| 1663 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav .tabbar-sync :is(#syncTime,#stateNote)` |
| 1664 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav-actions` |
| 1665 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .icon-btn` |
| 1666 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .icon-btn:hover` |
| 1667 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .top-add` |
| 1669 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .top-add:hover` |
| 1670 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav :is(.tab,.icon-btn,.top-add):focus-visible` |
| 1672 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid` |
| 1673 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .brand-name` |
| 1674 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .brand-mark` |
| 1675 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .tab` |
| 1676 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .tab:hover` |
| 1677 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .tab.active` |
| 1678 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .icon-btn` |
| 1679 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .icon-btn:hover` |
| 1680 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav.tb-solid .tabbar-sync` |
| 1682 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .content` |
| 1683 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card` |
| 1685 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav .tabbar-sync` |
| 1688 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"]` |
| 1689 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav` |
| 1690 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .sidenav .orbit` |
| 1691 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .sidenav .orbit .brand-mark` |
| 1692 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .brand-name` |
| 1693 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .top-add` |
| 1695 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .tabbar` |
| 1697 | تنقل علوي | مختلطة | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .tab` |
| 1698 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .sidenav .tab .ic` |
| 1699 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav .tab.active` |
| 1700 | تنقل علوي | بنيوية | `layouts/nav-top.css` | `:root[data-palette="nasaq360"] .content` |
| 1701 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .content` |
| 1702 | واجهة غامرة | بنيوية | `layouts/hero-immersive.css` | `:root[data-palette="nasaq360"][data-tab="board"] .greet-card` |
| 1704 | تنقل علوي | ألوان وخطوط | `layouts/nav-top.css + themes/nasaq360.css` | `:root[data-palette="nasaq360"] .sidenav` |
| 1709 | رسومات التوهج | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art` |
| 1713 | رسومات التوهج | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art .ca-svg` |
| 1714 | رسومات التوهج | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art .ca-svg.is-dark` |
| 1716 | رسومات التوهج | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"]:not([data-theme="light"]) .card-art .ca-svg.is-dark` |
| 1717 | رسومات التوهج | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"]:not([data-theme="light"]) .card-art .ca-svg.is-light` |
| 1718 | رسومات التوهج | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"][data-theme="dark"] .card-art .ca-svg.is-dark` |
| 1719 | رسومات التوهج | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"][data-theme="dark"] .card-art .ca-svg.is-light` |
| 1721 | رسومات التوهج | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art.full` |
| 1722 | رسومات التوهج | مختلطة | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art.full::after` |
| 1724 | رسومات التوهج | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art .ob-arc` |
| 1725 | رسومات التوهج | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art` |
| 1726 | رسومات التوهج | ألوان وخطوط | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .card-art,:root[data-palette="nasaq360"] .card-art .ob-arc` |
| 1729 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .sidenav-brand .orbit` |
| 1730 | حلقة المدار | بنيوية | `nasaq-ui.css` | `:root[data-palette="nasaq360"] .sidenav-brand .orbit .brand-mark` |

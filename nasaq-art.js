/* نَسَق (NASAQ) — Copyright (c) 2026 Mohammed S. Ellouh. All rights reserved.
   ملكية خاصة: يُمنع النسخ أو التعديل أو إعادة النشر أو التقليد دون إذن كتابي. انظر ملف LICENSE. */
/* نَسَق — ألوان الرسومات المولَّدة بـ JavaScript في مكان واحد (NASAQ_ART)، مقسّمة حسب الطابع والوضع:
   رسومات «ابدأ مع نَسَق» ولوحاتها، وحلقة الساعة وأيقونة التبويب، ومشهد الواجهة، وألوان المشاريع،
   وألوان تقرير Medics (مواصفة التقرير المعتمد — لا تتبع الطابع).
   الأشكال واحدة، ويتغيّر أسلوبها حسب data-art:
     glow  (نَسَق 360): التوهج والتدرجات كما هي
     flat  (نَسَق):     تعبئة مسطحة بلونين (Teal وSaffron)، بلا filter ولا تدرجات
     ink   (كلاسيكي):   خطوط فقط بقلم الحبر، بلا تعبئة ولا توهج */
(function(){
  /* ---------- «ابدأ مع نَسَق»: مزاج المشهد لكل وضع ---------- */
  var GLOW = {
    dark:  {bg:['#0A0E2A','#14162A','#080914'], glow:.55, glowMid:.12, glowR:.6, soft:1, ring:'#FFFFFF', ringOp:.07, star:'#FFFFFF', starOp:1,
            card:'#1D2248', line:'#EEF1F7', ground:'#0B0D22', onHue:'#0A0E2A', track:'#FFFFFF', txt:'#EEF1F7', txt2:'#C4C9DD', hollow:'#14162A'},
    light: {tint:[.05,.11,.2], glow:.2, glowMid:.09, glowR:.85, soft:.45, ringOp:.12, starOp:.4,
            card:'#FFFFFF', line:'#14162A', onHue:'#FFFFFF', track:'#14162A', txt:'#14162A', txt2:'#5E6485', hollow:'#FFFFFF'}
  };
  /* ألوان ثابتة داخل المشاهد (علامة الإنجاز، مركز الهدف، الشمس، تدرّج حلقة التركيز) */
  var GLOW_SCENE = {check:'#34D6A0', checkMark:'#14162A', target:'#FFB36B', targetCore:'#FFC35A', sunTop:'#FFD98A', sunBottom:'#E07A3C',
                    ring1:'#1FC99A', ring2:'#00A5C2', idleTint:'#F6F7FA'};
  function mood(base, scene){ var o = {}, k; for(k in base) o[k] = base[k]; for(k in scene) o[k] = scene[k]; return o; }
  /* لون كل خطوة: art = لون المشهد، text = لون السطر الثاني من العنوان (تباين ≥ 4.5 على ستارته) */
  var GLOW_STEPS = {
    task:  {art:{dark:'#00B7D4', light:'#0096B8'}, text:{dark:'#00B7D4', light:'#007A99'}},
    pri:   {art:{dark:'#FF6B6E', light:'#E0474B'}, text:{dark:'#FF8A8C', light:'#C42B2E'}},
    plan:  {art:{dark:'#E8B24C', light:'#D6962E'}, text:{dark:'#E8B24C', light:'#88682E'}},
    habit: {art:{dark:'#34F5B5', light:'#0E9E74'}, text:{dark:'#34F5B5', light:'#087F5D'}},
    focus: {art:{dark:'#B69CF5', light:'#7C55D0'}, text:{dark:'#C9B5FF', light:'#6A43B8'}},
    idea:  {art:{dark:'#FFC35A', light:'#D68A12'}, text:{dark:'#FFC35A', light:'#8A5A00'}}
  };
  function sameSteps(art, text){ var o = {}; ['task','pri','plan','habit','focus','idea'].forEach(function(k){ o[k] = {art:art, text:text}; }); return o; }

  /* ---------- «نَسَق»: مسطح بلونين من الهوية ---------- */
  var FLAT = {
    light: mood({bg:['#F7F6F2','#F7F6F2','#F7F6F2'], glow:0, glowMid:0, glowR:.5, soft:0, ring:'#174C4F', ringOp:.07, star:'#D6A84F', starOp:0,
            card:'#FFFFFF', line:'#174C4F', ground:'#DCEBE9', onHue:'#FFFFFF', track:'#174C4F', txt:'#174C4F', txt2:'#5B6868', hollow:'#FFFFFF'},
           {check:'#D6A84F', checkMark:'#202A2A', target:'#D6A84F', targetCore:'#D6A84F', sunTop:'#D6A84F', sunBottom:'#D6A84F', ring1:'#174C4F', ring2:'#2F6F6B', idleTint:'#F7F6F2'}),
    dark:  mood({bg:['#0C1A1B','#0C1A1B','#0C1A1B'], glow:0, glowMid:0, glowR:.5, soft:0, ring:'#7CC4BC', ringOp:.08, star:'#E0B865', starOp:0,
            card:'#112426', line:'#E8EFEE', ground:'#152C2E', onHue:'#0C1A1B', track:'#7CC4BC', txt:'#E8EFEE', txt2:'#8EA5A3', hollow:'#0C1A1B'},
           {check:'#E0B865', checkMark:'#0C1A1B', target:'#E0B865', targetCore:'#E0B865', sunTop:'#E0B865', sunBottom:'#E0B865', ring1:'#7CC4BC', ring2:'#9FD4CD', idleTint:'#112426'})
  };
  /* ---------- «كلاسيكي»: قلم حبر أزرق على ورق، وتصحيح بالأحمر ---------- */
  var INK = {
    light: mood({bg:['#FBF8EF','#FBF8EF','#FBF8EF'], glow:0, glowMid:0, glowR:.5, soft:0, ring:'#1E3A6E', ringOp:.08, star:'#1E3A6E', starOp:0,
            card:'#FBF8EF', line:'#1E3A6E', ground:'#FBF8EF', onHue:'#FBF8EF', track:'#1E3A6E', txt:'#1E3A6E', txt2:'#3B4A63', hollow:'#FBF8EF', ink:'#1E3A6E', red:'#B3261E'},
           {check:'#B3261E', checkMark:'#B3261E', target:'#B3261E', targetCore:'#B3261E', sunTop:'#1E3A6E', sunBottom:'#1E3A6E', ring1:'#1E3A6E', ring2:'#1E3A6E', idleTint:'#FBF8EF'}),
    dark:  mood({bg:['#24221E','#24221E','#24221E'], glow:0, glowMid:0, glowR:.5, soft:0, ring:'#8FB0E8', ringOp:.1, star:'#8FB0E8', starOp:0,
            card:'#24221E', line:'#8FB0E8', ground:'#24221E', onHue:'#24221E', track:'#8FB0E8', txt:'#8FB0E8', txt2:'#C8C1B2', hollow:'#24221E', ink:'#8FB0E8', red:'#F08A7E'},
           {check:'#F08A7E', checkMark:'#F08A7E', target:'#F08A7E', targetCore:'#F08A7E', sunTop:'#8FB0E8', sunBottom:'#8FB0E8', ring1:'#8FB0E8', ring2:'#8FB0E8', idleTint:'#24221E'})
  };

  /* ---------- مشهد الواجهة ---------- */
  /* سماء كل فترة: لونان يُمزجان بلون الطابع فتبقى المشاهد من عائلته */
  var SKY = {
    fajr:['#2B2F66', '#C98A6B'], morning:['#9FD3E8', '#F2C98A'], noon:['#7FC3E3', '#CFE7F2'],
    afternoon:['#8FC0DA', '#E8B24C'], maghrib:['#E08A4C', '#6A43B8'], evening:['#3E2F7A', '#1D2150'], night:['#141736', '#0B0D22']
  };
  /* «نَسَق»: سماء من ألوان الهوية — Teal إلى Mid Teal ليلًا، وTeal Light إلى العاجي نهارًا، وقمر أو شمس بالزعفران */
  var NIGHT = ['#174C4F', '#2F6F6B'], DAY = ['#DCEBE9', '#F7F6F2'];
  var SKY_NASAQ = {fajr:NIGHT, morning:DAY, noon:DAY, afternoon:DAY, maghrib:['#2F6F6B', '#DCEBE9'], evening:NIGHT, night:NIGHT};

  window.NASAQ_ART = {
    nasaq360: {
      light: GLOW.light, dark: GLOW.dark, scene: GLOW_SCENE, steps: GLOW_STEPS,
      ring: {light:{bg:'#FFFFFF', track:'rgba(20,22,42,.12)', grad:['#0E9E74','#0086A8','#6A43B8'], text:'#14162A'},
             dark: {bg:'#14162A', track:'rgba(238,241,247,.18)', grad:['#34F5B5','#00B7D4','#7B55CC'], text:'#EEF1F7'},
             dot:'#D6A84F', dotRGB:[214,168,79], quiet:'#9AA1BE', quietRGB:[154,161,190]},
      hero: {sky:SKY, mix:.22, accent:'#00B7D4', ink:'#14162A', glowDay:'#FFE9A8', glowNight:'#FFF6D8', star:'#FFFFFF'},
      close: '#D6A84F'
    },
    nasaq: {
      light: FLAT.light, dark: FLAT.dark, scene: {}, steps: sameSteps({dark:'#7CC4BC', light:'#174C4F'}, {dark:'#7CC4BC', light:'#174C4F'}),
      ring: {light:{bg:'#FFFFFF', track:'rgba(23,76,79,.12)', grad:['#174C4F','#2F6F6B','#2F6F6B'], text:'#174C4F'},
             dark: {bg:'#0C1A1B', track:'rgba(232,239,238,.18)', grad:['#7CC4BC','#9FD4CD','#9FD4CD'], text:'#E8EFEE'},
             dot:'#D6A84F', dotRGB:[214,168,79], quiet:'#8EA5A3', quietRGB:[142,165,163]},
      hero: {sky:SKY_NASAQ, mix:0, accent:'#D6A84F', ink:'#174C4F', glowDay:'#D6A84F', glowNight:'#E0B865', star:'#F7F6F2'},
      close: '#D6A84F'
    },
    classic: {
      light: INK.light, dark: INK.dark, scene: {}, steps: sameSteps({dark:'#8FB0E8', light:'#1E3A6E'}, {dark:'#8FB0E8', light:'#1E3A6E'}),
      ring: {light:{bg:'#FBF8EF', track:'rgba(30,58,110,.14)', grad:['#1E3A6E','#1E3A6E','#1E3A6E'], text:'#1E3A6E'},
             dark: {bg:'#1B1A17', track:'rgba(143,176,232,.2)', grad:['#8FB0E8','#8FB0E8','#8FB0E8'], text:'#8FB0E8'},
             dot:'#B3261E', dotRGB:[179,38,30], quiet:'#5F5B52', quietRGB:[95,91,82]},
      /* الكلاسيكي لا يعرض المشهد في واجهته (المرحلة 3)؛ حتى ذلك الحين يُشتق من ألوان الطابع */
      hero: {sky:SKY, mix:.22, accent:null, ink:null, glowDay:'#FFE9A8', glowNight:'#FFF6D8', star:'#FFFFFF', fallbackAccent:'#1F6F8B', fallbackInk:'#14312A'},
      close: '#B3261E'
    },
    /* ألوان رموز المشاريع في المهام (ثابتة لكل مشروع مهما كان الطابع، كي يعرفها المستخدم بلونها) */
    projects: ['#2F6F6B','#C99A45','#668A9A','#C87861','#82758E','#6F9B83','#D6A84F','#8A7F6E'],
    /* تقرير Medics المعتمد (تقرير Al-Cela) — مواصفة المستند المصدَّر، لا تتبع الطابع */
    report: {teal:'#006C75', tealDark:'#005057', cyan:'#00B2C1', mid:'#008F9B', pale:'#81D0D9', grey:'#44546A', white:'#FFFFFF', black:'#000000',
             link:'#0563C1', gold:'#DCAC18', page:'#FFC000', sheetBg:'#E9ECEF', hint:'#8A94A0', photoBg:'#EEF3F4',
             done1:'#FCE4D6', done2:'#E2EFDA', done3:'#BCF6E4', planned:'#D9D9D9'}
  };

  var root = document.documentElement;
  /* ألوان الطابع والوضع الحاليين، مع أسلوب الرسم */
  window.nasaqArt = function(forceMode){
    var p = root.getAttribute('data-palette'), t = NASAQ_ART[p] || NASAQ_ART.nasaq;
    var m = forceMode || ((window.NasaqTheme && NasaqTheme.isDark()) ? 'dark' : 'light');
    return {palette:p, mode:m, style:root.getAttribute('data-art') || 'glow', t:t, mood:mood(t[m], t.scene), ring:t.ring, hero:t.hero, steps:t.steps, close:t.close};
  };

  /* ---------- أسلوب الرسم: الشكل واحد، والأسلوب حسب data-art ---------- */
  function attr(tag, name){ var m = tag.match(new RegExp('\\s' + name + '="([^"]*)"')); return m ? m[1] : null; }
  function setAttr(tag, name, val){
    return attr(tag, name) != null ? tag.replace(new RegExp('(\\s' + name + '=")[^"]*(")'), '$1' + val + '$2') : tag.replace(/(\/?>)$/, ' ' + name + '="' + val + '"$1');
  }
  window.nasaqArtStyle = function(svg, style, P){
    if(style === 'glow' || !style) return svg;
    /* التوهّجات المموّهة وطبقة الوهج تُحذف في الأسلوبين */
    svg = svg.replace(/<(circle|ellipse|rect|path)\b[^>]*filter="url\(#[^)]*\)"[^>]*\/>/g, '')
             .replace(/<rect\b[^>]*fill="url\(#[^)]*-gl\)"[^>]*\/>/g, '')
             .replace(/<filter\b[\s\S]*?<\/filter>/g, '');
    if(style === 'flat'){
      return svg.replace(/fill="url\(#[^)]*-bg\)"/g, 'fill="' + P.bg[0] + '"')
                .replace(/(fill|stroke)="url\(#[^)]*-(sun)\)"/g, '$1="' + P.sunTop + '"')
                .replace(/(fill|stroke)="url\(#[^)]*-(ring)\)"/g, '$1="' + P.ring1 + '"');
    }
    /* ink: خطوط بالحبر فقط */
    return svg.replace(/fill="url\(#[^)]*-bg\)"/g, 'fill="' + P.bg[0] + '"')
      .replace(/<(rect|circle|path|ellipse)\b[^>]*\/>/g, function(tag){
        if(/width="(240|2880)"/.test(tag)) return tag;                 /* الخلفية: ورقة */
        var fill = attr(tag, 'fill'), stroke = attr(tag, 'stroke');
        if(fill && fill !== 'none'){
          tag = setAttr(tag, 'fill', 'none');
          if(!stroke) tag = setAttr(setAttr(tag, 'stroke', P.ink), 'stroke-width', '1.6');
        }
        if(stroke) tag = setAttr(tag, 'stroke', /url\(/.test(stroke) ? P.ink : (stroke === P.red ? P.red : P.ink));
        return tag.replace(/\sfill-opacity="[^"]*"/, '');
      })
      .replace(/<text\b([^>]*)fill="[^"]*"/g, '<text$1fill="' + P.ink + '"')
      .replace(/<g\b([^>]*)fill="(?!none)[^"]*"/g, '<g$1fill="none" stroke="' + P.ink + '"');
  };
})();

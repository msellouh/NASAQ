#!/usr/bin/env bash
# نَسَق (NASAQ) — Copyright (c) 2026 Mohammed S. Ellouh. All rights reserved.
# ملكية خاصة: يُمنع النسخ أو التعديل أو إعادة النشر أو التقليد دون إذن كتابي. انظر ملف LICENSE.
#
# حارس الطوابع — شغّله قبل أي رفع:  bash tools/check-themes.sh
# يفشل (رمز خروج 1) إذا:
#   1) ظهر data-palette= داخل أي <style> في الصفحات الثلاث (قواعد الطابع مكانها themes/ وlayouts/ وnasaq-ui.css)
#   2) ظهر لون صريح (#xxxxxx) في CSS خارج themes/ و nasaq-theme.css، أو في JS خارج nasaq-art.js
#      (الاستثناء: nasaq-brand.js — ألوان الشعار الأصلية ثابتة بقاعدة صارمة)
#   3) احتوى ملف طابع على display: أو position: أو width: أو height:
#   4) بقي تعليق «TODO: يتحول إلى متغير» (يُسمح به حتى المرحلة 6 بالخيار --allow-todo)
cd "$(dirname "$0")/.." || exit 2
fail=0; ALLOW_TODO=0; [ "$1" = "--allow-todo" ] && ALLOW_TODO=1
say(){ printf '%s\n' "$*"; }

# 1) data-palette داخل <style>
for f in index.html projects.html pulse.html; do
  n=$(python - "$f" <<'PY'
import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
print(sum(len(re.findall(r'data-palette\s*[\^]?=', m)) for m in re.findall(r'<style[^>]*>([\s\S]*?)</style>', s)))
PY
)
  [ "$n" != "0" ] && { say "✗ $f: $n قاعدة data-palette داخل <style>"; fail=1; }
done

# 2) ألوان صريحة خارج أماكنها
hex_css=$(python - <<'PY'
import re,glob,os
files=[f for f in glob.glob('*.html')+glob.glob('*.css')+glob.glob('layouts/*.css') if not f.startswith('themes') and f!='nasaq-theme.css']
tot=0
for f in files:
    s=open(f,encoding='utf-8').read()
    if f.endswith('.html'):   # CSS الصفحة: داخل <style> وفي style="…"
        s='\n'.join(re.findall(r'<style[^>]*>([\s\S]*?)</style>',s)+re.findall(r'style="([^"]*)"',s))
    n=len(re.findall(r'#[0-9a-fA-F]{6}\b',s))
    if n: print(f'   {f}: {n}'); tot+=n
print('TOTAL',tot)
PY
)
n=$(printf '%s\n' "$hex_css" | awk '/^TOTAL/{print $2}')
[ "$n" != "0" ] && { say "✗ ألوان صريحة في CSS خارج themes/ و nasaq-theme.css: $n"; printf '%s\n' "$hex_css" | grep -v '^TOTAL'; fail=1; }
hex_js=$(python - <<'PY'
import re,glob
tot=0
for f in glob.glob('*.html')+glob.glob('*.js'):
    if f in ('nasaq-art.js','nasaq-brand.js','sw.js'): continue
    s=open(f,encoding='utf-8').read()
    if f.endswith('.html'): s='\n'.join(re.findall(r'<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)</script>',s))
    s='\n'.join(l for l in s.split('\n') if 'themeColor:' not in l)   # لون شريط الحالة معرَّف في NASAQ_THEMES عمدًا
    n=len(re.findall(r'#[0-9a-fA-F]{6}\b',s))
    if n: print(f'   {f}: {n}'); tot+=n
print('TOTAL',tot)
PY
)
n=$(printf '%s\n' "$hex_js" | awk '/^TOTAL/{print $2}')
[ "$n" != "0" ] && { say "✗ ألوان صريحة في JS خارج nasaq-art.js: $n"; printf '%s\n' "$hex_js" | grep -v '^TOTAL'; fail=1; }

# 3) بنية في ملفات الطوابع
for f in themes/*.css; do
  n=$(grep -oE '(^|[;{[:space:]])(display|position|width|height)[[:space:]]*:' "$f" | wc -l)
  [ "$n" != "0" ] && { say "✗ $f: $n خاصية بنيوية (display/position/width/height)"; fail=1; }
done

# 4) TODO المرحلة 6
n=$(grep -rl "TODO: يتحول إلى متغير" --include=*.css . 2>/dev/null | wc -l)
if [ "$n" != "0" ]; then
  if [ $ALLOW_TODO = 1 ]; then say "… ملفات فيها TODO تحويل إلى متغيرات: $n (مسموح مؤقتًا)"; else say "✗ ملفات فيها TODO تحويل إلى متغيرات: $n"; fail=1; fi
fi

[ $fail = 0 ] && say "✓ حارس الطوابع: لا مخالفات" || say "حارس الطوابع: توجد مخالفات"
exit $fail

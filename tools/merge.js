// Usage: node tools/merge.js g4.json g5.json ...  — appends new words to words.js (skips duplicate words/pictures)
const fs = require('fs'), path = require('path');
const wf = path.join(__dirname, '..', 'words.js');
const W = new Function(fs.readFileSync(wf, 'utf8') + ';return WORDS')();
const ni = s => s.replace(/\uFE0F/g, ''); const seenEn = new Set(W.map(w => w.en.toLowerCase())), seenImg = new Set(W.map(w => ni(w.img)));
const V = 'аеёиоуыэюя';
const fixStress = s => s.split(' ').map(t => {
  const low = t.toLowerCase(); const n = [...low].filter(c => V.includes(c)).length;
  const i = [...t].findIndex(c => V.toUpperCase().includes(c));
  return n > 1 && i >= 0 ? low.slice(0, i) + low[i].toUpperCase() + low.slice(i + 1) : low;
}).join(' ');
const skipped = [];
for (const f of process.argv.slice(2)) {
  for (const w of JSON.parse(fs.readFileSync(f, 'utf8'))) {
    if (!w.en || !w.ru || !w.img) { skipped.push([w.en, 'empty']); continue; }
    if (seenEn.has(w.en.toLowerCase())) { skipped.push([w.en, 'dup word']); continue; }
    if (seenImg.has(ni(w.img))) { skipped.push([w.en, 'dup pic ' + w.img]); continue; }
    seenEn.add(w.en.toLowerCase()); seenImg.add(ni(w.img));
    W.push({ en: w.en, ru: w.ru.toLowerCase(), img: w.img, tr: (w.tr || '').replace(/^[\/\[]|[\/\]]$/g, ''), trRu: fixStress(w.trRu || ''), cat: w.cat, lvl: +w.lvl, ...(w.ro ? { ro: w.ro.replace(/ş/g,'ș').replace(/ţ/g,'ț'), roRu: fixStress(w.roRu || '') } : {}) });
  }
}
fs.writeFileSync(wf, fs.readFileSync(wf, 'utf8').replace(/const WORDS = \[[\s\S]*\];\s*$/, 'const WORDS = [\n' + W.map(w => '  ' + JSON.stringify(w)).join(',\n') + '\n];\n'));
const by = {}; W.forEach(w => by[w.lvl] = (by[w.lvl] || 0) + 1);
console.log('total', W.length, by, '\nskipped', JSON.stringify(skipped));

// Usage: node tools/build.js [tr.json]
// 1) optionally merges transcriptions {en:[ipa, ru]} into words.js
// 2) builds english-cards.html — one self-contained file (words inlined)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..');
const wf = path.join(dir, 'words.js');
const WORDS = new Function(fs.readFileSync(wf, 'utf8') + ';return WORDS')();
if (process.argv[2]) {
  const tr = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  let miss = [];
  WORDS.forEach(w => { const t = tr[w.en]; if (t) { w.tr = t[0].replace(/^[\/\[]|[\/\]]$/g, ''); w.trRu = t[1]; } else miss.push(w.en); });
  if (miss.length) console.log('no transcription:', miss);
  fs.writeFileSync(wf,
    '// Словарь для карточек. Добавляйте слова в том же формате.\n' +
    '// en — слово, ru — перевод, img — эмодзи или ссылка на картинку, tr — транскрипция, trRu — русскими буквами, cat — тема, lvl — класс (1-3)\n' +
    'const WORDS = [\n' + WORDS.map(w => '  ' + JSON.stringify({en:w.en,ru:w.ru,img:w.img,tr:w.tr||'',trRu:w.trRu||'',cat:w.cat,lvl:w.lvl})).join(',\n') + '\n];\n');
}
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const words = fs.readFileSync(wf, 'utf8');
const animF = path.join(dir, 'anim.js'), anim = fs.existsSync(animF) ? fs.readFileSync(animF, 'utf8') : 'const ANIM = {};';
const out = html.replace('<script src="words.js"></script>', () => '<script>\n' + words + '</script>')
                .replace('<script src="anim.js"></script>', () => '<script>\n' + anim + '\n</script>')
                .replace('<script src="audio_ro.js"></script>', () => '<script>\n' + (fs.existsSync(path.join(dir,'audio_ro.js')) ? fs.readFileSync(path.join(dir,'audio_ro.js'),'utf8') : 'const AUDIO_RO = {};') + '\n</script>');
fs.writeFileSync(path.join(dir, 'english-cards.html'), out);
console.log('words:', WORDS.length, '-> english-cards.html', out.length, 'bytes');

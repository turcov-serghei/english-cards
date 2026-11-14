// Usage: node tools/merge_ro.js ro.json  — adds Romanian {en:[ro, roRu]} to words.js, applying manual fixes below
const fs=require('fs'),wf=__dirname+'/../words.js';
const src=fs.readFileSync(wf,'utf8');const W=new Function(src+';return WORDS')();
const RO=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
// manual corrections: [romanian, russian-letters] (null = keep)
const FIX={
 mushroom:['ciupercă','чупЕркэ'], porridge:['terci','терч'], pen:['pix','пикс'], crayon:['creion colorat','крейОн колорАт'],
 computer:['computer','компьЮтер'], watch:['ceas de mână','час де мЫнэ'], flask:['eprubetă','епрубЕтэ'], foot:['talpă','тАлпэ'],
 watermelon:['pepene verde','пЕпене вЕрде'], melon:['pepene galben','пЕпене гАлбен'], bagel:['bagel','бЕйгл'], dumpling:['colțunaș','колцунАш'],
 crossing:['trecere de pietoni','трЕчере де пиетОнь'], peacock:['păun','пэУн'], skis:[null,'скИурь'], cricket:[null,'крИкет'],
 genie:['duh','дух'], lock:[null,'лАкэт'], plug:['ștecher','штЕкер'], sloth:[null,'лЕнеш'], monorail:['monorail','монорЕйл'],
 shorts:[null,'пантАлонь скурць'], coat:[null,'палтОн'], swan:[null,'лЕбэдэ'], squirrel:[null,'вевЕрицэ'], cherry:[null,'чирЯшэ'],
 peach:[null,'пьЕрсикэ'], frog:[null,'брОаскэ'], turtle:[null,'брОаскэ цестОасэ'], rabbit:[null,'Йепуре'], lion:[null,'лЕу'],
 lemon:[null,'лэмЫе'], onion:[null,'чЯпэ'], chocolate:[null,'чоколАтэ'], candy:[null,'бомбОанэ'], honey:[null,'мьЕре'],
 heart:[null,'Инимэ'], crown:[null,'корОанэ'], pencil:[null,'крейОн'], backpack:[null,'рукзАк'], school:[null,'шкОалэ'],
 letter:[null,'скрисОаре'], scissors:[null,'фОарфече'], window:[null,'ферЯстрэ'], toy:[null,'жукэрИе'], 'yo-yo':[null,'йо-йО'],
 truck:[null,'камиОн'], taxi:[null,'тАкси'], helicopter:[null,'еликОптер'], tractor:[null,'трАктор'], sun:[null,'сОаре'],
 snow:[null,'зэпАдэ'], flower:[null,'флОаре'], sleep:[null,'дормИ'], eat:[null,'мынкА'], sing:[null,'кынтА'], dance:[null,'дансА'],
 cook:[null,'гэтИ'], wash:[null,'спэлА'], smile:[null,'зымбИ'], think:[null,'гындИ'], clap:[null,'аплаудА'], wave:[null,'флутурА'],
 run:[null,'алергА'], builder:[null,'констрУктор'], basketball:[null,'бАскет'], medal:[null,'медАлие'], surf:[null,'сёрф'],
 pumpkin:[null,'довлЯк'], fireworks:[null,'артифИчий'], spider:[null,'пэЯнжен'], dolphin:[null,'делфИн'], kangaroo:[null,'кАнгур'],
 octopus:[null,'каракАтицэ'], rhino:[null,'риночЕр'], toothbrush:[null,'периУцэ де дИнць'], spoon:[null,'лИнгурэ'], teapot:[null,'чАйник'],
 cinema:[null,'чинемА'], supermarket:[null,'супермАркет'], maths:[null,'матемАтикэ'], umbrella:[null,'умбрЕлэ'], magnet:[null,'магнЕт'],
 'palm tree':[null,'палмиЕр'], stadium:[null,'стадиОн'], saw:[null,'ферэстрЭу'], screwdriver:[null,'шурубЕлницэ'], hockey:[null,'хокЕй'],
 photographer:[null,'фотогрАф'], programmer:[null,'програматОр'], banknote:[null,'банкнОтэ'], statue:[null,'статУие'], badminton:[null,'бадминтОн'],
 coconut:[null,'кОкос'], chestnut:[null,'кастАнэ'], croissant:[null,'круасАн'], syringe:[null,'серИнгэ'], razor:[null,'брич'],
 beaver:[null,'кастОр'], anchor:[null,'Анкорэ'], cassette:[null,'касЕтэ'], judge:[null,'жудекэтОр'], superhero:[null,'суперерОу'],
 witch:[null,'врэжитОаре'], pepper:['ardei','ардЕй'], shrimp:['crevete','кревЕте'], log:[null,'буштЯн'], goldfish:[null,'пЕште аурИу'],
 hammer:[null,'чокАн'], bucket:[null,'гэлЯтэ'], kayak:[null,'каЯк'], spaceship:[null,'нАвэ спациАлэ'], confetti:[null,'конфЕти'],
 river:[null,'рЫу'], anger:[null,'мынИе'], DVD:[null,'де-ве-дЕ'], bag:[null,'джЯнтэ'], paint:[null,'вопсЯ'], couch:[null,'канапЯ'],
 key:[null,'кЕе'], coffee:[null,'кафЯ'], white:[null,'алб'], film:[null,'филм'], mosquito:[null,'цынцАр']
};
let miss=[];
W.forEach(w=>{const r=RO[w.en]; if(!r){miss.push(w.en);return}
  let [ro,ru]=r; const f=FIX[w.en]; if(f){ if(f[0]) ro=f[0]; if(f[1]) ru=f[1]; }
  w.ro=ro.replace(/ş/g,'ș').replace(/ţ/g,'ț').replace(/Ş/g,'Ș').replace(/Ţ/g,'Ț'); w.roRu=ru;});
fs.writeFileSync(wf,src.replace(/const WORDS = \[[\s\S]*\];\s*$/,'const WORDS = [\n'+W.map(w=>'  '+JSON.stringify(w)).join(',\n')+'\n];\n'));
const c=Object.create(null);W.forEach(w=>{const k=(w.ro||'').toLowerCase();(c[k]=c[k]||[]).push(w.en)});
console.log('missing',miss,'dup ro',Object.entries(c).filter(([,v])=>v.length>1));

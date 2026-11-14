// Manual corrections to words.js: F = field fixes by word, DEL = words to remove. Safe to re-run.
const fs=require('fs'),wf=__dirname+'/../words.js';
const src=fs.readFileSync(wf,'utf8');const W=new Function(src+';return WORDS')();
const F={
 Christmas:{roRu:'крэчЮн'}, 'Santa Claus':{roRu:'мош крэчЮн'},
 web:{en:'spider web',ru:'паутина',tr:'ˈspaɪdə web',trRu:'спАйдэ веб',ro:'pânză de păianjen',roRu:'пЫнзэ де пэЯнжен'},
 clipboard:{ru:'планшет для бумаг'}, herb:{ro:'plantă aromatică',roRu:'плАнтэ аромАтикэ'}, bean:{trRu:'бин'},
 heels:{ro:'pantofi cu toc',roRu:'пантОфь ку ток'}, radar:{trRu:'рЭйда'}, extinguisher:{trRu:'икстИнгвишэ'}, target:{trRu:'тАгит'},
 thunderstorm:{ro:'furtună cu tunete',roRu:'фуртУнэ ку тУнете'}, currency:{ro:'valută',roRu:'валУтэ'}, goose:{trRu:'гус'},
 colleague:{tr:'ˈkɒliːɡ'}, training:{ru:'тренировка',ro:'antrenament',roRu:'антренамЕнт'}, accommodation:{trRu:'экомэдЕйшн'},
 signature:{trRu:'сИгнэчэ',cat:'Офис и работа'}, excursion:{roRu:'экскУрсие'}, export:{roRu:'экспОрт'}, coach:{trRu:'коуч'},
 heatwave:{ro:'caniculă',roRu:'каникУлэ'}, shelter:{roRu:'адэпОст'}, earthquake:{roRu:'кутрЕмур'}, ruins:{ro:'ruine',roRu:'руИне'},
 novel:{roRu:'ромАн'}, danger:{roRu:'перИкол'}, victory:{roRu:'виктОрие'}, love:{roRu:'дрАгосте'}, boredom:{roRu:'пликтисЯлэ'},
 mailbox:{roRu:'кутИе поштАлэ'}, gratitude:{roRu:'рекуноштИнцэ'}, amphora:{roRu:'Амфорэ'}, falafel:{roRu:'фалАфел'},
 ATM:{trRu:'эй ти Эм'}, scales:{cat:'Инструменты'}
};
const DEL=['lorry','wine','lottery','coffin','urn','place of worship','dharma wheel','Star of David','menorah','rosary','crescent','cross','yin and yang','search','task','bargain','border','coupon'];
for(const d of DEL){const i=W.findIndex(w=>w.en===d);if(i>=0)W.splice(i,1)}
let n=0;W.forEach(w=>{if(F[w.en]){Object.assign(w,F[w.en]);n++}});
fs.writeFileSync(wf,src.replace(/const WORDS = \[[\s\S]*\];\s*$/,'const WORDS = [\n'+W.map(w=>'  '+JSON.stringify(w)).join(',\n')+'\n];\n'));
console.log('fixed',n,'of',Object.keys(F).length);

export const chapters = [
 {start:0,end:.15,label:'The beginning',title:'Natural results begin beneath the surface.',subtitle:'Every follicle matters.'},
 {start:.15,end:.35,label:'The donor area',title:'Healthy graft selection',subtitle:'Strong follicular units are carefully selected from the donor area.'},
 {start:.35,end:.50,label:'The extraction',title:'Precision extraction',subtitle:'Preserving the integrity of each follicular unit.'},
 {start:.50,end:.65,label:'The journey',title:'Small in scale.\nExtraordinary in potential.',subtitle:'A single graft. Carefully preserved. Precisely placed.'},
 {start:.65,end:.82,label:'The placement',title:'Direction.\nAngle.\nDensity.',subtitle:'Each graft is positioned to follow the natural growth pattern.'},
 {start:.82,end:.95,label:'The transformation',title:'Designed one graft at a time.',subtitle:'Individual precision. Naturally harmonious results.'},
 {start:.95,end:1,label:'The result',title:"A natural hairline isn't created by chance.",subtitle:"It's designed."}
];
export const clamp = x => Math.max(0,Math.min(1,x));
export const smooth = (a,b,p) => {let t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
export function chapterAt(p){return chapters.findIndex((c,i)=>p>=c.start&&(p<c.end||i===6))}
export function pose(p){
 const release=smooth(.43,.51,p),travel=smooth(.51,.66,p),insert=smooth(.71,.81,p);
 return {release,travel,insert,cut:smooth(.10,.24,p),donor:1-smooth(.50,.59,p),recipient:smooth(.60,.68,p),growth:smooth(.82,.97,p),graftX:travel*1.3,graftY:release*2.6-insert*2.6,graftAngle:travel*.18+insert*.73};
}

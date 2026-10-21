'use strict';
const $ = (selector) => document.querySelector(selector);
const clamp = (number, min = 0, max = 1) => Math.min(max, Math.max(min, number));
const mix = (a, b, value) => a + (b - a) * value;
const smooth = (value) => value * value * (3 - 2 * value);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = $('.hero');
const gallery = $('.gallery-scene');
const detail = $('.detail-scene');
const clients = $('.clients-scene');
const founder = $('.founder');
const sections = [hero, gallery, detail, clients, founder];
let metrics = new Map();
let ticking = false;
let currentChapter = -1;
const chapters = [
  {label:'01 / LA MUESTRA', title:'El detalle<br>hace la<br>diferencia.', description:'Muestras metálicas para laboratorios y empresas. Cada trabajo empieza por entender qué pieza necesitás y para qué la vas a usar.', focus:'Muestras y piezas pequeñas', start:'Tu plano, muestra o necesidad'},
  {label:'02 / EL MATERIAL', title:'Cada superficie<br>cuenta una<br>historia.', description:'Del material en bruto al acabado de la pieza. La forma, las medidas y la terminación se conversan antes de comenzar cada trabajo.', focus:'Trabajo sobre metales', start:'Material y requisitos a definir'},
  {label:'03 / TU PROYECTO', title:'La pieza justa.<br>Para tu<br>necesidad.', description:'Una muestra o una pequeña serie. Compartí el uso, la cantidad y los detalles de tu proyecto para evaluar juntos el trabajo.', focus:'Atención a empresas', start:'Una conversación técnica'}
];
function measure() {
  metrics = new Map(sections.map(element => [element, {top:element.getBoundingClientRect().top + window.scrollY, height:element.offsetHeight}]));
  requestTick();
}
function progress(element) {
  const dimensions = metrics.get(element);
  return clamp((window.scrollY - dimensions.top) / Math.max(1, dimensions.height - window.innerHeight));
}
function render() {
  ticking = false;
  if (reduced.matches || !metrics.size) return;
  const mobile = window.innerWidth <= 680;
  const hp = smooth(progress(hero));
  const assembly = smooth(clamp((hp - .2) / .7));
  $('.hero-copy').style.opacity = 1 - clamp(hp / .55);
  $('.hero-copy').style.transform = `translateY(${-hp * 50}px)`;
  $('.hero-resolution').style.opacity = clamp((hp - .55) / .3);
  $('.hero-resolution').style.transform = `translateY(${(1 - assembly) * 35}px)`;
  $('.hero-objects').style.transform = mobile ? `translate(${-assembly * 12}%,${assembly * 32}%) scale(${1 - assembly * .18})` : `translateX(${-assembly * 1}%)`;
  $('.piece-a').style.transform = `translate(${mix(0,-12,assembly)}%,${mix(0,12,assembly)}%) rotate(${mix(8,-21,assembly)}deg) rotateY(${Math.sin(hp * Math.PI) * 22}deg)`;
  $('.piece-b').style.transform = `translate(${mix(0,34,assembly)}%,${mix(0,-39,assembly)}%) rotate(${mix(72,110,assembly)}deg) rotateY(${-Math.sin(hp * Math.PI) * 22}deg)`;
  $('.piece-c').style.transform = `translate(${mix(0,-76,assembly)}%,${mix(0,-10,assembly)}%) rotate(${mix(-15,45,assembly)}deg) scale(${mix(1,.8,assembly)})`;
  $('.technical-circle').style.transform = `rotate(${hp * 90}deg) scale(${1 - hp * .08})`;
  const gp = smooth(clamp(progress(gallery) / .74));
  $('.product-grid').style.transform = `perspective(1200px) translateZ(${mix(-260,0,gp)}px) scale(${mix(.85,1,gp)})`;
  $('.product-grid').style.opacity = mix(.5,1,gp);
  const dp = progress(detail);
  const reveal = smooth(clamp(dp / .26));
  $('.detail-surface').style.clipPath = `inset(${mix(mobile?45:32,0,reveal)}% ${mix(mobile?6:4.4,0,reveal)}% ${mix(5,0,reveal)}% ${mix(mobile?50:58,0,reveal)}%)`;
  $('.detail-copy').style.opacity = clamp((dp - .08) / .18);
  const chapter = dp < .48 ? 0 : dp < .77 ? 1 : 2;
  if (chapter !== currentChapter) {
    currentChapter = chapter;
    const content = chapters[chapter];
    $('#detail-label').textContent = content.label;
    $('#detail-title').innerHTML = content.title;
    $('#detail-description').textContent = content.description;
    $('#detail-focus').textContent = content.focus;
    $('#detail-start').textContent = content.start;
    $('.detail-counter').textContent = `0${chapter + 1} — 03`;
  }
  const photo = smooth(clamp((dp - .43) / .12)) * (1 - smooth(clamp((dp - .74) / .12)));
  $('.detail-photo').style.opacity = photo;
  $('.detail-photo').style.transform = `scale(${1.06 - photo * .06})`;
  $('.detail-product').style.opacity = 1 - photo;
  $('.detail-product').style.transform = `rotate(${mix(-22,20,dp)}deg) scale(${mix(.88,1.05,dp)})`;
  $('.detail-progress i').style.width = `${dp * 100}%`;
  const cp = progress(clients);
  document.querySelectorAll('.client').forEach((element,index)=>{
    const p = smooth(clamp((cp - index * .16) / .45));
    element.style.clipPath = `inset(0 ${(1-p)*100}% 0 0)`;
    element.style.transform = `translateX(${(1-p)*-70}px)`;
  });
  const fm = metrics.get(founder);
  const fp = smooth(clamp((window.scrollY + window.innerHeight - fm.top) / (window.innerHeight * .9)));
  $('.founder-portrait').style.transform = `translate(${(1-fp)*30}%,${(1-fp)*30}%)`;
}
function requestTick() {if(!ticking){ticking=true;requestAnimationFrame(render);}}
window.addEventListener('scroll',requestTick,{passive:true});
window.addEventListener('resize',measure,{passive:true});
window.addEventListener('load',measure);
document.fonts.ready.then(measure);
reduced.addEventListener('change',()=>window.location.reload());
measure();
$('#year').textContent = new Date().getFullYear();
let downloadURL;
$('#inquiry-form').addEventListener('submit',(event)=>{
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const content = ['ANESSI · Consulta de proyecto','Consulta preparada localmente. No enviada al taller.','',`Nombre: ${values.get('nombre')}`,`Empresa: ${values.get('empresa')}`,`Email: ${values.get('email')}`,`Trabajo: ${values.get('trabajo')}`,'', 'Proyecto:',values.get('proyecto')].join('\n');
  if(downloadURL) URL.revokeObjectURL(downloadURL);
  downloadURL = URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  $('#download-inquiry').href = downloadURL;
  $('#form-result').hidden = false;
  $('#form-result').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'nearest'});
});
window.addEventListener('pagehide',()=>{if(downloadURL)URL.revokeObjectURL(downloadURL);});

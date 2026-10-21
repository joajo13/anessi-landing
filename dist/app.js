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
const workSequence = $('.work-sequence');
const sections = [hero, gallery, detail, clients, founder, workSequence];
const modal = $('#detail-modal');
let modalScrollY = 0;
let metrics = new Map();
let ticking = false;
let currentChapter = -1;
const chapters = [
  {label:'01 / LA MUESTRA', title:'El detalle<br> hace la<br> diferencia.', description:'Muestras metálicas para laboratorios y empresas. Cada trabajo empieza por entender qué pieza necesitás y para qué la vas a usar.', focus:'Muestras y piezas pequeñas', start:'Tu plano, muestra o necesidad'},
  {label:'02 / EL MATERIAL', title:'Cada superficie<br> cuenta una<br> historia.', description:'Del material en bruto al acabado de la pieza. La forma, las medidas y la terminación se conversan antes de comenzar cada trabajo.', focus:'Trabajo sobre metales', start:'Material y requisitos a definir'},
  {label:'03 / TU PROYECTO', title:'La pieza justa.<br> Para tu<br> necesidad.', description:'Una muestra o una pequeña serie. Compartí el uso, la cantidad y los detalles de tu proyecto para evaluar juntos el trabajo.', focus:'Atención a empresas', start:'Una conversación técnica'}
];
function measure() {
  if (modal.open) return;
  metrics = new Map(sections.map(element => [element, {top:element.getBoundingClientRect().top + window.scrollY, height:element.offsetHeight}]));
  requestTick();
}
function progress(element) {
  const dimensions = metrics.get(element);
  return clamp((window.scrollY - dimensions.top) / Math.max(1, dimensions.height - window.innerHeight));
}
function render() {
  ticking = false;
  if (reduced.matches || !metrics.size || modal.open) return;
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
  const workProgress = progress(workSequence);
  const gp = smooth(clamp(workProgress / .22));
  $('.product-grid').style.transform = `perspective(1200px) translateZ(${mix(-260,0,gp)}px) scale(${mix(.85,1,gp)})`;
  $('.product-grid').style.opacity = mix(.5,1,gp);
  const dp = clamp((workProgress - .27) / .73);
  const reveal = smooth(clamp(dp / .26));
  $('.detail-surface').style.opacity = clamp(dp / .035);
  $('.detail-surface').style.pointerEvents = dp > .05 ? 'auto' : 'none';
  gallery.inert = dp > .1;
  detail.inert = dp <= .1;
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
    const p = element === document.activeElement ? 1 : smooth(clamp((cp + .12 - index * .12) / .45));
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
document.documentElement.classList.add('scroll-enhanced');
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

const detailEntries = {
  muestras: {
    label:'01 / MUESTRAS PARA LABORATORIO', title:'Pequeñas muestras. Toda la atención.',
    description:'Una muestra es el punto de partida para conocer un material. Conversamos sobre el uso y la geometría que necesitás antes de definir el trabajo de tornería.',
    image:'assets/probeta.png', alt:'Muestra cilíndrica de acero mecanizado, representación ilustrativa', caption:'REPRESENTACIÓN ILUSTRATIVA / MUESTRA METÁLICA',
    facts:[['Tipo de trabajo','Preparación de muestras metálicas'],['Para conversar','Geometría, material y cantidad'],['Punto de partida','Plano o muestra de referencia']],
    disclosure:'Las medidas y los requisitos de ensayo se acuerdan para cada pedido. La imagen no representa una especificación técnica.', inquiry:'Muestra para laboratorio'
  },
  componentes: {
    label:'02 / COMPONENTES MECANIZADOS', title:'La pieza que tu proyecto necesita.',
    description:'Bujes y otras piezas pequeñas de metal. El trabajo comienza entendiendo la función del componente y las superficies que importan para su aplicación.',
    image:'assets/buje.png', alt:'Buje escalonado de acero con abertura central, representación ilustrativa', caption:'REPRESENTACIÓN ILUSTRATIVA / BUJE TORNEADO',
    facts:[['Tipo de trabajo','Tornería de piezas pequeñas'],['Para conversar','Diámetros, ajuste y terminación'],['Punto de partida','Plano, pieza existente o necesidad']],
    disclosure:'Materiales, medidas y viabilidad se evalúan con el taller antes de confirmar el pedido.', inquiry:'Pieza de precisión'
  },
  series: {
    label:'03 / PEQUEÑAS SERIES', title:'Cada unidad merece el mismo cuidado.',
    description:'Cuando tu proyecto requiere más de una pieza, definir bien la primera es esencial. Conversamos sobre la muestra de referencia y la cantidad que necesitás.',
    image:'assets/buje.png', alt:'Componente metálico ilustrativo para una pequeña serie', caption:'REPRESENTACIÓN ILUSTRATIVA / PEQUEÑA SERIE',
    facts:[['Tipo de trabajo','Producción en pequeña escala'],['Para conversar','Cantidad, material y uso'],['Punto de partida','Una pieza o un plano definido']],
    disclosure:'La cantidad, el alcance y los tiempos se confirman según el trabajo. No se indican capacidades o plazos garantizados.', inquiry:'Pequeña serie'
  },
  proceso: {
    label:'04 / EL PROCESO', title:'De la materia al detalle.',
    description:'La tornería transforma el material paso a paso. Cada superficie y cada encuentro entre formas responden a la pieza que se busca obtener.',
    image:'assets/torno.png', alt:'Representación ilustrativa de una pieza durante su mecanizado en un torno', caption:'IMAGEN GENERADA / PROCESO ILUSTRATIVO', photo:true,
    facts:[['Tipo de trabajo','Mecanizado por torneado'],['Para conversar','Forma, material y acabado'],['Punto de partida','Revisión del proyecto con el taller']],
    disclosure:'Esta imagen ilustra el proceso; no es una fotografía documental del taller de Hugo.', inquiry:'Otra consulta'
  },
  siderar: {
    label:'REFERENCIA INDUSTRIAL / SIDERAR', title:'Una referencia en la historia del acero.',
    description:'Siderar forma parte de la historia de Ternium. Conservamos esta denominación histórica entre las referencias mencionadas para la presentación de Anessi.',
    image:'assets/companies/ternium.jpg', alt:'Imagen institucional de Ternium Argentina', caption:'IMAGEN INSTITUCIONAL / TERNIUM ARGENTINA', photo:true,
    facts:[['Referencia','Siderar · denominación histórica'],['Trabajo de Anessi','Alcance pendiente de documentar'],['Piezas y materiales','Sin especificación confirmada']],
    disclosure:'La fotografía muestra el contexto industrial de Ternium; no documenta un trabajo realizado por Anessi ni implica un aval de la empresa.',
    source:'https://co.ternium.com/media/zisn0b0k/ppt_inst_ternium_espan-ol.pdf', sourceLabel:'Fuente institucional: historia de Ternium ↗', company:true
  },
  sidersa: {
    label:'REFERENCIA INDUSTRIAL / SIDERSA', title:'El acero, en sus distintas formas.',
    description:'Sidersa presenta productos de acero como hojas, flejes, tubos y perfiles. Su imagen institucional acompaña esta referencia del sector metalúrgico.',
    image:'assets/companies/sidersa.png', alt:'Imagen institucional publicada por Sidersa en su sitio oficial', caption:'IMAGEN INSTITUCIONAL / SIDERSA', photo:true,
    facts:[['Sector','Productos de acero'],['Trabajo de Anessi','Alcance pendiente de documentar'],['Piezas y materiales','Sin especificación confirmada']],
    disclosure:'La referencia comercial debe confirmarse. Esta imagen institucional no es evidencia de un trabajo del taller ni un aval de Sidersa.',
    source:'https://sidersa.com/', sourceLabel:'Fuente e imagen: sitio oficial de Sidersa ↗', company:true
  },
  ternium: {
    label:'REFERENCIA INDUSTRIAL / TERNIUM', title:'Acero para la industria.',
    description:'Ternium Argentina elabora y procesa productos de acero para distintas industrias. La ficha permite conocer el contexto de la empresa y consultar la fuente oficial.',
    image:'assets/companies/ternium.jpg', alt:'Imagen institucional de una instalación industrial de Ternium Argentina', caption:'IMAGEN INSTITUCIONAL / TERNIUM ARGENTINA', photo:true,
    facts:[['Sector','Producción y procesamiento de acero'],['Trabajo de Anessi','Alcance pendiente de documentar'],['Piezas y materiales','Sin especificación confirmada']],
    disclosure:'La referencia comercial debe confirmarse. El alcance de un trabajo de Anessi no se deduce de la actividad de Ternium ni de esta fotografía.',
    source:'https://ar.ternium.com/es/nuestra-empresa', sourceLabel:'Fuente e imagen: Ternium Argentina ↗', company:true
  }
};
let modalOpener = null;
let bodyStyles = '';
let selectedEntry;
let afterModalClose = null;
const modalPanel = $('.modal-panel');
const closeButton = $('.modal-close');
function openDetail(key, opener) {
  const entry = detailEntries[key];
  if (!entry || modal.open) return;
  selectedEntry = entry;
  const origin = opener.getBoundingClientRect();
  modalOpener = opener;
  $('#modal-label').textContent = entry.label;
  $('#modal-title').textContent = entry.title;
  $('#modal-description').textContent = entry.description;
  $('#modal-image').src = entry.image;
  $('#modal-image').alt = entry.alt;
  $('#modal-caption').textContent = entry.caption;
  $('#modal-disclosure').textContent = entry.disclosure;
  $('.modal-image-index').textContent = entry.company ? 'EMPRESAS / CONTEXTO' : 'ANESSI / EN DETALLE';
  $('.modal-visual').classList.toggle('is-photo',!!entry.photo);
  const facts = $('#modal-facts');
  facts.replaceChildren();
  entry.facts.forEach(([label,value])=>{
    const row=document.createElement('div'), dt=document.createElement('dt'), dd=document.createElement('dd');
    dt.textContent=label;dd.textContent=value;row.append(dt,dd);facts.append(row);
  });
  const source = $('#modal-source');
  source.hidden = !entry.source;
  if(entry.source){source.href=entry.source;source.textContent=entry.sourceLabel;}
  else {source.removeAttribute('href');source.textContent='';}
  $('.modal-cta span').textContent=entry.company?'Explorar nuestras piezas':'Consultar por este trabajo';
  modalScrollY=window.scrollY;
  bodyStyles=document.body.style.cssText;
  document.body.style.position='fixed';
  document.body.style.top=`-${modalScrollY}px`;
  document.body.style.width='100%';
  document.body.style.overflow='hidden';
  modal.showModal();
  modal.scrollTop=0;
  closeButton.focus({preventScroll:true});
  if(!reduced.matches){
    const target=modalPanel.getBoundingClientRect();
    const x=origin.left+origin.width/2-target.left-target.width/2;
    const y=origin.top+origin.height/2-target.top-target.height/2;
    modalPanel.animate([{transform:`translate(${x}px,${y}px) scale(${origin.width/target.width},${origin.height/target.height})`,opacity:.35},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:430,easing:'cubic-bezier(.22,1,.36,1)'});
    $('#modal-image').animate([{transform:'translate(12%,12%) rotate(12deg)',opacity:.4},{transform:'translate(0,0) rotate(0)',opacity:1}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
  }
}
function closeDetail() {
  if (!modal.open) return;
  // Closing must also work while a background tab has paused its animations.
  modalPanel.getAnimations().forEach(animation=>animation.cancel());
  $('#modal-image').getAnimations().forEach(animation=>animation.cancel());
  modal.close();
  restoreAfterDetail();
}
for(const button of document.querySelectorAll('[data-detail]')){
  button.addEventListener('click',()=>openDetail(button.dataset.detail,button));
}
closeButton.addEventListener('click',closeDetail);
modal.addEventListener('cancel',event=>{event.preventDefault();closeDetail();});
modal.addEventListener('click',event=>{if(event.target===modal)closeDetail();});
function restoreAfterDetail() {
  if (!modalOpener) return;
  const opener = modalOpener;
  modalOpener = null;
  document.body.style.cssText=bodyStyles;
  window.scrollTo({top:modalScrollY,behavior:'instant'});
  measure();
  opener.focus({preventScroll:true});
  if(afterModalClose){const action=afterModalClose;afterModalClose=null;action();}
}
modal.addEventListener('close',()=>{if(!modal.open)restoreAfterDetail();});
$('.modal-cta').addEventListener('click',()=>{
  const entry=selectedEntry;
  afterModalClose=()=>{
    if(entry.company){gallery.scrollIntoView({behavior:'auto',block:'start'});}
    else {
      $('#inquiry-form select').value=entry.inquiry;
      $('#contacto').scrollIntoView({behavior:'auto',block:'start'});
      $('#inquiry-form input').focus({preventScroll:true});
    }
  };
  closeDetail();
});

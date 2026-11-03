import {C} from '../data/content.js';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const label=n=>`<div class="label"><b>${esc(C.label.l1)}</b><span class="num">${esc(n||C.label.ph)}</span><i>${esc(C.label.l2)}</i><small>${esc(C.label.l3)}</small></div>`;
function split(){$$('[data-split]').forEach(el=>{if(el.dataset.done)return;el.dataset.done=1;const t=el.textContent;el.setAttribute('aria-label',t);el.innerHTML=t.split(' ').map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span> `).join('')})}
function reveal(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});$$('[data-split],[data-r]').forEach(e=>io.observe(e))}
function mag(){if(RM||!matchMedia('(pointer:fine)').matches)return;$$('.mag').forEach(b=>{b.onpointermove=e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`};b.onpointerleave=()=>b.style.transform=''})}
function sticky(){const s=$('.how:not(.atlas)');if(!s)return;const set=i=>{s.dataset.s=i;$('.scr',s).textContent=C.how.screens[i]};const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&set(+e.target.dataset.i)),{rootMargin:'-40% 0px -40% 0px'});$$('.step',s).forEach(e=>io.observe(e))}
function drag(){const d=$('#drag');if(!d)return;const slot=$('#play .slot'),ph=$('#play .phone'),scr=$('#play .scr');let sx,sy,ox=0,oy=0,done=false;
const c=r=>[r.left+r.width/2,r.top+r.height/2];
const snap=()=>{const [ax,ay]=c(slot.getBoundingClientRect()),[bx,by]=c(d.getBoundingClientRect());ox+=ax-bx;oy+=ay-by;d.style.transform=`translate(${ox}px,${oy}px) rotate(0) scale(.54)`;d.classList.add('stuck');ph.classList.add('found');scr.textContent=C.home.found;done=true};
const reset=()=>{ox=oy=0;d.style.transform='';d.classList.remove('stuck');ph.classList.remove('found');scr.textContent=C.home.lost;done=false};
d.onpointerdown=e=>{if(done){reset();return}d.setPointerCapture(e.pointerId);d.classList.add('on');sx=e.clientX-ox;sy=e.clientY-oy};
d.onpointermove=e=>{if(!d.classList.contains('on'))return;ox=e.clientX-sx;oy=e.clientY-sy;d.style.transform=`translate(${ox}px,${oy}px) rotate(-4deg)`};
d.onpointerup=()=>{if(!d.classList.contains('on'))return;d.classList.remove('on');const [ax,ay]=c(slot.getBoundingClientRect()),[bx,by]=c(d.getBoundingClientRect());Math.hypot(ax-bx,ay-by)<110?snap():(ox=oy=0,d.style.transform='')};
d.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();done?reset():snap()}}}
function order(){const f=$('#of');if(!f)return;const tn=$('#tn'),pv=$('.prev .num'),tot=$('#tot');
const fmt=v=>{const d=v.replace(/\D/g,'').slice(0,10);return d.length>6?`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`:d.length>3?`(${d.slice(0,3)}) ${d.slice(3)}`:d};
const pk=()=>C.price[+f.pack.value];const upd=()=>{pv.textContent=tn.value||C.label.ph;tot.textContent=`$${pk().p} for ${pk().q} labels`};
tn.oninput=()=>{tn.value=fmt(tn.value);upd()};f.onchange=upd;upd();
f.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f)),o=C.order;
// Replace this demo with PayPal checkout once [PayPal business account] is connected.
$('#done').innerHTML=`<h2>${esc(o.doneH)}</h2><p>${esc(o.doneP)}</p><div class="sheet">${Array(pk().q).fill(label(d.tel)).join('')}<div class="mail"><small>${esc(o.from)}</small><p>${esc(d.name)}<br>${esc(d.street)}<br>${esc(d.city)}, ${esc(d.state.toUpperCase())} ${esc(d.zip)}</p></div></div><button class="btn mag noprint" type="button" onclick="print()">${esc(o.print)}</button>`;$('#done').scrollIntoView({behavior:RM?'auto':'smooth'});mag()}}
function atlas(){const s=$('.atlas');if(!s)return;const rt=$('#rt'),L=rt.getTotalLength(),n=C.atlas.stops.length,dot=$('#dot'),pt=i=>rt.getPointAtLength(L*i/(n-1));
rt.style.strokeDasharray=L;$('#pins').innerHTML=C.atlas.stops.map((x,i)=>{const p=pt(i),l=p.x>150;return `<g class="pin" data-i="${i}"><circle cx="${p.x}" cy="${p.y}" r="9"/><text x="${p.x+(l?-15:15)}" y="${p.y+4}" text-anchor="${l?'end':'start'}">${esc(x.place)}</text></g>`}).join('');
const set=i=>{const p=pt(i);rt.style.strokeDashoffset=L*(1-i/(n-1));dot.style.transform=`translate(${p.x}px,${p.y}px)`;$$('.pin',s).forEach(g=>g.classList.toggle('on',+g.dataset.i<=i));s.dataset.s=i};set(0);
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&set(+e.target.dataset.i)),{rootMargin:'-40% 0px -40% 0px'});$$('.step',s).forEach(e=>io.observe(e))}
split();reveal();mag();drag();order();atlas();
(()=>{const i=$('#intro');let seen;try{seen=sessionStorage.ffl;sessionStorage.ffl=1}catch(e){}if(RM||seen){i.remove();return}i.onclick=()=>i.remove();setTimeout(()=>i.classList.add('out'),1700);setTimeout(()=>i.remove(),2700)})();

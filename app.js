(()=>{const S=window.SECTIONS,tabs=document.getElementById('tabs'),grid=document.getElementById('grid');
let cur=S.find(s=>s.id===location.hash.slice(1))||S.find(s=>s.works.length)||S[0],idx=0,zoom=3,lensOn=true;
S.forEach(s=>{const b=document.createElement('button');b.innerHTML=s.name+(s.works.length?`<sup>${s.works.length}</sup>`:'');b.onclick=()=>{show(s);history.replaceState(null,'','#'+s.id);document.getElementById('gallery').scrollIntoView()};s.btn=b;tabs.appendChild(b)});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'50px'});
function show(s){cur=s;S.forEach(x=>x.btn.classList.toggle('on',x===s));grid.classList.add('fade');
setTimeout(()=>{document.getElementById('secName').textContent=s.name;document.getElementById('secYears').textContent=s.years||'';grid.innerHTML='';
if(!s.works.length){grid.style.columns='auto';grid.innerHTML=`<div class="soon"><svg viewBox="0 0 120 120"><path d="M20 100 L85 35 L98 48 L33 113 Z M85 35 l8-8 13 13-8 8 M20 100 l-6 18 18-6"/><path d="M10 70 C 30 55, 45 80, 60 62" stroke-dasharray="4 5"/></svg><h3>Скоро</h3><p><i>Работы раздела «${s.name}» готовятся к публикации.</i></p></div>`}
else{grid.style.columns='';s.works.forEach((w,i)=>{const c=document.createElement('figure');c.className='card';c.innerHTML=`<img src="${w.thumb}" width="${w.w}" height="${w.h}" loading="lazy" alt="${w.title||'Без названия'}"><p><span>${w.title||'Без названия'}</span><span>${w.year||''}</span></p>`;c.onclick=()=>open(i);grid.appendChild(c);io.observe(c)})}
grid.classList.remove('fade')},250)}
const V=document.getElementById('viewer'),img=document.getElementById('vimg'),lens=document.getElementById('lens'),st=document.getElementById('vstage');
function open(i){idx=(i+cur.works.length)%cur.works.length;const w=cur.works[idx];img.src=w.src;lens.style.backgroundImage=`url(${w.src})`;
document.getElementById('vcap').textContent=`${w.title||'Без названия'} · ${w.year||cur.years} · ${idx+1} / ${cur.works.length}`;V.hidden=false;document.body.style.overflow='hidden';hideL();
[idx+1,idx-1].forEach(j=>{const p=cur.works[(j+cur.works.length)%cur.works.length];new Image().src=p.src})}
function close(){V.hidden=true;document.body.style.overflow=''}
function L(cx,cy){if(!lensOn)return;const r=img.getBoundingClientRect(),x=cx-r.left,y=cy-r.top;if(x<0||y<0||x>r.width||y>r.height){hideL();return}
const s=st.getBoundingClientRect(),lw=lens.offsetWidth||220;lens.style.display='block';lens.style.left=(cx-s.left)+'px';lens.style.top=(cy-s.top)+'px';
lens.style.backgroundSize=`${r.width*zoom}px ${r.height*zoom}px`;lens.style.backgroundPosition=`${-(x*zoom-lw/2)}px ${-(y*zoom-lw/2)}px`}
function hideL(){lens.style.display='none'}window.__lens=L;
st.addEventListener('mousemove',e=>L(e.clientX,e.clientY));st.addEventListener('mouseleave',hideL);
let tx=0,ty=0,t0=0,moved=false,hold;
st.addEventListener('touchstart',e=>{const t=e.touches[0];tx=t.clientX;ty=t.clientY;t0=Date.now();moved=false;hold=setTimeout(()=>{moved='lens';L(tx,ty-90)},260)},{passive:true});
st.addEventListener('touchmove',e=>{const t=e.touches[0];if(moved==='lens'){e.preventDefault();L(t.clientX,t.clientY-90)}else if(Math.abs(t.clientX-tx)>12){clearTimeout(hold);moved='swipe'}},{passive:false});
st.addEventListener('touchend',e=>{clearTimeout(hold);const t=e.changedTouches[0],dx=t.clientX-tx;if(moved==='swipe'&&Math.abs(dx)>50)open(idx+(dx<0?1:-1));hideL();moved=false});
V.querySelector('.v-prev').onclick=()=>open(idx-1);V.querySelector('.v-next').onclick=()=>open(idx+1);V.querySelector('.v-close').onclick=close;
V.addEventListener('click',e=>{if(e.target===V)close()});
document.addEventListener('keydown',e=>{if(V.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowRight')open(idx+1);if(e.key==='ArrowLeft')open(idx-1)});
document.getElementById('lensBtn').onclick=e=>{lensOn=!lensOn;e.target.classList.toggle('on',lensOn);V.classList.toggle('no-lens',!lensOn);hideL()};
V.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{zoom=+b.dataset.z;V.querySelectorAll('[data-z]').forEach(x=>x.classList.toggle('on',x===b))});
show(cur)})();

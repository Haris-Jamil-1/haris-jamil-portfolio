/* ============================================================
   main.js — core UI: nav, mobile menu, typing effect, service
   cards, scroll reveals, animated counters, and the conditional
   loader for the heavier optional scripts (cursor, 3D bg, canvas).

   No GSAP/ScrollTrigger here on purpose — the reveal/counter/hero
   effects below are simple opacity+transform tweens that plain
   CSS transitions/keyframes + IntersectionObserver handle fine,
   so the ~120KB GSAP + ScrollTrigger payload and ScrollTrigger's
   scroll listeners are avoided entirely (see README.md).

   will-change is applied only while something is actually
   animating (right before an IntersectionObserver reveal fires,
   or while a hero-entrance keyframe plays) and cleared on
   transitionend/animationend — never left set permanently.
   ============================================================ */

const FLAGS = window.__FLAGS;
const IS_MOBILE = FLAGS.IS_MOBILE;
const REDUCE_MOTION = FLAGS.REDUCE_MOTION;

/* ================= Services data ================= */
const SERVICES = [
  {ic:'💻',t:'Software Development',d:'Custom, scalable software tailored to your business workflow and goals.'},
  {ic:'🌐',t:'Web Development',d:'Lightning-fast, responsive websites & web apps with modern stacks.'},
  {ic:'🤖',t:'Android Applications',d:'Native Android apps that are smooth, secure and user-first.'},
  {ic:'📱',t:'Flutter Applications',d:'Cross-platform apps from a single codebase — iOS & Android.'},
  {ic:'🧠',t:'AI-Based Systems',d:'Intelligent systems & automation that work while you sleep.'},
  {ic:'📊',t:'Machine Learning',d:'Predictive models & data pipelines that turn data into decisions.'},
  {ic:'🎨',t:'UI / UX Design',d:'Clean, modern interfaces designed to convert and delight users.'},
  {ic:'☁️',t:'APIs & Cloud',d:'Robust backends, REST/GraphQL APIs and cloud deployments.'}
];
const grid = document.getElementById('servicesGrid');
SERVICES.forEach(s=>{
  const c = document.createElement('div');
  c.className='card reveal';
  c.innerHTML = `<div class="ico">${s.ic}</div><h3>${s.t}</h3><p>${s.d}</p>`;
  grid.appendChild(c);
});

/* ================= Typing animation ================= */
const words = ['Software','Web Apps','Android Apps','Flutter Apps','AI Solutions','ML Systems'];
const typedEl = document.getElementById('typed');
if(REDUCE_MOTION){
  typedEl.textContent = words[0];
} else {
  let wi=0, ci=0, deleting=false;
  (function type(){
    const w = words[wi];
    typedEl.textContent = w.slice(0,ci);
    if(!deleting && ci<w.length){ci++;}
    else if(deleting && ci>0){ci--;}
    else if(!deleting && ci===w.length){deleting=true;setTimeout(type,1400);return;}
    else {deleting=false;wi=(wi+1)%words.length;}
    setTimeout(type, deleting?45:90);
  })();
}

/* ================= Navbar scroll ================= */
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});

/* ================= Mobile menu ================= */
const burger=document.getElementById('burger'), navlinks=document.getElementById('navlinks');
function setMenu(open){
  burger.classList.toggle('open',open);
  navlinks.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
burger.addEventListener('click',()=>setMenu(!navlinks.classList.contains('open')));
navlinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('click',e=>{
  if(navlinks.classList.contains('open') && !navlinks.contains(e.target) && !burger.contains(e.target)) setMenu(false);
});

/* ================= Hero entrance will-change =================
   The fade/scale-in itself runs via CSS keyframes (css/style.css);
   we just toggle will-change for the short window the animation
   is actually playing. */
if(!REDUCE_MOTION){
  document.querySelectorAll('.hero-left > *, .portrait-wrap').forEach(el=>{
    el.style.willChange='opacity, transform';
    el.addEventListener('animationend',()=>{ el.style.willChange='auto'; },{once:true});
  });
}

/* ================= Scroll reveals ================= */
const revealEls = document.querySelectorAll('.reveal');
if(REDUCE_MOTION){
  revealEls.forEach(el=>el.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      el.style.willChange='opacity, transform';
      el.classList.add('in-view');
      el.addEventListener('transitionend',()=>{ el.style.willChange='auto'; },{once:true});
      obs.unobserve(el);
    });
  },{threshold:.15, rootMargin:'0px 0px -8% 0px'});
  revealEls.forEach((el,i)=>{
    el.style.transitionDelay = `${(i%4)*0.08}s`;
    revealObserver.observe(el);
  });
}

/* ================= Animated counters ================= */
function animateCount(el,target,duration=1600){
  const start=performance.now();
  function tick(now){
    const p=Math.min((now-start)/duration,1);
    const eased=1-Math.pow(1-p,3); // ease-out-cubic, matches the old power3.out feel
    el.textContent=Math.round(eased*target);
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
document.querySelectorAll('.count').forEach(el=>{
  const target=+el.dataset.target;
  if(REDUCE_MOTION){ el.textContent=target; return; }
  const obs=new IntersectionObserver((entries,o)=>{
    if(entries[0].isIntersecting){ animateCount(el,target); o.disconnect(); }
  },{threshold:.6});
  obs.observe(el);
});

/* ================= Conditional loading of optional scripts =================
   - Custom cursor: desktop pointer devices only, skipped entirely for
     touch/mobile and for reduced-motion users (it's a rAF loop).
   - 3D background + floating-code canvas: deferred until window 'load' so
     neither competes with first paint / LCP, which matters most on mobile. */
if(!IS_MOBILE && !REDUCE_MOTION){
  const s = document.createElement('script');
  s.src = 'js/cursor.js';
  s.defer = true;
  document.body.appendChild(s);
}

addEventListener('load', ()=>{
  ['js/bg-scene.js','js/code-canvas.js'].forEach(src=>{
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  });
});

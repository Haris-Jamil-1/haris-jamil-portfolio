/* ============================================================
   main.js — core UI: nav, mobile menu, work/research row
   injection, scroll reveals, and the conditional loader for the
   hero's Three.js background.

   No GSAP/ScrollTrigger here on purpose — the reveal effects below
   are simple opacity+transform tweens that plain CSS transitions +
   IntersectionObserver handle fine.

   will-change is applied only while something is actually
   animating (right before an IntersectionObserver reveal fires,
   or while a hero-entrance keyframe plays) and cleared on
   transitionend/animationend — never left set permanently.
   ============================================================ */

const FLAGS = window.__FLAGS;
const IS_MOBILE = FLAGS.IS_MOBILE;
const REDUCE_MOTION = FLAGS.REDUCE_MOTION;

/* ================= Work (featured projects) ================= */
const WORK = [
  {
    index: '01 / 03',
    title: 'Evalix — Exam Management System',
    img: 'images/projects/exam-system.jpg',
    problem: 'Institutions need to run high-stakes exams remotely without sacrificing academic integrity.',
    built: 'A multi-tenant SaaS platform with AI-based proctoring (noise, eye-movement, face &amp; object detection), LLM-generated exams, CLO mapping, and live video/audio streaming.',
    stack: ['Next.js','TypeScript','Supabase','PostgreSQL','CV proctoring pipeline'],
    live: 'exam-system-sigma.vercel.app',
    href: 'https://exam-system-sigma.vercel.app'
  },
  {
    index: '02 / 03',
    title: 'ZapMail',
    img: 'images/projects/zapmail.jpg',
    problem: 'Disposable-email tools usually force a sign-up or expire before you’re done needing them.',
    built: 'A permanent, no-signup disposable inbox on a serverless MIME ingestion pipeline, with inbox updates delivered in real time via Supabase Realtime.',
    stack: ['Next.js','TypeScript','Supabase Realtime','Serverless MIME parsing','Cloudflare'],
    live: 'zapmail.store',
    href: 'https://zapmail.store'
  },
  {
    index: '03 / 03',
    title: "Sam’s Makeup Studio — Salon Booking System",
    img: 'images/projects/salon-booking.jpg',
    problem: 'A growing salon needed client bookings and admin operations in one place — not spreadsheets and DMs.',
    built: 'A client booking and admin management platform with WhatsApp integration for confirmations and follow-ups.',
    stack: ['Next.js','TypeScript','Tailwind CSS','Supabase','PostgreSQL'],
    live: 'sams-makeup-studio.vercel.app',
    href: 'https://sams-makeup-studio.vercel.app'
  }
];
const workList = document.getElementById('workList');
WORK.forEach((w,i)=>{
  const row = document.createElement('div');
  row.className = 'work-row reveal' + (i%2 ? ' flip' : '');
  row.innerHTML = `
    <div class="work-media"><img src="${w.img}" alt="${w.title} — screenshot" loading="lazy" decoding="async" width="1400" height="759" /></div>
    <div class="work-body">
      <span class="work-index">${w.index}</span>
      <h3 class="work-title"><a href="${w.href}" target="_blank" rel="noopener">${w.title}</a></h3>
      <div class="work-spec">
        <div class="work-spec-row"><span class="work-spec-k">Problem</span><span class="work-spec-v">${w.problem}</span></div>
        <div class="work-spec-row"><span class="work-spec-k">Built</span><span class="work-spec-v">${w.built}</span></div>
      </div>
      <div class="work-stack">${w.stack.map(s=>`<span>${s}</span>`).join('')}</div>
      <a class="work-link" href="${w.href}" target="_blank" rel="noopener">View live — ${w.live} ↗</a>
    </div>`;
  workList.appendChild(row);
});

/* ================= Research ================= */
const RESEARCH = [
  {tag:'Healthcare ML', title:'Chronic Kidney Disease Prediction', d:'ML models trained on clinical data to support early CKD risk detection.'},
  {tag:'Applied ML', title:'Fashion &amp; Cultural Preference Analysis', d:'Data-driven analysis of fashion preference patterns across cultural contexts.'},
  {tag:'Explainable AI', title:'Explainable Drug–Protein Interaction Prediction', d:'Interpretable ML models for predicting drug–protein interactions.'}
];
const researchList = document.getElementById('researchList');
RESEARCH.forEach(r=>{
  const row = document.createElement('div');
  row.className = 'research-row reveal';
  row.innerHTML = `
    <span class="research-tag">${r.tag}</span>
    <div class="research-body"><h3>${r.title}</h3><p>${r.d}</p></div>`;
  researchList.appendChild(row);
});

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
  },{threshold:.12, rootMargin:'0px 0px -8% 0px'});
  revealEls.forEach((el,i)=>{
    el.style.transitionDelay = `${(i%3)*0.08}s`;
    revealObserver.observe(el);
  });
}

/* ================= Conditional loading of the hero 3D scene =================
   Skipped entirely on mobile/touch and for reduced-motion users — mobile
   gets the static CSS gradient wash instead of a WebGL canvas. Deferred
   until window 'load' so it never competes with first paint / LCP. */
if(!IS_MOBILE && !REDUCE_MOTION){
  addEventListener('load', ()=>{
    const s = document.createElement('script');
    s.src = 'js/bg-scene.js';
    s.defer = true;
    document.body.appendChild(s);
  });
}

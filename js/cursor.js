/* ============================================================
   cursor.js — desktop-only custom cursor (dot + ring) and the
   3D card tilt effect.

   Only ever injected by main.js when !IS_MOBILE && !REDUCE_MOTION
   (see the loader at the bottom of main.js), so no capability
   checks are needed in here — if this file is running, we're on
   a non-touch desktop pointer with motion allowed.
   ============================================================ */
(function(){
  const dot=document.querySelector('.cursor-dot'), ring=document.querySelector('.cursor-ring');
  let mx=0,my=0,rx=0,ry=0;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  function ringLoop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(ringLoop);}
  ringLoop();
  document.querySelectorAll('a,button,.card,.why-card,.badge-mini').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('active'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('active'));
  });

  /* ================= 3D card tilt =================
     will-change is toggled per-card on enter/leave instead of being set
     permanently in CSS, so the browser only keeps a compositor layer
     around while a card is actually being tilted. */
  const cards = document.querySelectorAll('.card');
  cards.forEach(card=>{
    card.addEventListener('mouseenter',()=>{card.style.willChange='transform';});
    card.addEventListener('mouseleave',()=>{card.style.willChange='auto';card.style.transform='';});
  });
  document.addEventListener('mousemove',e=>{
    cards.forEach(card=>{
      const r=card.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) return;
      const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(700px) rotateY(${px*12}deg) rotateX(${-py*12}deg) translateY(-6px)`;
    });
  });
})();

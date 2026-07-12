/* ============================================================
   code-canvas.js — floating code-symbol canvas overlay.

   Injected by main.js after window 'load'.

   Mobile/perf:
   - Fewer, more sparsely-packed symbols on mobile/touch.
   - Frame rate capped to 24fps on mobile (uncapped on desktop).
   - Paused via IntersectionObserver + document.visibilitychange
     when the canvas isn't actually visible.
   ============================================================ */
(function(){
  const FLAGS = window.__FLAGS;
  const IS_MOBILE = FLAGS.IS_MOBILE;
  const REDUCE_MOTION = FLAGS.REDUCE_MOTION;

  const c=document.getElementById('code-canvas'), ctx=c.getContext('2d');
  const symbols=['{ }','</>','()','#','[]','=>','&&','%','::','<div>','ai','ml','fn'];
  let parts=[];
  function init(){
    c.width=innerWidth;c.height=innerHeight;
    parts=[];
    const n=Math.min(IS_MOBILE?12:40,Math.floor(innerWidth/(IS_MOBILE?55:35)));
    for(let i=0;i<n;i++){
      parts.push({
        x:Math.random()*c.width,y:Math.random()*c.height,
        s:symbols[Math.floor(Math.random()*symbols.length)],
        size:12+Math.random()*16, vy:.2+Math.random()*.6,
        a:.15+Math.random()*.35,
        hue:Math.random()>.5?'180,90%,60%':'255,90%,72%'
      });
    }
  }
  function render(move){
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p=>{
      ctx.font=`600 ${p.size}px Orbitron, monospace`;
      ctx.fillStyle=`hsla(${p.hue},${p.a})`;
      ctx.fillText(p.s,p.x,p.y);
      if(move){ p.y-=p.vy; if(p.y<-20){p.y=c.height+20;p.x=Math.random()*c.width;} }
    });
  }

  // Pause drawing when the canvas isn't actually visible.
  let isIntersecting=true;
  new IntersectionObserver(entries=>{isIntersecting=entries[0].isIntersecting;},{threshold:0}).observe(c);

  let last=0;
  const FRAME_INTERVAL = IS_MOBILE ? 1000/24 : 0;
  function draw(now){
    requestAnimationFrame(draw);
    if(document.hidden || !isIntersecting) return;
    if(FRAME_INTERVAL && now-last<FRAME_INTERVAL) return;
    last=now;
    render(true);
  }
  // Width-guarded resize: ignore mobile address-bar height changes so symbols
  // don't re-seed and flicker while scrolling.
  let lastW=innerWidth;
  addEventListener('resize',()=>{
    if(IS_MOBILE && innerWidth===lastW) return;
    lastW=innerWidth; init();
  });
  init();
  if(REDUCE_MOTION) render(false); else requestAnimationFrame(draw);
})();

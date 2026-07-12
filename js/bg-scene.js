/* ============================================================
   bg-scene.js — Three.js particle network + wireframe icosahedron
   background.

   Injected by main.js after window 'load', so it never competes
   with first paint / LCP.

   Mobile/perf:
   - ~70% fewer particles (270 vs 900) on mobile/touch.
   - Frame rate capped to 24fps on mobile (uncapped on desktop).
   - Antialiasing off + capped devicePixelRatio on mobile.
   - Paused via IntersectionObserver (canvas off-screen) and
     document.visibilitychange (tab hidden) so it doesn't burn
     battery/GPU when nobody can see it.
   ============================================================ */
(function(){
  const FLAGS = window.__FLAGS;
  const IS_MOBILE = FLAGS.IS_MOBILE;
  const REDUCE_MOTION = FLAGS.REDUCE_MOTION;

  const canvas=document.getElementById('bg3d');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!IS_MOBILE});
  renderer.setPixelRatio(Math.min(devicePixelRatio,IS_MOBILE?1.5:2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,1000);
  camera.position.z=6;

  // particle network sphere — ~70% fewer points on mobile.
  const COUNT=IS_MOBILE?270:900;
  const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(COUNT*3);
  for(let i=0;i<COUNT;i++){
    const r=4+Math.random()*1.6;
    const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1]=r*Math.sin(ph)*Math.sin(th);
    pos[i*3+2]=r*Math.cos(ph);
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({size:.035,color:0x33d6ff,transparent:true,opacity:.9});
  const points=new THREE.Points(geo,mat);
  scene.add(points);

  // glowing wireframe icosahedron core
  const ico=new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7,1),
    new THREE.MeshBasicMaterial({color:0x8b5cf6,wireframe:true,transparent:true,opacity:.35})
  );
  scene.add(ico);

  const ico2=new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.5,0),
    new THREE.MeshBasicMaterial({color:0x3b82f6,wireframe:true,transparent:true,opacity:.18})
  );
  scene.add(ico2);

  let tx=0,ty=0;
  if(!IS_MOBILE) addEventListener('mousemove',e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5);});

  let lastW=innerWidth;
  function resize(){
    renderer.setSize(innerWidth,innerHeight);
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  }
  // On mobile, scrolling shows/hides the address bar and fires resize with only a
  // height change — ignore those so the canvas (and layout) don't jitter.
  addEventListener('resize',()=>{
    if(IS_MOBILE && innerWidth===lastW) return;
    lastW=innerWidth; resize();
  });
  resize();

  // Pause rendering when the canvas isn't actually visible.
  let isIntersecting=true;
  new IntersectionObserver(entries=>{isIntersecting=entries[0].isIntersecting;},{threshold:0}).observe(canvas);

  const FRAME_INTERVAL = IS_MOBILE ? 1000/24 : 0;
  let last=0;
  function animate(now){
    requestAnimationFrame(animate);
    if(document.hidden || !isIntersecting) return;
    if(FRAME_INTERVAL && now-last<FRAME_INTERVAL) return;
    last=now;
    points.rotation.y+=.0012; points.rotation.x+=.0006;
    ico.rotation.y-=.003; ico.rotation.x+=.002;
    ico2.rotation.y+=.0015; ico2.rotation.z-=.001;
    // parallax
    camera.position.x+=(tx*1.4-camera.position.x)*.04;
    camera.position.y+=(-ty*1.4-camera.position.y)*.04;
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
  }
  if(REDUCE_MOTION){ camera.lookAt(scene.position); renderer.render(scene,camera); }
  else requestAnimationFrame(animate);
})();

/* ============================================================
   bg-scene.js — a quiet, single-color Three.js particle field +
   wireframe icosahedron, confined to the hero section only.

   Only ever injected by main.js when !IS_MOBILE && !REDUCE_MOTION
   (see the loader at the bottom of main.js), after window 'load'
   so it never competes with first paint / LCP.

   It renders into #bg3d, which is sized to #hero (not the full
   viewport) and fades out via a CSS mask toward the bottom of the
   section — the scene supports the hero's text, it doesn't run
   behind the whole page. Low particle count, low opacity, slow
   rotation, and a CSS mask-image keep it a backdrop, not a focal
   point. Paused via IntersectionObserver + visibilitychange so it
   doesn't burn battery once the hero scrolls out of view.
   ============================================================ */
(function(){
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('bg3d');
  if(!hero || !canvas) return;

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, .1, 100);
  camera.position.z = 6;

  const ACCENT = 0xe3a53c;

  // sparse particle field
  const COUNT = 360;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT*3);
  for(let i=0;i<COUNT;i++){
    const r = 4 + Math.random()*2;
    const th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
    pos[i*3]   = r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1] = r*Math.sin(ph)*Math.sin(th);
    pos[i*3+2] = r*Math.cos(ph);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({size:.03, color:ACCENT, transparent:true, opacity:.45}));
  scene.add(points);

  // one quiet wireframe core
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.9,1),
    new THREE.MeshBasicMaterial({color:ACCENT, wireframe:true, transparent:true, opacity:.14})
  );
  scene.add(ico);

  let tx=0, ty=0;
  hero.addEventListener('mousemove', e=>{
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left)/r.width - .5;
    ty = (e.clientY - r.top)/r.height - .5;
  });

  function resize(){
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w,h);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  let isIntersecting = true;
  new IntersectionObserver(entries=>{ isIntersecting = entries[0].isIntersecting; },{threshold:0}).observe(hero);

  function animate(){
    requestAnimationFrame(animate);
    if(document.hidden || !isIntersecting) return;
    points.rotation.y += .0009; points.rotation.x += .0004;
    ico.rotation.y -= .0016; ico.rotation.x += .0009;
    camera.position.x += (tx*1.1 - camera.position.x)*.04;
    camera.position.y += (-ty*1.1 - camera.position.y)*.04;
    camera.lookAt(scene.position);
    renderer.render(scene,camera);
  }
  requestAnimationFrame(animate);
})();

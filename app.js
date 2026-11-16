/* ATIKUR WEAR — interactive 3D clothing rail (demo concept store) */

const PRODUCTS = [
  {
    id: 'hoodie-black', cat: 'hoodie', name: 'Oversized Hoodie', price: 85, img: 'assets/cut/hoodie.png',
    desc: 'Heavyweight 480gsm brushed fleece hoodie with dropped shoulders, kangaroo pocket and adjustable drawstrings. Cut oversized for a relaxed streetwear fit.',
    colors: [
      { name: 'Black', dot: '#1a1a1a', filter: 'none' },
      { name: 'Charcoal', dot: '#4a4a4a', filter: 'brightness(1.7)' },
      { name: 'Olive', dot: '#5a5a32', filter: 'brightness(1.5) sepia(0.55) hue-rotate(35deg)' },
      { name: 'Navy', dot: '#223a5e', filter: 'brightness(1.4) sepia(0.6) hue-rotate(170deg) saturate(1.6)' },
    ],
  },
  {
    id: 'puffer-cream', cat: 'jacket', name: 'Cloud Puffer Jacket', price: 140, img: 'assets/cut/puffer.png',
    desc: 'Quilted puffer with a high storm collar, matte finish and hidden zip pockets. Lightweight warmth with a clean, minimal silhouette.',
    colors: [
      { name: 'Cream', dot: '#e8ddc9', filter: 'none' },
      { name: 'Black', dot: '#1a1a1a', filter: 'brightness(0.22) saturate(0.7)' },
      { name: 'Sage', dot: '#9db08a', filter: 'hue-rotate(55deg) saturate(0.55) brightness(0.95)' },
      { name: 'Sand', dot: '#c9a876', filter: 'sepia(0.45) brightness(0.95)' },
    ],
  },
  {
    id: 'tee-white', cat: 'tee', name: 'Peak Graphic Tee', price: 35, img: 'assets/cut/tee.png',
    desc: 'Premium heavyweight cotton tee with a small embroidered peak graphic. Boxy oversized fit with a soft garment-washed hand feel.',
    colors: [
      { name: 'White', dot: '#f2f2f2', filter: 'none' },
      { name: 'Sage', dot: '#a7b89a', filter: 'hue-rotate(70deg) saturate(0.45) brightness(0.96)' },
      { name: 'Blush', dot: '#e8b8b0', filter: 'sepia(0.35) hue-rotate(-25deg) saturate(1.1)' },
      { name: 'Sky', dot: '#a8c8e0', filter: 'hue-rotate(165deg) saturate(0.45) brightness(0.98)' },
    ],
  },
  {
    id: 'denim-indigo', cat: 'jacket', name: 'Classic Denim Jacket', price: 110, img: 'assets/cut/denim.png',
    desc: 'Authentic trucker jacket in mid-wash indigo denim with chest flap pockets, metal shank buttons and a regular fit that layers over anything.',
    colors: [
      { name: 'Indigo', dot: '#3a5f8a', filter: 'none' },
      { name: 'Black Denim', dot: '#222', filter: 'brightness(0.4) saturate(0.7)' },
      { name: 'Light Wash', dot: '#7fa0c0', filter: 'brightness(1.45) saturate(0.8)' },
      { name: 'Grey', dot: '#888', filter: 'saturate(0)' },
    ],
  },
  {
    id: 'hoodie-olive', cat: 'hoodie', name: 'Olive Fleece Hoodie', price: 89, img: 'assets/cut/hoodie.png',
    desc: 'The same heavyweight oversized hoodie in a washed olive tone. Brushed fleece inside, ribbed cuffs and hem, built to be worn every day.',
    colors: [
      { name: 'Olive', dot: '#5a5a32', filter: 'brightness(1.5) sepia(0.55) hue-rotate(35deg)' },
      { name: 'Black', dot: '#1a1a1a', filter: 'none' },
      { name: 'Charcoal', dot: '#4a4a4a', filter: 'brightness(1.7)' },
      { name: 'Navy', dot: '#223a5e', filter: 'brightness(1.4) sepia(0.6) hue-rotate(170deg) saturate(1.6)' },
    ],
  },
  {
    id: 'puffer-black', cat: 'jacket', name: 'Midnight Puffer Jacket', price: 145, img: 'assets/cut/puffer.png',
    desc: 'The Cloud Puffer in deep matte black. High storm collar, hidden zip pockets and a water-repellent shell for cold city days.',
    colors: [
      { name: 'Black', dot: '#1a1a1a', filter: 'brightness(0.22) saturate(0.7)' },
      { name: 'Cream', dot: '#e8ddc9', filter: 'none' },
      { name: 'Sage', dot: '#9db08a', filter: 'hue-rotate(55deg) saturate(0.55) brightness(0.95)' },
      { name: 'Sand', dot: '#c9a876', filter: 'sepia(0.45) brightness(0.95)' },
    ],
  },
  {
    id: 'tee-sage', cat: 'tee', name: 'Sage Peak Tee', price: 35, img: 'assets/cut/tee.png',
    desc: 'Heavyweight cotton tee in soft sage with the signature peak graphic. Boxy fit, garment-washed for a lived-in feel from day one.',
    colors: [
      { name: 'Sage', dot: '#a7b89a', filter: 'hue-rotate(70deg) saturate(0.45) brightness(0.96)' },
      { name: 'White', dot: '#f2f2f2', filter: 'none' },
      { name: 'Blush', dot: '#e8b8b0', filter: 'sepia(0.35) hue-rotate(-25deg) saturate(1.1)' },
      { name: 'Sky', dot: '#a8c8e0', filter: 'hue-rotate(165deg) saturate(0.45) brightness(0.98)' },
    ],
  },
  {
    id: 'denim-black', cat: 'jacket', name: 'Black Trucker Jacket', price: 115, img: 'assets/cut/denim.png',
    desc: 'The classic trucker cut in rinse-black denim. Metal buttons, chest flap pockets and a fit that goes with everything you own.',
    colors: [
      { name: 'Black Denim', dot: '#222', filter: 'brightness(0.4) saturate(0.7)' },
      { name: 'Indigo', dot: '#3a5f8a', filter: 'none' },
      { name: 'Light Wash', dot: '#7fa0c0', filter: 'brightness(1.45) saturate(0.8)' },
      { name: 'Grey', dot: '#888', filter: 'saturate(0)' },
    ],
  },
];

const SIZES = ['S', 'M', 'L', 'XL'];

/* ---------- build rail ---------- */
const track = document.getElementById('track');
const stage = document.getElementById('stage');
let visible = PRODUCTS.slice();

function buildTrack() {
  track.innerHTML = '';
  visible.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'item';
    el.dataset.index = i;
    el.innerHTML = `<img src="${p.img}" alt="${p.name}" draggable="false" style="filter:${p.colors[0].filter === 'none' ? '' : p.colors[0].filter}"><div class="floor-shadow"></div>`;
    el.addEventListener('click', (e) => {
      if (Math.abs(dragDist) > 6) return;
      openDetail(p);
    });
    track.appendChild(el);
  });
  items = [...track.children];
}
let items = [];
buildTrack();

/* ---------- rail physics ---------- */
let spacing = 210;
let pos = 0;            // current scroll position (float index units * spacing px)
let target = 0;         // snap target
let vel = 0;
let dragging = false;
let dragStartX = 0, dragStartPos = 0, dragDist = 0, lastX = 0, lastT = 0;
let sway = 0, swayVel = 0;
let centerIndex = 0;

function measure() {
  spacing = window.innerWidth < 640 ? 150 : 210;
}
measure();
window.addEventListener('resize', measure);

function clampTarget() {
  const max = (visible.length - 1) * spacing;
  target = Math.max(0, Math.min(max, target));
}

function render(now) {
  // spring toward target when not dragging
  if (!dragging) {
    const spring = (target - pos) * 0.08;
    vel = (vel + spring) * 0.86;
    pos += vel;
    if (Math.abs(target - pos) < 0.5 && Math.abs(vel) < 0.1) { pos = target; vel = 0; }
  }
  // sway physics: driven by scroll velocity + gentle idle swing
  const speed = dragging ? (pos - (render._lp ?? pos)) : vel;
  render._lp = pos;
  swayVel += (-sway * 0.045 - swayVel * 0.06 + speed * 0.004);
  sway += swayVel;
  const t = now / 1000;

  const cx = stage.clientWidth / 2;
  items.forEach((el, i) => {
    const x = cx + i * spacing - pos - cx; // offset from centre in px
    const d = x / spacing;                  // offset in item units
    const ad = Math.abs(d);
    const scale = Math.max(0.62, 1 - ad * 0.13);
    const yArc = ad * ad * 14;
    const phase = Math.sin(t * 1.1 + i * 1.7) * 1.1;
    const rot = sway * (1 + (i % 3) * 0.25) + phase;
    const dim = Math.max(0.45, 1 - ad * 0.16);
    el.style.transform = `translateX(${x}px) translateY(${yArc}px) scale(${scale}) rotate(${rot}deg)`;
    el.style.zIndex = 100 - Math.round(ad * 10);
    el.style.opacity = dim;
    el.style.filter = `brightness(${Math.max(0.72, 1 - ad * 0.09)})`;
    el.classList.toggle('center', Math.round(pos / spacing) === i);
  });

  const ci = Math.max(0, Math.min(visible.length - 1, Math.round(pos / spacing)));
  if (ci !== centerIndex) { centerIndex = ci; updateInfo(); }
  requestAnimationFrame(render);
}

function updateInfo() {
  const p = visible[centerIndex];
  if (!p) return;
  document.getElementById('infoName').textContent = p.name;
  document.getElementById('infoPrice').textContent = '$' + p.price;
  document.getElementById('infoColor').textContent = p.colors[0].name;
}
updateInfo();

/* ---------- drag / wheel / keys ---------- */
stage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.infobar, .view-btn, .hint')) return;
  dragging = true; dragDist = 0;
  dragStartX = lastX = e.clientX; dragStartPos = pos; lastT = performance.now();
  stage.classList.add('dragging');
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  dragDist += Math.abs(dx);
  pos = dragStartPos - (e.clientX - dragStartX);
  const max = (visible.length - 1) * spacing;
  if (pos < -60) pos = -60; if (pos > max + 60) pos = max + 60;
  vel = -dx * 0.9;
});
function endDrag() {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('dragging');
  // snap to nearest, with flick momentum
  target = pos + vel * 6;
  target = Math.round(target / spacing) * spacing;
  clampTarget();
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  target += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
  target = Math.round(target / spacing) * spacing;
  clampTarget();
}, { passive: false });

document.getElementById('prevBtn').addEventListener('click', () => { target -= spacing; clampTarget(); });
document.getElementById('nextBtn').addEventListener('click', () => { target += spacing; clampTarget(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { target -= spacing; clampTarget(); }
  if (e.key === 'ArrowRight') { target += spacing; clampTarget(); }
  if (e.key === 'Escape') closeDetail();
});

/* nav filter */
document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    const f = a.dataset.filter;
    visible = f === 'all' ? PRODUCTS.slice() : PRODUCTS.filter(p => p.cat === f);
    pos = 0; target = 0; vel = 0; centerIndex = -1;
    buildTrack(); updateInfo();
  });
});

/* ---------- detail overlay ---------- */
const detail = document.getElementById('detail');
let current = null, currentColor = 0, currentSize = 'M', bag = 0;

function openDetail(p) {
  current = p; currentColor = 0; currentSize = 'M';
  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailPrice').textContent = '$' + p.price;
  document.getElementById('detailDesc').textContent = p.desc;
  applyColor(0);
  const sw = document.getElementById('swatches');
  sw.innerHTML = '';
  p.colors.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'swatch' + (i === 0 ? ' active' : '');
    b.style.background = c.dot;
    b.title = c.name;
    b.addEventListener('click', () => {
      sw.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      applyColor(i);
    });
    sw.appendChild(b);
  });
  const sz = document.getElementById('sizes');
  sz.innerHTML = '';
  SIZES.forEach(s => {
    const b = document.createElement('button');
    b.className = 'size' + (s === 'M' ? ' active' : '');
    b.textContent = s;
    b.addEventListener('click', () => {
      sz.querySelectorAll('.size').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentSize = s;
    });
    sz.appendChild(b);
  });
  detail.classList.add('open');
  detail.setAttribute('aria-hidden', 'false');
}
function applyColor(i) {
  currentColor = i;
  const c = current.colors[i];
  const img = document.getElementById('detailImg');
  img.src = current.img;
  img.style.filter = c.filter === 'none' ? '' : c.filter;
  document.getElementById('detailColorName').textContent = c.name;
}
function closeDetail() {
  detail.classList.remove('open');
  detail.setAttribute('aria-hidden', 'true');
}
document.getElementById('detailClose').addEventListener('click', closeDetail);
detail.addEventListener('click', (e) => { if (e.target === detail) closeDetail(); });
document.getElementById('viewBtn').addEventListener('click', () => { if (visible[centerIndex]) openDetail(visible[centerIndex]); });

document.getElementById('addBtn').addEventListener('click', () => {
  bag++;
  document.getElementById('bagCount').textContent = bag;
  const toast = document.getElementById('toast');
  toast.textContent = `${current.name} (${current.colors[currentColor].name}, ${currentSize}) — Added to bag ✓`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
  closeDetail();
});
document.getElementById('bagBtn').addEventListener('click', () => {
  const toast = document.getElementById('toast');
  toast.textContent = bag === 0 ? 'Your bag is empty — add something you love.' : `${bag} item${bag > 1 ? 's' : ''} in your bag (demo checkout coming soon).`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
});

/* hide hint after first drag */
stage.addEventListener('pointerdown', () => {
  document.getElementById('hint').style.display = 'none';
}, { once: true });

requestAnimationFrame(render);

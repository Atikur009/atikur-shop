/* ATIKUR WEAR — Sneaker showcase: rotate, animated colourways, shop the drop */
const SHOES = [
  { name: 'Orbit X1', ghost: 'ORBIT', price: 129, img: 'assets/cut/orbit.png',
    desc: 'High-top court cushioning with a sculpted sole. Built for the game, styled for the street.',
    variants: [
      { name: 'White / Black', dot: '#f2f2f2', filter: 'none' },
      { name: 'Triple Black', dot: '#1a1a1a', filter: 'brightness(.32) saturate(.4)' },
      { name: 'Crimson', dot: '#c0272d', filter: 'sepia(.9) hue-rotate(-35deg) saturate(3.2) brightness(.95)' },
    ] },
  { name: 'Court Classic', ghost: 'COURT', price: 89, img: 'assets/cut/court.png',
    desc: 'The clean low-top that goes with everything. Crisp leather, gum-free cupsole, zero fuss.',
    variants: [
      { name: 'Royal / White', dot: '#3a6ea5', filter: 'none' },
      { name: 'All White', dot: '#f2f2f2', filter: 'brightness(1.35) saturate(.35)' },
      { name: 'Black / Gum', dot: '#1a1a1a', filter: 'brightness(.38) saturate(.5)' },
    ] },
  { name: 'Retro High 86', ghost: 'RETRO', price: 119, img: 'assets/cut/retro.png',
    desc: 'An 86 silhouette with padded collar and old-school hoops energy. Loud, on purpose.',
    variants: [
      { name: 'Red / Black', dot: '#c0272d', filter: 'none' },
      { name: 'Triple Black', dot: '#1a1a1a', filter: 'brightness(.3) saturate(.4)' },
      { name: 'White / Red', dot: '#e8e8e8', filter: 'brightness(1.45) saturate(.65)' },
    ] },
  { name: 'Velocity Runner', ghost: 'VELOCITY', price: 99, img: 'assets/cut/runner.png',
    desc: 'Featherweight mesh runner on a grippy gum sole. Made for daily miles and city light.',
    variants: [
      { name: 'Cream / Gum', dot: '#e6ddc9', filter: 'none' },
      { name: 'Olive', dot: '#6b6b3a', filter: 'hue-rotate(55deg) saturate(.75) brightness(.92)' },
      { name: 'All Black', dot: '#1a1a1a', filter: 'brightness(.3) saturate(.4)' },
    ] },
];
const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const SHADOW = 'drop-shadow(0 34px 30px rgba(0,0,0,.55))';

const stage = document.getElementById('stage');
const shoeZone = document.getElementById('shoeZone');
const flip = document.getElementById('flip');
const flipInner = document.getElementById('flipInner');
const shoeFront = document.getElementById('shoeFront');
const shoeBack = document.getElementById('shoeBack');
const ghost = document.getElementById('ghost');
const shoeName = document.getElementById('shoeName');
const shoePrice = document.getElementById('shoePrice');
const shoeDesc = document.getElementById('shoeDesc');
const sizesEl = document.getElementById('sizes');
const colorwaysEl = document.getElementById('colorways');
const colorName = document.getElementById('colorName');
const thumbsEl = document.getElementById('thumbs');
const pageNum = document.getElementById('pageNum');
const bagCount = document.getElementById('bagCount');
const toast = document.getElementById('toast');
const rotFront = document.getElementById('rotFront');
const rotBack = document.getElementById('rotBack');

let bag = 0;
let current = 0;
let selectedSize = 'UK 9';
let selectedVariant = 0;

/* ---------- rotation state ---------- */
let rot = 0, rotTarget = 0;
let spinning = false, spinStart = 0, spinFrom = 0;
const SPIN_MS = 900;

function normRot() { return ((rot % 360) + 360) % 360; }
function updatePills() {
  const back = normRot() >= 90 && normRot() < 270;
  rotFront.classList.toggle('active', !back);
  rotBack.classList.toggle('active', back);
}
function tick(now) {
  if (spinning) {
    const t = Math.min(1, (now - spinStart) / SPIN_MS);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    rot = spinFrom + 360 * e;
    if (t >= 1) { spinning = false; rot = 0; rotTarget = 0; }
  } else {
    rot += (rotTarget - rot) * 0.14;
    if (Math.abs(rotTarget - rot) < 0.3) rot = rotTarget;
  }
  flipInner.style.transform = `rotateY(${rot}deg)`;
  updatePills();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function spin360() {
  if (spinning) return;
  spinning = true;
  spinStart = performance.now();
  spinFrom = normRot();
  rotTarget = 0;
}
rotFront.addEventListener('click', () => { spinning = false; rotTarget = 0; });
rotBack.addEventListener('click', () => { spinning = false; rotTarget = 180; });
document.getElementById('rotSpin').addEventListener('click', spin360);

/* drag to rotate */
let dragging = false, dragStartX = 0, dragStartRot = 0, dragMoved = 0, dragStartTime = 0;
shoeZone.addEventListener('pointerdown', (e) => {
  dragging = true; spinning = false;
  dragStartX = e.clientX; dragStartRot = normRot() > 180 ? normRot() - 360 : normRot();
  rot = dragStartRot; rotTarget = dragStartRot;
  dragMoved = 0; dragStartTime = performance.now();
  shoeZone.classList.add('dragging');
  shoeZone.setPointerCapture(e.pointerId);
});
shoeZone.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - dragStartX;
  dragMoved = Math.max(dragMoved, Math.abs(dx));
  rotTarget = Math.max(0, Math.min(180, dragStartRot + dx * 0.45));
  rot = rotTarget;
});
function endDrag() {
  if (!dragging) return;
  dragging = false;
  shoeZone.classList.remove('dragging');
  if (dragMoved < 6 && performance.now() - dragStartTime < 400) { spin360(); return; }
  rotTarget = rotTarget > 90 ? 180 : 0;
}
shoeZone.addEventListener('pointerup', endDrag);
shoeZone.addEventListener('pointercancel', endDrag);

/* ---------- colourways (animated change) ---------- */
function applyFilter(v) {
  const f = v.filter === 'none' ? SHADOW : `${v.filter} ${SHADOW}`;
  shoeFront.style.filter = f;
  shoeBack.style.filter = (v.filter === 'none' ? 'brightness(.96)' : `${v.filter} brightness(.96)`) + ' ' + SHADOW;
}
function renderColorways(shoe) {
  colorwaysEl.innerHTML = '';
  shoe.variants.forEach((v, vi) => {
    const b = document.createElement('button');
    b.className = 'colorway' + (vi === selectedVariant ? ' active' : '');
    b.style.background = v.dot;
    b.title = v.name;
    b.addEventListener('click', () => {
      if (vi === selectedVariant) return;
      selectedVariant = vi;
      colorName.textContent = v.name;
      renderColorways(shoe);
      // animated morph: fade+shrink, swap colour mid-animation, fade back
      flip.classList.remove('swap'); void flip.offsetWidth;
      flip.classList.add('swap');
      setTimeout(() => applyFilter(v), 170);
    });
    colorwaysEl.appendChild(b);
  });
}

/* ---------- sizes / thumbs / switching ---------- */
function renderSizes() {
  sizesEl.innerHTML = '';
  SIZES.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'size' + (s === selectedSize ? ' active' : '');
    b.textContent = s;
    b.addEventListener('click', () => { selectedSize = s; renderSizes(); });
    sizesEl.appendChild(b);
  });
}
function renderThumbs() {
  thumbsEl.innerHTML = '';
  SHOES.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'thumb' + (i === current ? ' active' : '');
    b.innerHTML = `<img src="${s.img}" alt="${s.name}">`;
    b.addEventListener('click', () => showShoe(i, true));
    thumbsEl.appendChild(b);
  });
}
function showShoe(i, animate) {
  current = (i + SHOES.length) % SHOES.length;
  const s = SHOES[current];
  selectedVariant = 0; selectedSize = 'UK 9';
  rot = 0; rotTarget = 0; spinning = false;
  shoeFront.src = s.img; shoeBack.src = s.img;
  shoeFront.alt = s.name;
  applyFilter(s.variants[0]);
  if (animate) {
    flip.classList.remove('enter'); void flip.offsetWidth;
    flip.classList.add('enter');
    ghost.classList.remove('swap'); void ghost.offsetWidth;
    ghost.classList.add('swap');
  }
  ghost.textContent = s.ghost;
  shoeName.textContent = s.name;
  shoePrice.textContent = '$' + s.price + '.00';
  shoeDesc.textContent = s.desc;
  colorName.textContent = s.variants[0].name;
  renderColorways(s);
  renderSizes();
  renderThumbs();
  pageNum.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(SHOES.length).padStart(2, '0');
}
document.getElementById('pagePrev').addEventListener('click', () => showShoe(current - 1, true));
document.getElementById('pageNext').addEventListener('click', () => showShoe(current + 1, true));
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') showShoe(current - 1, true);
  if (e.key === 'ArrowRight') showShoe(current + 1, true);
});
let lastWheel = 0;
stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const now = performance.now();
  if (now - lastWheel < 600) return;
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(d) < 8) return;
  lastWheel = now;
  showShoe(current + (d > 0 ? 1 : -1), true);
}, { passive: false });

/* ---------- bag ---------- */
document.getElementById('addBtn').addEventListener('click', () => {
  bag++;
  bagCount.textContent = bag;
  const s = SHOES[current];
  toast.textContent = `${s.name} (${s.variants[selectedVariant].name}, ${selectedSize}) — added to bag ✓`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
document.getElementById('bagBtn').addEventListener('click', () => {
  toast.textContent = bag === 0 ? 'Your bag is empty' : bag + (bag === 1 ? ' item' : ' items') + ' in your bag';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

showShoe(0, false);

/* ATIKUR WEAR — Sneakers, hubahu reference: orbit view + focused detail view */
const SHOES = [
  { line1: 'ORBIT', line2: 'X1', price: 129, img: 'assets/cut/orbit.png', sel: 0,
    desc: 'High-top court cushioning with a sculpted sole. Built for the game, styled for the street.',
    variants: [
      { name: 'White / Black', dot: '#f2f2f2', filter: 'none' },
      { name: 'Triple Black', dot: '#1a1a1a', filter: 'brightness(.32) saturate(.4)' },
      { name: 'Crimson', dot: '#c0272d', filter: 'sepia(.9) hue-rotate(-35deg) saturate(3.2) brightness(.95)' },
    ] },
  { line1: 'COURT', line2: 'CLASSIC', price: 89, img: 'assets/cut/court.png', sel: 0,
    desc: 'The clean low-top that goes with everything. Crisp leather, cupsole, zero fuss.',
    variants: [
      { name: 'Royal / White', dot: '#3a6ea5', filter: 'none' },
      { name: 'All White', dot: '#f2f2f2', filter: 'brightness(1.35) saturate(.35)' },
      { name: 'Black / Gum', dot: '#1a1a1a', filter: 'brightness(.38) saturate(.5)' },
    ] },
  { line1: 'RETRO HIGH', line2: '86', price: 119, img: 'assets/cut/retro.png', sel: 0,
    desc: 'An 86 silhouette with padded collar and old-school hoops energy. Loud, on purpose.',
    variants: [
      { name: 'Red / Black', dot: '#c0272d', filter: 'none' },
      { name: 'Triple Black', dot: '#1a1a1a', filter: 'brightness(.3) saturate(.4)' },
      { name: 'White / Red', dot: '#e8e8e8', filter: 'brightness(1.45) saturate(.65)' },
    ] },
  { line1: 'VELOCITY', line2: 'RUNNER', price: 99, img: 'assets/cut/runner.png', sel: 0,
    desc: 'Featherweight mesh runner on a grippy gum sole. Made for daily miles and city light.',
    variants: [
      { name: 'Cream / Gum', dot: '#e6ddc9', filter: 'none' },
      { name: 'Olive', dot: '#6b6b3a', filter: 'hue-rotate(55deg) saturate(.75) brightness(.92)' },
      { name: 'All Black', dot: '#1a1a1a', filter: 'brightness(.3) saturate(.4)' },
    ] },
];
const SIZES = ['40', '41', '42', '43', '44', '45', '46'];
const ORBIT_SHADOW = 'drop-shadow(0 26px 22px rgba(0,0,0,.18))';
const FOCUS_SHADOW = 'drop-shadow(0 30px 26px rgba(0,0,0,.20))';
/* orbit slots: x/y fractions of stage, scale, rotation */
const SLOTS = [
  { x: 0.44, y: 0.42, s: 1.00, r: -8 },
  { x: 0.70, y: 0.16, s: 0.60, r: 12 },
  { x: 0.83, y: 0.54, s: 0.48, r: -16 },
  { x: 0.14, y: 0.62, s: 0.55, r: 10 },
];

const stage = document.getElementById('stage');
const orbitField = document.getElementById('orbitField');
const orbitCount = document.getElementById('orbitCount');
const orbitName = document.getElementById('orbitName');
const orbitPrice = document.getElementById('orbitPrice');
const wheelTrack = document.getElementById('wheelTrack');
const wheelFill = document.getElementById('wheelFill');
const wheelHandle = document.getElementById('wheelHandle');
const focused = document.getElementById('focused');
const shoeZone = document.getElementById('shoeZone');
const flip = document.getElementById('flip');
const flipInner = document.getElementById('flipInner');
const shoeFront = document.getElementById('shoeFront');
const shoeBack = document.getElementById('shoeBack');
const shoeName = document.getElementById('shoeName');
const shoePrice = document.getElementById('shoePrice');
const shoeDesc = document.getElementById('shoeDesc');
const sizeGrid = document.getElementById('sizeGrid');
const colorwaysEl = document.getElementById('colorways');
const colorName = document.getElementById('colorName');
const ctaBtn = document.getElementById('ctaBtn');
const thumbsEl = document.getElementById('thumbs');
const pageNum = document.getElementById('pageNum');
const bagCount = document.getElementById('bagCount');
const toast = document.getElementById('toast');

let bag = 0;
let current = 0;
let selectedSize = null;
let focusedOpen = false;

/* ---------- orbit view ---------- */
const orbitEls = SHOES.map((s, i) => {
  const el = document.createElement('div');
  el.className = 'orbit-shoe';
  el.dataset.index = i;
  el.innerHTML = `<img src="${s.img}" alt="${s.line1} ${s.line2}" draggable="false">`;
  el.firstElementChild.addEventListener('load', renderOrbit);
  orbitField.appendChild(el);
  return el;
});

function renderOrbit() {
  const W = stage.clientWidth, H = stage.clientHeight;
  orbitEls.forEach((el, i) => {
    const slot = SLOTS[(i - current + SHOES.length) % SHOES.length];
    const w = el.offsetWidth, h = el.offsetHeight;
    const x = slot.x * W - w / 2;
    const y = slot.y * H - h / 2;
    el.style.transform = `translate(${x}px, ${y}px) scale(${slot.s}) rotate(${slot.r}deg)`;
    el.style.zIndex = slot.s === 1 ? '3' : '2';
    el.style.opacity = '1';
    const v = SHOES[i].variants[SHOES[i].sel];
    el.firstElementChild.style.filter = v.filter === 'none' ? ORBIT_SHADOW : `${v.filter} ${ORBIT_SHADOW}`;
  });
  orbitCount.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(SHOES.length).padStart(2, '0');
  orbitName.innerHTML = SHOES[current].line1 + '<br>' + SHOES[current].line2;
  orbitPrice.textContent = '$' + SHOES[current].price + '.00';
  const pct = SHOES.length > 1 ? (current / (SHOES.length - 1)) * 100 : 0;
  wheelFill.style.width = pct + '%';
  wheelHandle.style.left = pct + '%';
}
function setCurrent(i, animateName) {
  current = (i + SHOES.length) % SHOES.length;
  renderOrbit();
  if (animateName) {
    orbitName.classList.remove('swap'); void orbitName.offsetWidth;
    orbitName.classList.add('swap');
  }
}
window.addEventListener('resize', renderOrbit);
window.addEventListener('load', renderOrbit);

/* orbit drag: swipe to cycle, click shoe to focus/select */
let oDragging = false, oStartX = 0, oMoved = 0, oStartTime = 0;
stage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.wheel-wrap') || e.target.closest('.details-link')) return;
  oDragging = true; oStartX = e.clientX; oMoved = 0; oStartTime = performance.now();
  stage.classList.add('dragging');
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove', (e) => {
  if (!oDragging) return;
  oMoved = Math.max(oMoved, Math.abs(e.clientX - oStartX));
});
function oEndDrag(e) {
  if (!oDragging) return;
  oDragging = false;
  stage.classList.remove('dragging');
  const dx = e.clientX - oStartX;
  if (Math.abs(dx) > 60) { setCurrent(current + (dx < 0 ? 1 : -1), true); return; }
  if (oMoved < 6 && performance.now() - oStartTime < 400) {
    const t = document.elementFromPoint(e.clientX, e.clientY);
    const shoeEl = t && t.closest ? t.closest('.orbit-shoe') : null;
    if (shoeEl) {
      const idx = Number(shoeEl.dataset.index);
      if (idx === current) openFocused(idx);
      else setCurrent(idx, true);
    }
  }
}
stage.addEventListener('pointerup', oEndDrag);
stage.addEventListener('pointercancel', oEndDrag);

let lastWheel = 0;
stage.addEventListener('wheel', (e) => {
  if (focusedOpen) return;
  e.preventDefault();
  const now = performance.now();
  if (now - lastWheel < 600) return;
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(d) < 8) return;
  lastWheel = now;
  setCurrent(current + (d > 0 ? 1 : -1), true);
}, { passive: false });

/* wheel slider */
let wDragging = false;
function wheelIndexFromEvent(e) {
  const r = wheelTrack.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  return Math.round(p * (SHOES.length - 1));
}
wheelTrack.addEventListener('pointerdown', (e) => {
  wDragging = true;
  wheelTrack.setPointerCapture(e.pointerId);
  setCurrent(wheelIndexFromEvent(e), true);
});
wheelTrack.addEventListener('pointermove', (e) => {
  if (!wDragging) return;
  setCurrent(wheelIndexFromEvent(e), false);
});
wheelTrack.addEventListener('pointerup', () => { wDragging = false; });
wheelTrack.addEventListener('pointercancel', () => { wDragging = false; });

document.getElementById('orbitDetails').addEventListener('click', () => openFocused(current));

/* ---------- focused view ---------- */
let rot = 0, rotTarget = 0;
let spinning = false, spinStart = 0, spinFrom = 0;
const SPIN_MS = 900;
let fDragging = false, swayAmp = 1;

function normRot() { return ((rot % 360) + 360) % 360; }
function tick(now) {
  if (focusedOpen) {
    swayAmp += (((fDragging || spinning) ? 0 : 1) - swayAmp) * 0.05;
    if (spinning) {
      const t = Math.min(1, (now - spinStart) / SPIN_MS);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      rot = spinFrom + 360 * e;
      if (t >= 1) { spinning = false; rot = 0; rotTarget = 0; }
    } else {
      rot += (rotTarget - rot) * 0.14;
      if (Math.abs(rotTarget - rot) < 0.3) rot = rotTarget;
    }
    const sway = Math.sin(now / 900) * 7 * swayAmp;
    const shown = rot + sway;
    flipInner.style.transform = `rotateY(${shown}deg)`;
    // face switch at edge-on: immune to backface-visibility/filter quirks
    const nr = ((shown % 360) + 360) % 360;
    const showBack = nr >= 90 && nr < 270;
    shoeFront.style.opacity = showBack ? '0' : '1';
    shoeBack.style.opacity = showBack ? '1' : '0';
  }
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

let fStartX = 0, fStartRot = 0, fMoved = 0, fStartTime = 0;
shoeZone.addEventListener('pointerdown', (e) => {
  fDragging = true; spinning = false;
  fStartX = e.clientX;
  fStartRot = normRot() > 180 ? normRot() - 360 : normRot();
  rot = fStartRot; rotTarget = fStartRot;
  fMoved = 0; fStartTime = performance.now();
  shoeZone.classList.add('dragging');
  shoeZone.setPointerCapture(e.pointerId);
});
shoeZone.addEventListener('pointermove', (e) => {
  if (!fDragging) return;
  const dx = e.clientX - fStartX;
  fMoved = Math.max(fMoved, Math.abs(dx));
  rotTarget = Math.max(0, Math.min(180, fStartRot + dx * 0.45));
  rot = rotTarget;
});
function fEndDrag() {
  if (!fDragging) return;
  fDragging = false;
  shoeZone.classList.remove('dragging');
  if (fMoved < 6 && performance.now() - fStartTime < 400) { spin360(); return; }
  rotTarget = rotTarget > 90 ? 180 : 0;
}
shoeZone.addEventListener('pointerup', fEndDrag);
shoeZone.addEventListener('pointercancel', fEndDrag);

function applyFocusFilter(shoe) {
  const v = shoe.variants[shoe.sel];
  shoeFront.style.filter = v.filter === 'none' ? FOCUS_SHADOW : `${v.filter} ${FOCUS_SHADOW}`;
  shoeBack.style.filter = (v.filter === 'none' ? 'brightness(.96)' : `${v.filter} brightness(.96)`) + ' ' + FOCUS_SHADOW;
}
function renderColorways(shoe) {
  colorwaysEl.innerHTML = '';
  shoe.variants.forEach((v, vi) => {
    const b = document.createElement('button');
    b.className = 'colorway' + (vi === shoe.sel ? ' active' : '');
    b.style.background = v.dot;
    b.title = v.name;
    b.addEventListener('click', () => {
      if (vi === shoe.sel) return;
      shoe.sel = vi;
      colorName.textContent = v.name;
      renderColorways(shoe);
      flip.classList.remove('swap'); void flip.offsetWidth;
      flip.classList.add('swap');
      setTimeout(() => { applyFocusFilter(shoe); renderOrbit(); }, 170);
    });
    colorwaysEl.appendChild(b);
  });
}
function renderSizes() {
  sizeGrid.innerHTML = '';
  SIZES.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'size-cell' + (s === selectedSize ? ' active' : '');
    b.textContent = s;
    b.addEventListener('click', () => { selectedSize = s; renderSizes(); renderCta(); });
    sizeGrid.appendChild(b);
  });
}
function renderCta() {
  const s = SHOES[current];
  if (selectedSize) {
    ctaBtn.textContent = 'ADD TO CART — $' + s.price + '.00';
    ctaBtn.classList.add('ready');
  } else {
    ctaBtn.textContent = 'Select a size';
    ctaBtn.classList.remove('ready');
  }
}
function renderThumbs() {
  thumbsEl.innerHTML = '';
  SHOES.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'thumb' + (i === current ? ' active' : '');
    b.innerHTML = `<img src="${s.img}" alt="${s.line1} ${s.line2}">`;
    b.addEventListener('click', () => showFocused(i, true));
    thumbsEl.appendChild(b);
  });
}
function showFocused(i, animate) {
  current = (i + SHOES.length) % SHOES.length;
  const s = SHOES[current];
  selectedSize = null;
  rot = 0; rotTarget = 0; spinning = false;
  shoeFront.style.opacity = '1'; shoeBack.style.opacity = '0';
  shoeFront.src = s.img; shoeBack.src = s.img;
  shoeFront.alt = s.line1 + ' ' + s.line2;
  applyFocusFilter(s);
  if (animate) {
    flip.classList.remove('enter'); void flip.offsetWidth;
    flip.classList.add('enter');
    const panel = document.querySelector('.focused-panel');
    panel.classList.remove('enter'); void panel.offsetWidth;
    panel.classList.add('enter');
  }
  shoeName.innerHTML = s.line1 + '<br>' + s.line2;
  shoePrice.textContent = '$' + s.price + '.00';
  shoeDesc.textContent = s.desc;
  shoeDesc.classList.remove('show');
  colorName.textContent = s.variants[s.sel].name;
  renderColorways(s);
  renderSizes();
  renderCta();
  renderThumbs();
  pageNum.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(SHOES.length).padStart(2, '0');
  renderOrbit();
}
function openFocused(i) {
  showFocused(i, false);
  focused.classList.add('open');
  focused.setAttribute('aria-hidden', 'false');
  focusedOpen = true;
  flip.classList.remove('enter'); void flip.offsetWidth;
  flip.classList.add('enter');
}
function closeFocused() {
  focused.classList.remove('open');
  focused.setAttribute('aria-hidden', 'true');
  focusedOpen = false;
  renderOrbit();
}
document.getElementById('focusedClose').addEventListener('click', closeFocused);
document.getElementById('pagePrev').addEventListener('click', () => showFocused(current - 1, true));
document.getElementById('pageNext').addEventListener('click', () => showFocused(current + 1, true));
document.getElementById('fullDetails').addEventListener('click', () => shoeDesc.classList.toggle('show'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && focusedOpen) closeFocused();
  if (e.key === 'ArrowLeft') { focusedOpen ? showFocused(current - 1, true) : setCurrent(current - 1, true); }
  if (e.key === 'ArrowRight') { focusedOpen ? showFocused(current + 1, true) : setCurrent(current + 1, true); }
});
ctaBtn.addEventListener('click', () => {
  const s = SHOES[current];
  if (!selectedSize) {
    sizeGrid.classList.remove('pulse'); void sizeGrid.offsetWidth;
    sizeGrid.classList.add('pulse');
    toast.textContent = 'Please select a size first';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
    return;
  }
  bag++;
  bagCount.textContent = bag;
  toast.textContent = `${s.line1} ${s.line2} (EU ${selectedSize}) — added to bag ✓`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
document.getElementById('bagBtn').addEventListener('click', () => {
  toast.textContent = bag === 0 ? 'Your bag is empty' : bag + (bag === 1 ? ' item' : ' items') + ' in your bag';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

renderOrbit();

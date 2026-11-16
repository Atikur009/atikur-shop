/* ATIKUR WEAR — Sneakers, hubahu reference: orbit view + focused detail view.
   True colours only (no filter colourways) + free 360° rotation with momentum.
   Products are data-driven: add an entry to SHOES and it appears everywhere. */
const SHOES = [
  { line1: 'ORBIT', line2: 'X1', price: 129, color: 'White / Black', img: 'assets/cut/orbit.png',
    desc: 'High-top court cushioning with a sculpted sole. Built for the game, styled for the street.' },
  { line1: 'COURT', line2: 'CLASSIC', price: 89, color: 'Royal / White', img: 'assets/cut/court.png',
    desc: 'The clean low-top that goes with everything. Crisp leather, cupsole, zero fuss.' },
  { line1: 'RETRO HIGH', line2: '86', price: 119, color: 'Red / Black', img: 'assets/cut/retro.png',
    desc: 'An 86 silhouette with padded collar and old-school hoops energy. Loud, on purpose.' },
  { line1: 'VELOCITY', line2: 'RUNNER', price: 99, color: 'Cream / Gum', img: 'assets/cut/runner.png',
    desc: 'Featherweight mesh runner on a grippy gum sole. Made for daily miles and city light.' },
  { line1: 'MIDNIGHT', line2: 'HIGH', price: 139, color: 'Black / White', img: 'assets/cut/midnight.png',
    desc: 'Full black leather high-top on a clean white cupsole. Night-shift energy, all day.' },
  { line1: 'FOREST', line2: 'RUNNER', price: 109, color: 'Green / White', img: 'assets/cut/forest.png',
    desc: 'Suede and mesh retro runner in deep forest green. Trail looks, street miles.' },
  { line1: 'NAVY', line2: 'SUEDE', price: 95, color: 'Navy / White', img: 'assets/cut/navy.png',
    desc: 'Soft navy suede low-top with a crisp white sole. Quiet, clean, goes with everything.' },
  { line1: 'EMBER', line2: 'RUNNER', price: 105, color: 'Orange / White', img: 'assets/cut/ember.png',
    desc: 'Breathable mesh runner with ember-orange accents. Built to be noticed at speed.' },
];
const SIZES = ['40', '41', '42', '43', '44', '45', '46'];
/* orbit slots: x/y fractions of stage, scale, rotation. Reused cyclically past 8. */
const SLOTS = [
  { x: 0.44, y: 0.42, s: 1.00, r: -8 },
  { x: 0.70, y: 0.16, s: 0.60, r: 12 },
  { x: 0.83, y: 0.54, s: 0.48, r: -16 },
  { x: 0.14, y: 0.62, s: 0.55, r: 10 },
  { x: 0.60, y: 0.74, s: 0.42, r: -6 },
  { x: 0.88, y: 0.22, s: 0.40, r: 18 },
  { x: 0.24, y: 0.20, s: 0.45, r: -12 },
  { x: 0.06, y: 0.38, s: 0.38, r: 6 },
];
function slotFor(offset) {
  const base = SLOTS[offset % SLOTS.length];
  const tier = Math.floor(offset / SLOTS.length);
  const shrink = Math.pow(0.85, tier);
  return { x: base.x, y: base.y, s: base.s * shrink, r: base.r, o: Math.pow(0.85, tier) };
}

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
const shoeColor = document.getElementById('shoeColor');
const shoeDesc = document.getElementById('shoeDesc');
const sizeGrid = document.getElementById('sizeGrid');
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
    const slot = slotFor((i - current + SHOES.length) % SHOES.length);
    const w = el.offsetWidth, h = el.offsetHeight;
    const x = slot.x * W - w / 2;
    const y = slot.y * H - h / 2;
    el.style.transform = `translate(${x}px, ${y}px) scale(${slot.s}) rotate(${slot.r}deg)`;
    el.style.zIndex = slot.s >= 0.95 ? '3' : '2';
    el.style.opacity = String(slot.o);
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

/* ---------- focused view: free 360° rotation + momentum + tilt ---------- */
let rotY = 0, rotYTarget = 0, rotX = 0, rotXTarget = 0, velY = 0;
let fDragging = false, swayAmp = 1;

function tick(now) {
  if (focusedOpen) {
    swayAmp += (((fDragging || Math.abs(velY) > 1) ? 0 : 1) - swayAmp) * 0.05;
    if (!fDragging) {
      if (Math.abs(velY) > 0.05) { rotYTarget += velY; velY *= 0.94; }
      rotY += (rotYTarget - rotY) * 0.22;
      rotX += (rotXTarget - rotX) * 0.22;
      if (Math.abs(velY) <= 0.05 && Math.abs(rotYTarget - rotY) < 0.05) rotY = rotYTarget;
    }
    const sway = Math.sin(now / 900) * 6 * swayAmp;
    const shown = rotY + sway;
    flipInner.style.transform = `rotateX(${rotX}deg) rotateY(${shown}deg)`;
    const nr = ((shown % 360) + 360) % 360;
    const showBack = nr >= 90 && nr < 270;
    shoeFront.style.opacity = showBack ? '0' : '1';
    shoeBack.style.opacity = showBack ? '1' : '0';
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

let fStartX = 0, fStartY = 0, fStartRotY = 0, fStartRotX = 0, fMoved = 0, fStartTime = 0;
let fSamples = [];
shoeZone.addEventListener('pointerdown', (e) => {
  fDragging = true; velY = 0;
  fStartX = e.clientX; fStartY = e.clientY;
  fStartRotY = rotYTarget; fStartRotX = rotXTarget;
  fMoved = 0; fStartTime = performance.now();
  fSamples = [{ t: performance.now(), y: rotYTarget }];
  shoeZone.classList.add('dragging');
  shoeZone.setPointerCapture(e.pointerId);
});
shoeZone.addEventListener('pointermove', (e) => {
  if (!fDragging) return;
  const dx = e.clientX - fStartX, dy = e.clientY - fStartY;
  fMoved = Math.max(fMoved, Math.abs(dx), Math.abs(dy));
  rotYTarget = fStartRotY + dx * 0.5;
  rotY = rotYTarget;
  rotXTarget = Math.max(-30, Math.min(30, fStartRotX - dy * 0.25));
  rotX = rotXTarget;
  const now = performance.now();
  fSamples.push({ t: now, y: rotYTarget });
  while (fSamples.length > 2 && now - fSamples[0].t > 120) fSamples.shift();
});
function fEndDrag() {
  if (!fDragging) return;
  fDragging = false;
  shoeZone.classList.remove('dragging');
  if (fMoved < 6 && performance.now() - fStartTime < 400) { velY = 24; return; }
  const s = fSamples;
  if (s.length >= 2) {
    const dt = s[s.length - 1].t - s[0].t;
    if (dt > 20) velY = Math.max(-25, Math.min(25, (s[s.length - 1].y - s[0].y) / dt * 16.7));
  }
}
shoeZone.addEventListener('pointerup', fEndDrag);
shoeZone.addEventListener('pointercancel', fEndDrag);

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
  rotY = 0; rotYTarget = 0; rotX = 0; rotXTarget = 0; velY = 0;
  shoeFront.style.opacity = '1'; shoeBack.style.opacity = '0';
  shoeFront.src = s.img; shoeBack.src = s.img;
  shoeFront.alt = s.line1 + ' ' + s.line2;
  if (animate) {
    flip.classList.remove('enter'); void flip.offsetWidth;
    flip.classList.add('enter');
    const panel = document.querySelector('.focused-panel');
    panel.classList.remove('enter'); void panel.offsetWidth;
    panel.classList.add('enter');
  }
  shoeName.innerHTML = s.line1 + '<br>' + s.line2;
  shoePrice.textContent = '$' + s.price + '.00';
  shoeColor.textContent = 'Colour: ' + s.color;
  shoeDesc.textContent = s.desc;
  shoeDesc.classList.remove('show');
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

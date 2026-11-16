/* ATIKUR WEAR — interactive clothing rail (hubahu reference mechanic) */
const PRODUCTS = [
  { id: 'yellow', name: 'Mustard Hooded Jacket', price: 89, img: 'assets/cut/yellow.png', back: 'assets/cut/yellow-back.png',
    variants: [
      { name: 'Mustard', filter: 'none' },
      { name: 'Olive', filter: 'hue-rotate(45deg) saturate(.85)' },
      { name: 'Black', filter: 'brightness(.32) saturate(.4)' },
    ] },
  { id: 'vest', name: 'Dove Vest', price: 65, img: 'assets/cut/vest.png', back: 'assets/cut/vest-back.png',
    variants: [
      { name: 'Rust', filter: 'none' },
      { name: 'Black', filter: 'brightness(.3) saturate(.5)' },
      { name: 'Cream', filter: 'brightness(1.55) saturate(.35)' },
    ] },
  { id: 'green', name: 'Colour-Block Windbreaker', price: 79, img: 'assets/cut/green.png', back: 'assets/cut/green-back.png',
    variants: [
      { name: 'Green / Black', filter: 'none' },
      { name: 'Navy / Black', filter: 'hue-rotate(130deg) saturate(.9)' },
      { name: 'Black', filter: 'brightness(.4) saturate(.3)' },
    ] },
  { id: 'denim', name: 'Classic Denim Jacket', price: 95, img: 'assets/cut/denim.png', back: 'assets/cut/denim-back.png',
    variants: [
      { name: 'Mid Wash', filter: 'none' },
      { name: 'Black', filter: 'brightness(.35) saturate(.5)' },
      { name: 'Light Wash', filter: 'brightness(1.35) saturate(.7)' },
    ] },
  { id: 'hoodie', name: 'Oversized Hoodie', price: 59, img: 'assets/cut/hoodie.png',
    variants: [
      { name: 'Black', filter: 'none' },
      { name: 'Charcoal', filter: 'brightness(1.8) saturate(.6)' },
      { name: 'Sand', filter: 'brightness(2.1) sepia(.55) saturate(1.4)' },
    ] },
  { id: 'puffer', name: 'Cloud Puffer Jacket', price: 129, img: 'assets/cut/puffer.png',
    variants: [
      { name: 'Cream', filter: 'none' },
      { name: 'Black', filter: 'brightness(.3) saturate(.4)' },
      { name: 'Olive', filter: 'hue-rotate(50deg) saturate(.7) brightness(.9)' },
    ] },
  { id: 'stripe', name: 'Striped Poplin Shirt', price: 55, img: 'assets/cut/stripe.png',
    variants: [
      { name: 'Blue Stripe', filter: 'none' },
      { name: 'Black Stripe', filter: 'brightness(.6) saturate(.3)' },
      { name: 'Sage Stripe', filter: 'hue-rotate(90deg) saturate(.7)' },
    ] },
  { id: 'tee', name: 'Mountain Graphic Tee', price: 35, img: 'assets/cut/tee.png',
    variants: [
      { name: 'White', filter: 'none' },
      { name: 'Black', filter: 'brightness(.25) saturate(.3)' },
      { name: 'Sage', filter: 'sepia(.5) hue-rotate(70deg) saturate(.8) brightness(.95)' },
    ] },
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const stage = document.getElementById('stage');
const track = document.getElementById('track');
const productView = document.getElementById('product');
const prodStage = document.getElementById('prodStage');
const prodFlip = document.getElementById('prodFlip');
const prodFlipInner = document.getElementById('prodFlipInner');
const prodImg = document.getElementById('prodImg');
const prodImgBack = document.getElementById('prodImgBack');
const prodName = document.getElementById('prodName');
const prodPrice = document.getElementById('prodPrice');
const prodSizes = document.getElementById('prodSizes');
const prodVariants = document.getElementById('prodVariants');
const bagCount = document.getElementById('bagCount');
const toast = document.getElementById('toast');
const prodRotFront = document.getElementById('prodRotFront');
const prodRotBack = document.getElementById('prodRotBack');
const PROD_SHADOW = 'drop-shadow(0 26px 26px rgba(0,0,0,.20))';

let bag = 0;
let current = 0;
let selectedSize = 'M';
let selectedVariant = 0;

/* ---------- build rail ---------- */
const items = PRODUCTS.map((p, i) => {
  const el = document.createElement('div');
  el.className = 'item';
  el.dataset.index = i;
  el.innerHTML = `<img src="${p.img}" alt="${p.name}" draggable="false"><div class="tag">${p.name}</div>`;
  track.appendChild(el);
  return el;
});

/* ---------- rail physics ---------- */
let spacing = 150;
let offset = 0;
let velocity = 0;
let dragging = false;
let dragStartX = 0, dragStartOffset = 0, dragMoved = 0, dragStartTime = 0;
let sway = 0, swayVel = 0;

function measure() {
  const w = stage.clientWidth;
  spacing = Math.max(96, Math.min(150, w / 7.2));
}
measure();
window.addEventListener('resize', measure);

function centerIndexFloat() { return -offset / spacing; }

function render() {
  const cx = stage.clientWidth / 2;
  const cif = centerIndexFloat();
  items.forEach((el, i) => {
    const d = i - cif;
    const ad = Math.abs(d);
    const x = cx + d * spacing;
    const lift = Math.max(0, 1 - ad);
    const scale = 0.92 + 1.25 * Math.pow(lift, 1.6);
    const rot = sway * Math.pow(lift, 1.4) + Math.max(-6, Math.min(6, velocity * 0.06)) * lift;
    const y = 10 * Math.pow(lift, 2);
    el.style.transform = `translateX(${x - cx}px) translateY(${y}px) scale(${scale}) rotate(${rot}deg)`;
    el.style.zIndex = String(100 - Math.round(ad * 10));
    el.style.opacity = ad > 4.2 ? '0' : '1';
    el.classList.toggle('center', ad < 0.5);
    const img = el.firstElementChild;
    img.style.filter = `drop-shadow(0 ${12 + 22 * lift}px ${14 + 18 * lift}px rgba(0,0,0,${0.14 + 0.14 * lift}))`;
  });
}

function tick() {
  if (!dragging) {
    offset += velocity;
    velocity *= 0.94;
    if (Math.abs(velocity) < 0.05) velocity = 0;
    if (Math.abs(velocity) < 1.2) {
      const target = -Math.round(centerIndexFloat()) * spacing;
      const clamped = Math.max(-(PRODUCTS.length - 1) * spacing, Math.min(0, target));
      offset += (clamped - offset) * 0.12;
      if (Math.abs(clamped - offset) < 0.4) offset = clamped;
    }
    const min = -(PRODUCTS.length - 1) * spacing, max = 0;
    if (offset < min) { offset = min; velocity = 0; }
    if (offset > max) { offset = max; velocity = 0; }
  }
  const accel = -sway * 0.012 - swayVel * 0.06 + velocity * 0.00035;
  swayVel += accel;
  sway += swayVel;
  sway = Math.max(-14, Math.min(14, sway));
  render();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

stage.addEventListener('pointerdown', (e) => {
  dragging = true;
  dragStartX = e.clientX; dragStartOffset = offset; dragMoved = 0;
  dragStartTime = performance.now();
  velocity = 0;
  stage.classList.add('dragging');
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - dragStartX;
  const prev = offset;
  offset = dragStartOffset + dx;
  velocity = offset - prev;
  dragMoved = Math.max(dragMoved, Math.abs(dx));
  swayVel += velocity * 0.002;
});
function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('dragging');
  if (dragMoved < 6 && performance.now() - dragStartTime < 400) {
    const t = document.elementFromPoint(e.clientX, e.clientY);
    const itemEl = t && t.closest ? t.closest('.item') : null;
    if (itemEl) openProduct(Number(itemEl.dataset.index));
    else {
      const ci = Math.round(centerIndexFloat());
      if (ci >= 0 && ci < PRODUCTS.length) openProduct(ci);
    }
  }
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  velocity -= d * 0.35;
  swayVel -= d * 0.0006;
}, { passive: false });

/* ---------- product view: free 360° rotation + momentum + tilt ---------- */
let prodRot = 0, prodRotTarget = 0, prodRotX = 0, prodRotXTarget = 0, prodVelY = 0;

function prodNormRot() { return ((prodRot % 360) + 360) % 360; }
function prodTick() {
  if (productView.classList.contains('open')) {
    if (!prodDragging) {
      if (Math.abs(prodVelY) > 0.05) { prodRotTarget += prodVelY; prodVelY *= 0.94; }
      prodRot += (prodRotTarget - prodRot) * 0.22;
      prodRotX += (prodRotXTarget - prodRotX) * 0.22;
      if (Math.abs(prodVelY) <= 0.05 && Math.abs(prodRotTarget - prodRot) < 0.05) prodRot = prodRotTarget;
    }
    prodFlipInner.style.transform = `rotateX(${prodRotX}deg) rotateY(${prodRot}deg)`;
    const back = prodNormRot() >= 90 && prodNormRot() < 270;
    prodRotFront.classList.toggle('active', !back);
    prodRotBack.classList.toggle('active', back);
    // face switch at edge-on: immune to backface-visibility/filter quirks
    prodImg.style.opacity = back ? '0' : '1';
    prodImgBack.style.opacity = back ? '1' : '0';
  }
  requestAnimationFrame(prodTick);
}
requestAnimationFrame(prodTick);

function prodSpin360() { prodVelY = 24; }
prodRotFront.addEventListener('click', () => { prodVelY = 0; prodRotTarget = Math.round(prodRot / 360) * 360; });
prodRotBack.addEventListener('click', () => { prodVelY = 0; prodRotTarget = Math.round((prodRot - 180) / 360) * 360 + 180; });
document.getElementById('prodRotSpin').addEventListener('click', prodSpin360);

let prodDragging = false, prodDragStartX = 0, prodDragStartY = 0, prodDragStartRot = 0, prodDragStartRotX = 0, prodDragMoved = 0, prodDragStartTime = 0;
let prodSamples = [];
prodStage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.prod-variants')) return;
  prodDragging = true; prodVelY = 0;
  prodDragStartX = e.clientX; prodDragStartY = e.clientY;
  prodDragStartRot = prodRotTarget; prodDragStartRotX = prodRotXTarget;
  prodDragMoved = 0; prodDragStartTime = performance.now();
  prodSamples = [{ t: performance.now(), y: prodRotTarget }];
  prodStage.classList.add('dragging');
  prodStage.setPointerCapture(e.pointerId);
});
prodStage.addEventListener('pointermove', (e) => {
  if (!prodDragging) return;
  const dx = e.clientX - prodDragStartX, dy = e.clientY - prodDragStartY;
  prodDragMoved = Math.max(prodDragMoved, Math.abs(dx), Math.abs(dy));
  prodRotTarget = prodDragStartRot + dx * 0.5;
  prodRot = prodRotTarget;
  prodRotXTarget = Math.max(-30, Math.min(30, prodDragStartRotX - dy * 0.25));
  prodRotX = prodRotXTarget;
  const now = performance.now();
  prodSamples.push({ t: now, y: prodRotTarget });
  while (prodSamples.length > 2 && now - prodSamples[0].t > 120) prodSamples.shift();
});
function prodEndDrag() {
  if (!prodDragging) return;
  prodDragging = false;
  prodStage.classList.remove('dragging');
  if (prodDragMoved < 6 && performance.now() - prodDragStartTime < 400) { prodSpin360(); return; }
  const s = prodSamples;
  if (s.length >= 2) {
    const dt = s[s.length - 1].t - s[0].t;
    if (dt > 20) prodVelY = Math.max(-25, Math.min(25, (s[s.length - 1].y - s[0].y) / dt * 16.7));
  }
}
prodStage.addEventListener('pointerup', prodEndDrag);
prodStage.addEventListener('pointercancel', prodEndDrag);

function applyProdFilter(v) {
  prodImg.style.filter = v.filter === 'none' ? PROD_SHADOW : `${v.filter} ${PROD_SHADOW}`;
  prodImgBack.style.filter = (v.filter === 'none' ? 'brightness(.96)' : `${v.filter} brightness(.96)`) + ' ' + PROD_SHADOW;
}
function renderVariants(p) {
  prodVariants.innerHTML = '';
  p.variants.forEach((v, vi) => {
    const b = document.createElement('button');
    b.className = 'variant-thumb' + (vi === selectedVariant ? ' active' : '');
    b.title = v.name;
    b.innerHTML = `<img src="${p.img}" alt="${v.name}" style="filter:${v.filter}">`;
    b.addEventListener('click', () => {
      if (vi === selectedVariant) return;
      selectedVariant = vi;
      renderVariants(p);
      // animated colour morph: fade+shrink, swap colour mid-animation
      prodFlip.classList.remove('swap'); void prodFlip.offsetWidth;
      prodFlip.classList.add('swap');
      setTimeout(() => applyProdFilter(v), 170);
    });
    prodVariants.appendChild(b);
  });
}
function renderSizes() {
  prodSizes.innerHTML = '';
  SIZES.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'prod-size' + (s === selectedSize ? ' active' : '');
    b.textContent = s;
    b.addEventListener('click', () => { selectedSize = s; renderSizes(); });
    prodSizes.appendChild(b);
  });
}
function showProduct(i, animate) {
  current = (i + PRODUCTS.length) % PRODUCTS.length;
  const p = PRODUCTS[current];
  selectedVariant = 0; selectedSize = 'M';
  prodRot = 0; prodRotTarget = 0; prodRotX = 0; prodRotXTarget = 0; prodVelY = 0;
  prodImg.src = p.img; prodImgBack.src = p.back || p.img;
  prodImgBack.classList.toggle('real-back', !!p.back);
  prodImg.style.opacity = '1'; prodImgBack.style.opacity = '0';
  prodImg.alt = p.name;
  applyProdFilter(p.variants[0]);
  if (animate) {
    prodFlip.classList.remove('enter'); void prodFlip.offsetWidth;
    prodFlip.classList.add('enter');
  }
  prodName.textContent = p.name;
  prodPrice.textContent = '$' + p.price + '.00';
  renderVariants(p);
  renderSizes();
}
function openProduct(i) {
  showProduct(i, false);
  productView.classList.add('open');
  productView.setAttribute('aria-hidden', 'false');
}
function closeProduct() {
  productView.classList.remove('open');
  productView.setAttribute('aria-hidden', 'true');
}
document.getElementById('prodClose').addEventListener('click', closeProduct);
document.getElementById('prodPrev').addEventListener('click', () => showProduct(current - 1, true));
document.getElementById('prodNext').addEventListener('click', () => showProduct(current + 1, true));
document.getElementById('wordmark').addEventListener('click', closeProduct);
document.addEventListener('keydown', (e) => {
  if (!productView.classList.contains('open')) return;
  if (e.key === 'Escape') closeProduct();
  if (e.key === 'ArrowLeft') showProduct(current - 1, true);
  if (e.key === 'ArrowRight') showProduct(current + 1, true);
});
document.getElementById('prodAdd').addEventListener('click', () => {
  bag++;
  bagCount.textContent = bag;
  toast.textContent = PRODUCTS[current].name + ' — added to bag ✓';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
document.getElementById('bagBtn').addEventListener('click', () => {
  toast.textContent = bag === 0 ? 'Your bag is empty' : bag + (bag === 1 ? ' item' : ' items') + ' in your bag';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
document.getElementById('shopLink').addEventListener('click', (e) => { e.preventDefault(); closeProduct(); });

render();

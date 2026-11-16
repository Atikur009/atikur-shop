/* ATIKUR WEAR — Try the Look carousel */
const LOOKS = [
  { name: 'Studio Day', img: 'assets/look1.jpg',
    desc: 'Clean whites and soft greys. The everyday oversized fit, studio-ready.',
    items: [
      { name: 'Oversized White Tee', note: 'Heavyweight cotton', price: 35, thumb: 'assets/look1-top.jpg' },
      { name: 'Grey Sweat Shorts', note: 'Relaxed fit', price: 32, thumb: 'assets/look1-bottom.jpg' },
      { name: 'Court Sneakers — White', note: 'Leather', price: 58, thumb: 'assets/look1-shoes.jpg' },
    ] },
  { name: 'Sand Tones', img: 'assets/look2.jpg',
    desc: 'Warm cream and khaki, wide and easy. Soft tailoring for slow days.',
    items: [
      { name: 'Cream Oversized Tee', note: 'Heavyweight cotton', price: 35, thumb: 'assets/look2-top.jpg' },
      { name: 'Khaki Wide Trousers', note: 'Pleated, high rise', price: 62, thumb: 'assets/look2-bottom.jpg' },
      { name: 'Court Sneakers — White', note: 'Leather', price: 58, thumb: 'assets/look2-shoes.jpg' },
    ] },
  { name: 'Field Olive', img: 'assets/look3.jpg',
    desc: 'Olive and black with cargo utility. Built for the street, styled for the studio.',
    items: [
      { name: 'Olive Oversized Tee', note: 'Heavyweight cotton', price: 35, thumb: 'assets/look3-top.jpg' },
      { name: 'Black Cargo Pants', note: 'Six-pocket utility', price: 68, thumb: 'assets/look3-bottom.jpg' },
      { name: 'Runner Sneakers — Black', note: 'Mesh + suede', price: 64, thumb: 'assets/look3-shoes.jpg' },
    ] },
  { name: 'Mono Black', img: 'assets/look4.jpg',
    desc: 'All black up top, grey below. The simplest look in the rail — and the sharpest.',
    items: [
      { name: 'Black Oversized Tee', note: 'Heavyweight cotton', price: 35, thumb: 'assets/look4-top.jpg' },
      { name: 'Grey Sweat Shorts', note: 'Relaxed fit', price: 32, thumb: 'assets/look4-bottom.jpg' },
      { name: 'Court Sneakers — White', note: 'Leather', price: 58, thumb: 'assets/look4-shoes.jpg' },
    ] },
];

const stage = document.getElementById('stage');
const track = document.getElementById('track');
const detail = document.getElementById('detail');
const detPhoto = document.getElementById('detPhoto');
const detName = document.getElementById('detName');
const detDesc = document.getElementById('detDesc');
const detItems = document.getElementById('detItems');
const detTotal = document.getElementById('detTotal');
const bagCount = document.getElementById('bagCount');
const toast = document.getElementById('toast');

let bag = 0;
let current = 0;

const cards = LOOKS.map((l, i) => {
  const el = document.createElement('div');
  el.className = 'card';
  el.dataset.index = i;
  el.innerHTML = `<img src="${l.img}" alt="${l.name}" draggable="false">
    <div class="card-label"><div class="name">${l.name}</div><span class="view">VIEW LOOK</span></div>`;
  track.appendChild(el);
  return el;
});

/* ---------- carousel physics ---------- */
let spacing = 320;
let offset = 0;
let velocity = 0;
let dragging = false;
let dragStartX = 0, dragStartOffset = 0, dragMoved = 0, dragStartTime = 0;

function measure() {
  spacing = Math.max(240, Math.min(330, stage.clientWidth / 3.6));
}
measure();
window.addEventListener('resize', measure);

function centerIndexFloat() { return -offset / spacing; }

function render() {
  const cx = stage.clientWidth / 2;
  const cif = centerIndexFloat();
  cards.forEach((el, i) => {
    const d = i - cif;
    const ad = Math.abs(d);
    const x = cx + d * spacing;
    const lift = Math.max(0, 1 - ad);
    const scale = 0.78 + 0.34 * Math.pow(lift, 1.4);
    const blur = Math.min(7, Math.max(0, (ad - 0.35) * 5));
    el.style.transform = `translateX(${x - cx}px) scale(${scale})`;
    el.style.zIndex = String(100 - Math.round(ad * 10));
    el.style.opacity = ad > 2.6 ? '0' : String(1 - Math.max(0, ad - 1.6) * 0.5);
    el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none';
    el.classList.toggle('center', ad < 0.5);
  });
}

function tick() {
  if (!dragging) {
    offset += velocity;
    velocity *= 0.93;
    if (Math.abs(velocity) < 0.05) velocity = 0;
    if (Math.abs(velocity) < 1.2) {
      const target = -Math.round(centerIndexFloat()) * spacing;
      const clamped = Math.max(-(LOOKS.length - 1) * spacing, Math.min(0, target));
      offset += (clamped - offset) * 0.12;
      if (Math.abs(clamped - offset) < 0.4) offset = clamped;
    }
    const min = -(LOOKS.length - 1) * spacing, max = 0;
    if (offset < min) { offset = min; velocity = 0; }
    if (offset > max) { offset = max; velocity = 0; }
  }
  render();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function goTo(i) {
  const clamped = Math.max(0, Math.min(LOOKS.length - 1, i));
  offset = -clamped * spacing;
  velocity = 0;
}
document.getElementById('carPrev').addEventListener('click', () => goTo(Math.round(centerIndexFloat()) - 1));
document.getElementById('carNext').addEventListener('click', () => goTo(Math.round(centerIndexFloat()) + 1));

stage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.car-arrow')) return;
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
});
function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('dragging');
  if (dragMoved < 6 && performance.now() - dragStartTime < 400) {
    const t = document.elementFromPoint(e.clientX, e.clientY);
    const cardEl = t && t.closest ? t.closest('.card') : null;
    if (cardEl) {
      const idx = Number(cardEl.dataset.index);
      if (Math.abs(idx - centerIndexFloat()) < 0.5) openDetail(idx);
      else goTo(idx);
    }
  }
}
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

stage.addEventListener('wheel', (e) => {
  e.preventDefault();
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  velocity -= d * 0.4;
}, { passive: false });

/* ---------- detail view ---------- */
function showDetail(i, animate) {
  current = (i + LOOKS.length) % LOOKS.length;
  const l = LOOKS[current];
  detPhoto.src = l.img;
  detPhoto.alt = l.name;
  if (animate) {
    detPhoto.classList.remove('swap'); void detPhoto.offsetWidth;
    detPhoto.classList.add('swap');
  }
  detName.textContent = l.name;
  detDesc.textContent = l.desc;
  detItems.innerHTML = '';
  let total = 0;
  l.items.forEach((it) => {
    total += it.price;
    const row = document.createElement('div');
    row.className = 'det-item';
    row.innerHTML = `<img src="${it.thumb}" alt="${it.name}">
      <div class="it-name">${it.name}<span>${it.note}</span></div>
      <div class="it-price">$${it.price}.00</div>`;
    const add = document.createElement('button');
    add.className = 'it-add';
    add.textContent = '+';
    add.setAttribute('aria-label', 'Add ' + it.name);
    add.addEventListener('click', () => {
      add.classList.add('added'); add.textContent = '✓';
      addToBag(it.name);
    });
    row.appendChild(add);
    detItems.appendChild(row);
  });
  detTotal.textContent = '$' + total + '.00';
}
function openDetail(i) {
  showDetail(i, false);
  detail.classList.add('open');
  detail.setAttribute('aria-hidden', 'false');
}
function closeDetail() {
  detail.classList.remove('open');
  detail.setAttribute('aria-hidden', 'true');
}
document.getElementById('detClose').addEventListener('click', closeDetail);
document.getElementById('detPrev').addEventListener('click', () => showDetail(current - 1, true));
document.getElementById('detNext').addEventListener('click', () => showDetail(current + 1, true));
document.getElementById('wordmark').addEventListener('click', closeDetail);
document.addEventListener('keydown', (e) => {
  if (!detail.classList.contains('open')) return;
  if (e.key === 'Escape') closeDetail();
  if (e.key === 'ArrowLeft') showDetail(current - 1, true);
  if (e.key === 'ArrowRight') showDetail(current + 1, true);
});
function addToBag(what) {
  bag++;
  bagCount.textContent = bag;
  toast.textContent = what + ' — added to bag ✓';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}
document.getElementById('detAdd').addEventListener('click', () => {
  bag += LOOKS[current].items.length;
  bagCount.textContent = bag;
  toast.textContent = LOOKS[current].name + ' look — added to bag ✓';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
document.getElementById('bagBtn').addEventListener('click', () => {
  toast.textContent = bag === 0 ? 'Your bag is empty' : bag + (bag === 1 ? ' item' : ' items') + ' in your bag';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});

render();

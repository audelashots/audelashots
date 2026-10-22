const cards = [...document.querySelectorAll('.photo-card')];
// Charge les photos locales ; en cas d'absence, conserve la vignette de remplacement.
cards.forEach(card => {
  const visual = card.querySelector('.photo-visual');
  const photo = document.createElement('img');
  photo.className = 'actual-photo';
  photo.src = card.dataset.src;
  photo.alt = '';
  photo.loading = 'lazy';
  photo.decoding = 'async';
  photo.onload = () => {
    visual.classList.add('has-photo');
    visual.classList.remove('is-missing');
    visual.querySelector('.scene-label')?.setAttribute('hidden', '');
  };
  photo.onerror = () => {
    photo.remove();
    visual.classList.add('is-missing');
  };
  visual.prepend(photo);
});
const collections = [...document.querySelectorAll('.collection')];
const gameMap = new Map();
collections.forEach(collection => {
  const gameKey = collection.dataset.game;
  const photoCount = collection.querySelectorAll('.photo-card').length;
  collection.querySelector('.photo-count').textContent = `${String(photoCount).padStart(2, '0')} CAPTURES`;
  if (!gameMap.has(gameKey)) {
    gameMap.set(gameKey, {
      key: gameKey,
      name: collection.dataset.gameName,
      featured: false,
      collections: [],
      photoCount: 0
    });
  }
  const game = gameMap.get(gameKey);
  game.featured ||= collection.dataset.featured === 'true';
  game.collections.push(collection);
  game.photoCount += photoCount;
});
const games = [...gameMap.values()];
const featuredGames = games.filter(game => game.featured).slice(0, 4);
const initialGames = featuredGames.length ? featuredGames : games.slice(0, 3);
const gameOptions = document.getElementById('game-options');
const gameToggle = document.getElementById('all-games-toggle');
const gameDialog = document.getElementById('all-games-dialog');
const allGameOptions = document.getElementById('all-game-options');
const gameSearch = document.getElementById('game-search');
const noGameResults = document.getElementById('no-game-results');
const gameTitle = document.getElementById('selected-game-title');
const gameSummary = document.getElementById('selected-game-summary');
const featuredLinks = document.getElementById('featured-game-links');
let selectedGame = null;

function createGameButton(game, index, className) {
  const button = document.createElement('button');
  const number = document.createElement('span');
  const name = document.createElement('span');
  const details = document.createElement('span');
  button.type = 'button';
  button.className = className;
  button.dataset.game = game.key;
  button.dataset.gameChoice = '';
  button.setAttribute('aria-pressed', 'false');
  number.className = 'game-number';
  number.textContent = String(index + 1).padStart(2, '0');
  name.className = 'game-name';
  name.textContent = game.name;
  details.className = 'game-details';
  details.textContent = `${game.collections.length} ${game.collections.length === 1 ? 'série' : 'séries'} · ${game.photoCount} photos`;
  button.append(number, name, details);
  button.addEventListener('click', () => {
    selectGame(game.key);
    if (className === 'featured-game-link') {
      document.getElementById('galerie').scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

function renderGameOptions() {
  gameOptions.replaceChildren(...initialGames.map((game, index) => createGameButton(game, index, 'game-choice')));
  allGameOptions.replaceChildren(...games.map((game, index) => createGameButton(game, index, 'dialog-game-choice')));
  gameToggle.hidden = games.length <= initialGames.length;
}

document.getElementById('featured-game-count').textContent = String(initialGames.length).padStart(2, '0');
featuredLinks.replaceChildren(...initialGames.map((game, index) => {
  const link = createGameButton(game, index, 'featured-game-link');
  link.setAttribute('aria-label', `Afficher les galeries de ${game.name}`);
  return link;
}));
gameToggle.addEventListener('click', () => {
  gameDialog.showModal();
  gameSearch.value = '';
  filterGameDialog('');
  gameSearch.focus();
});
document.getElementById('close-game-dialog').addEventListener('click', () => gameDialog.close());
gameDialog.addEventListener('click', event => {
  if (event.target === gameDialog) gameDialog.close();
});

function filterGameDialog(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase('fr');
  let visibleCount = 0;
  allGameOptions.querySelectorAll('.dialog-game-choice').forEach(button => {
    const matches = button.querySelector('.game-name').textContent.toLocaleLowerCase('fr').includes(normalizedQuery);
    button.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  noGameResults.hidden = visibleCount > 0;
}

gameSearch.addEventListener('input', () => filterGameDialog(gameSearch.value));
const lightbox = document.getElementById('lightbox');
const image = document.getElementById('lightbox-image');
const lightboxPhotoFrame = document.querySelector('.lightbox-photo-frame');
const fallback = document.getElementById('image-fallback');
const title = document.getElementById('lightbox-title');
const meta = document.getElementById('lightbox-meta');
const counter = document.getElementById('lightbox-counter');
const download = document.getElementById('download-photo');
let current = 0;
let visibleCards = cards;
let lastFocusedCard = null;

function selectGame(gameKey) {
  selectedGame = gameKey;
  const game = gameMap.get(gameKey);
  collections.forEach(section => {
    section.hidden = section.dataset.game !== gameKey;
  });
  visibleCards = cards.filter(card => card.closest('.collection').dataset.game === gameKey);
  document.getElementById('empty-state').hidden = visibleCards.length !== 0;
  gameTitle.textContent = game.name;
  gameSummary.textContent = `${game.collections.length} ${game.collections.length === 1 ? 'série' : 'séries'} · ${game.photoCount} photos`;
  document.querySelectorAll('[data-game-choice]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.game === gameKey));
  });
  if (gameDialog.open) gameDialog.close();
}

function updateCarouselControls(collection) {
  const gallery = collection.querySelector('.photo-grid');
  const controls = collection.querySelectorAll('.carousel-control');
  const atStart = gallery.scrollLeft <= 1;
  const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
  controls.forEach(button => {
    button.disabled = button.dataset.direction === '-1' ? atStart : atEnd;
  });
}

collections.forEach(collection => {
  const gallery = collection.querySelector('.photo-grid');
  collection.querySelectorAll('.carousel-control').forEach(button => {
    button.addEventListener('click', () => {
      gallery.scrollBy({
        left: gallery.clientWidth * Number(button.dataset.direction),
        behavior: 'auto'
      });
      updateCarouselControls(collection);
    });
  });
  gallery.addEventListener('scroll', () => updateCarouselControls(collection), { passive: true });
  updateCarouselControls(collection);
});
window.addEventListener('resize', () => collections.forEach(updateCarouselControls));

function showPhoto(index) {
  if (!visibleCards.length) return;
  current = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[current];
  image.src = card.dataset.src;
  image.alt = card.dataset.title;
  title.textContent = card.dataset.title;
  meta.textContent = `${card.dataset.game} / ${card.dataset.series}`.toUpperCase();
  download.href = card.dataset.src;
  download.download = card.dataset.src.split('/').pop();
  fallback.hidden = true;
  image.hidden = false;
  lightboxPhotoFrame.classList.remove('has-photo');
  download.hidden = true;
  image.onerror = () => { image.hidden = true; lightboxPhotoFrame.classList.remove('has-photo'); fallback.hidden = false; download.hidden = true; };
  image.onload = () => { image.hidden = false; lightboxPhotoFrame.classList.add('has-photo'); fallback.hidden = true; download.hidden = false; };
  counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(visibleCards.length).padStart(2, '0')}`;
}
function openLightbox(card) {
  visibleCards = cards.filter(item => !item.closest('.collection').hidden);
  lastFocusedCard = card;
  showPhoto(visibleCards.indexOf(card));
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('close-lightbox').focus();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedCard?.focus();
}
cards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
document.getElementById('prev-photo').addEventListener('click', () => showPhoto(current - 1));
document.getElementById('next-photo').addEventListener('click', () => showPhoto(current + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showPhoto(current - 1);
  if (event.key === 'ArrowRight') showPhoto(current + 1);
  if (event.key === 'Tab') {
    const focusable = [...lightbox.querySelectorAll('button:not([disabled]), a[href]:not([hidden])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
document.getElementById('year').textContent = new Date().getFullYear();
renderGameOptions();
selectGame(initialGames[0]?.key);

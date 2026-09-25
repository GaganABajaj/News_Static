const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const searchInput = document.querySelector('#search-input');
const storyCards = [...document.querySelectorAll('.story-card')];
const emptyState = document.querySelector('#empty-state');
const currentDate = document.querySelector('#current-date');

function updateIndianDate() {
  if (!currentDate) return;
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());
  currentDate.textContent = `${formattedDate} · IST`;
}

updateIndianDate();

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

searchInput?.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  let visibleCount = 0;

  storyCards.forEach((card) => {
    const matches = card.textContent.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (emptyState) emptyState.hidden = visibleCount !== 0;
});

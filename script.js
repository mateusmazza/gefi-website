const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
}

const reveal = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveal.forEach((el) => observer.observe(el));
} else {
  reveal.forEach((el) => el.classList.add('visible'));
}

const search = document.querySelector('#member-search');
if (search) {
  const cards = [...document.querySelectorAll('.member-card')];
  const empty = document.querySelector('#member-empty');
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const match = card.dataset.search.includes(query);
      card.hidden = !match;
      if (match) shown += 1;
    });
    empty.hidden = shown !== 0;
  });
}

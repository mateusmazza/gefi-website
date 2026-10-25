const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
}

// A link from the community map opens the corresponding biography.
function revealLinkedBiography() {
  const target = document.getElementById(location.hash.slice(1));
  if (target && target.matches('details.founder-profile')) target.open = true;
}
revealLinkedBiography();
window.addEventListener('hashchange', revealLinkedBiography);

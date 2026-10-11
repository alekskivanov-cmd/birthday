const panels = document.querySelectorAll('.panel');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
}, { threshold: .55 });
panels.forEach(p => observer.observe(p));

const ticket = document.getElementById('ticket');
const hint = document.querySelector('.ticket-hint');
ticket.addEventListener('click', () => {
  const flipped = ticket.classList.toggle('is-flipped');
  ticket.setAttribute('aria-pressed', String(flipped));
  ticket.setAttribute('aria-label', flipped ? 'Вернуть билет' : 'Показать сертификат');
  hint.textContent = flipped ? 'НАЖМИ, ЧТОБЫ ВЕРНУТЬ БИЛЕТ ↻' : 'НАЖМИ НА БИЛЕТ ↻';
});

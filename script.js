const panels = document.querySelectorAll('.panel');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
}, { threshold: .55 });
panels.forEach(p => observer.observe(p));

const ticket = document.getElementById('ticket');
ticket.addEventListener('pointermove', e => {
  const r = ticket.getBoundingClientRect();
  const x = (e.clientX-r.left)/r.width-.5;
  const y = (e.clientY-r.top)/r.height-.5;
  ticket.style.transform = `rotate(-4deg) perspective(500px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
});
ticket.addEventListener('pointerleave', () => ticket.style.transform = 'rotate(-4deg)');

const panels = document.querySelectorAll('.panel');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
}, { threshold: .55 });
panels.forEach(p => observer.observe(p));

const dialog = document.getElementById('surprise-dialog');
const title = document.getElementById('surprise-title');
const copy = document.getElementById('surprise-copy');
const orbit = dialog.querySelector('.breathing-orbit');
const note = dialog.querySelector('.breathing-note');
const done = dialog.querySelector('.dialog-done');
let admissionTimer;
let admissionBusy = false;
let admissionShown = false;
function openSurprise(heading, message, breathing = false) {
  title.textContent = heading;
  copy.textContent = message;
  orbit.hidden = !breathing;
  note.hidden = !breathing;
  done.hidden = false;
  dialog.classList.toggle('breathing-mode', breathing);
  dialog.showModal();
}
function closeSurprise() { dialog.close(); }
dialog.querySelector('.dialog-close').addEventListener('click', closeSurprise);
done.addEventListener('click', closeSurprise);
dialog.addEventListener('click', e => { if (e.target === dialog) {
  const r = dialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeSurprise();
}});
dialog.addEventListener('close', () => {
  clearTimeout(admissionTimer);
  admissionBusy = false;
  document.body.classList.remove('surprise-open');
});
document.getElementById('ai-secret').addEventListener('click', () => {
  openSurprise('СЕКРЕТНЫЙ ПРОТОКОЛ', 'План уничтожения человечества отложен. Сегодня у неё день рождения.');
});
document.getElementById('slow-mode').addEventListener('click', () => {
  openSurprise('SLOW DOWN.', 'Вдох. Выдох. Остальное подождёт.', true);
});

const ticket = document.getElementById('ticket');
const hint = document.querySelector('.ticket-hint');
function flipTicket() {
  const flipped = ticket.classList.toggle('is-flipped');
  ticket.setAttribute('aria-pressed', String(flipped));
  ticket.setAttribute('aria-label', flipped ? 'Вернуть билет' : 'Показать сертификат');
  hint.textContent = flipped ? 'НАЖМИ, ЧТОБЫ ВЕРНУТЬ БИЛЕТ ↻' : 'НАЖМИ НА БИЛЕТ ↻';
}
ticket.addEventListener('click', () => {
  if (admissionBusy) return;
  if (admissionShown || ticket.classList.contains('is-flipped')) { flipTicket(); return; }
  admissionBusy = true;
  openSurprise('ПРОВЕРКА ДОПУСКА…', 'Секунду. Проверяем право на заслуженный отдых.');
  done.hidden = true;
  admissionTimer = setTimeout(() => {
    title.textContent = 'ДОПУСК ПОЛУЧЕН';
    copy.textContent = 'Отдых разрешён. Рабочие чаты запрещены.';
    done.textContent = 'ОТКРЫТЬ СЕРТИФИКАТ';
    done.hidden = false;
    admissionShown = true;
    flipTicket();
  }, 1300);
});
// Other surprises keep their own neutral closing label.
dialog.addEventListener('close', () => { done.textContent = 'ПРОДОЛЖИТЬ'; });

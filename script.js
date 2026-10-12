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
  document.getElementById('world-pause').hidden = true;
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
  openSurprise('SLOW DOWN.', 'Не обязательно успевать всё.');
  const world = document.getElementById('world-pause');
  world.classList.remove('is-paused');
  world.hidden = false;
  world.querySelector('.world-noise').hidden = false;
  world.querySelector('.world-pause-button').hidden = false;
  done.hidden = true;
});

const ticket = document.getElementById('ticket');
const hint = document.querySelector('.ticket-hint');
function flipTicket() {
  const flipped = ticket.classList.toggle('is-flipped');
  document.getElementById('save-certificate').hidden = !flipped;
  document.querySelector('.certificate').hidden = flipped;
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
  }, 2600);
});
// Other surprises keep their own neutral closing label.
dialog.addEventListener('close', () => { done.textContent = 'ПРОДОЛЖИТЬ'; });

const music = document.getElementById('birthday-music');
const musicButton = document.getElementById('music-toggle');
const musicLabel = musicButton.querySelector('.vinyl-label');
const musicStatus = document.querySelector('.music-status');
let musicStarting = false;
function syncMusicButton() {
  const playing = !music.paused && !music.ended;
  musicButton.classList.toggle('is-playing', playing);
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? 'Поставить Scorpions — 321 на паузу' : 'Включить Scorpions — 321');
  musicLabel.textContent = playing ? 'PAUSE' : 'PLAY';
}
musicButton.addEventListener('click', async () => {
  if (musicStarting) return;
  musicStatus.textContent = '';
  if (!music.paused) { music.pause(); return; }
  musicStarting = true;
  try { await music.play(); }
  catch (error) { musicStatus.textContent = 'Не удалось включить музыку. Попробуй нажать ещё раз.'; }
  finally { musicStarting = false; syncMusicButton(); }
});
['play', 'pause', 'ended'].forEach(event => music.addEventListener(event, syncMusicButton));
music.addEventListener('error', () => {
  musicStatus.textContent = 'Музыка недоступна. Попробуй обновить страницу.';
  syncMusicButton();
});

const programDialog = document.getElementById('spa-program-dialog');
document.getElementById('spa-program-open').addEventListener('click', () => programDialog.showModal());
programDialog.querySelector('.dialog-close').addEventListener('click', () => programDialog.close());
programDialog.querySelector('.program-done').addEventListener('click', () => programDialog.close());
programDialog.addEventListener('click', e => {
  if (e.target !== programDialog) return;
  const r = programDialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) programDialog.close();
});

const discoveryTip = document.getElementById('discovery-tip');
const discoveryKey = 'birthday-surprises-discovered-v1';
let tipDismissed = false;
try { tipDismissed = localStorage.getItem(discoveryKey) === 'yes'; } catch (_) {}
const discoveryTimer = setTimeout(() => { if (!tipDismissed) discoveryTip.hidden = false; }, 1800);
function dismissDiscoveryTip() {
  tipDismissed = true;
  clearTimeout(discoveryTimer);
  discoveryTip.hidden = true;
  try { localStorage.setItem(discoveryKey, 'yes'); } catch (_) {}
}
document.getElementById('discovery-dismiss').addEventListener('click', dismissDiscoveryTip);
['ai-secret', 'slow-mode', 'spa-program-open'].forEach(id => {
  document.getElementById(id).addEventListener('click', dismissDiscoveryTip);
});

const worldPause = document.getElementById('world-pause');
let worldPauseTimer;
worldPause.querySelector('.world-pause-button').addEventListener('click', () => {
  worldPause.classList.add('is-paused');
  worldPause.querySelector('.world-pause-button').hidden = true;
  copy.textContent = '';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  worldPauseTimer = setTimeout(() => {
    worldPause.querySelector('.world-noise').hidden = true;
    done.textContent = 'ПОБУДУ ЗДЕСЬ ЕЩЁ НЕМНОГО';
    done.hidden = false;
  }, reduced ? 0 : 900);
});
dialog.addEventListener('close', () => clearTimeout(worldPauseTimer));

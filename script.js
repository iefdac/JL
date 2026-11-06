/* ===========================================================
   EDITA AQUÍ LOS DATOS DE TU INVITACIÓN
   =========================================================== */
const CONFIG = {
  novios: 'Joel y Luz',
  // Perú UTC-05:00. La hora 15:30 significa 3:30 p. m.
  fechaISO: '2026-12-26T15:30:00-05:00',
  finISO: '2026-12-26T23:00:00-05:00', // solo para calendario
  // ESCRIBE TU NÚMERO PERUANO, con código 51, sin + ni espacios.
  // Ejemplo ficticio de formato: '519XXXXXXXX'. Déjalo vacío para probar.
  whatsappConfirmaciones: '952349829',
  // Reemplaza estos enlaces por ubicaciones precisas de Google Maps si las tienes.
  mapsIglesia: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Parroquia San José Misericordioso Tacna Perú'),
  mapsRecepcion: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('La Gran Reserva Santa Elena Av. Los Viñedos D-4 Pago Peschay Pocollay Tacna Perú'),
  // Fotos de muestra. Para tus fotos escribe 'assets/foto1.jpg', etc.
  fotoPortada: 'assets/portada.jpg',
  fotos: ['assets/foto1.jpg', 'assets/foto2.jpg', 'assets/foto3.jpg', 'assets/foto4.jpg'],
  musica: 'assets/musica-original.wav',
  video: 'assets/video-demo.mp4'
};

const $ = s => document.querySelector(s);
const music = $('#bgMusic');
const toggle = $('#musicToggle');
const video = $('#ourVideo');
const toast = $('#toast');
let toastTimer;
const showToast = message => {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
};

// Asigna las rutas de fotos, música y video desde CONFIG.
document.documentElement.style.setProperty('--hero-photo', `url('${CONFIG.fotoPortada}')`);
$('.hero').style.backgroundImage = `url('${CONFIG.fotoPortada}')`;
document.querySelectorAll('[data-photo]').forEach((img, index) => {
  img.src = CONFIG.fotos[index] || CONFIG.fotos[0];
  img.onerror = () => { img.alt = 'Agrega tu fotografía en assets'; img.style.opacity = '.25'; };
});
music.src = CONFIG.musica;
video.querySelector('source').src = CONFIG.video;
video.poster = CONFIG.fotoPortada;
video.load();
$('#churchMap').href = CONFIG.mapsIglesia;
$('#receptionMap').href = CONFIG.mapsRecepcion;

// En móviles, la música comienza al abrir la invitación, tras un toque del usuario.
async function playMusic() {
  try { music.volume = .35; await music.play(); toggle.classList.add('playing'); $('#musicText').textContent = 'Pausar'; toggle.setAttribute('aria-label','Pausar música'); }
  catch { toggle.classList.remove('playing'); $('#musicText').textContent = 'Música'; showToast('Toca el botón ♫ para activar la música.'); }
}
function pauseMusic() { music.pause(); toggle.classList.remove('playing'); $('#musicText').textContent = 'Música'; toggle.setAttribute('aria-label','Activar música'); }
$('#openInvite').addEventListener('click', () => {
  $('#intro').classList.add('hidden');
  document.body.classList.remove('locked');
  playMusic();
  setTimeout(() => $('#intro').setAttribute('aria-hidden', 'true'), 900);
});
toggle.addEventListener('click', () => music.paused ? playMusic() : pauseMusic());
// Al reproducir un video, detener la música para evitar que se superpongan.
video.addEventListener('play', () => { if (!music.paused) pauseMusic(); });

// Cuenta regresiva con huso horario explícito de Perú.
const date = new Date(CONFIG.fechaISO).getTime();
function updateCountdown() {
  const diff = Math.max(0, date - Date.now());
  $('#days').textContent = Math.floor(diff/86400000);
  $('#hours').textContent = String(Math.floor(diff/3600000)%24).padStart(2,'0');
  $('#minutes').textContent = String(Math.floor(diff/60000)%60).padStart(2,'0');
  $('#seconds').textContent = String(Math.floor(diff/1000)%60).padStart(2,'0');
  if (diff === 0) $('#countdownMessage').textContent = '¡Nuestro gran día ha llegado!';
}
updateCountdown(); setInterval(updateCountdown,1000);




// Scroll reveal sin librerías.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
} else {document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));}

// Generar evento .ics compatible con calendarios móviles.
function formatICS(iso) { return new Date(iso).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'); }
$('#calendarBtn').addEventListener('click',()=>{
  const details = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Joel Luz//Invitacion//ES',
    'BEGIN:VEVENT','UID:joel-luz-20261226@invitacion',`DTSTAMP:${formatICS(new Date().toISOString())}`,
    `DTSTART:${formatICS(CONFIG.fechaISO)}`,`DTEND:${formatICS(CONFIG.finISO)}`,
    'SUMMARY:Boda de Joel y Luz',
    'LOCATION:Parroquia San José Misericordioso, Tacna, Perú',
    'DESCRIPTION:Ceremonia 3:30 p. m. Recepción en La Gran Reserva Santa Elena, Pocollay.',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([details],{type:'text/calendar;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='boda-joel-y-luz.ics';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
});

// La web estática no guarda respuestas en servidores. En su lugar abre WhatsApp.
$('#rsvpForm').addEventListener('submit', async event => {
  event.preventDefault();
  const name = $('#guestName').value.trim();
  const attendance = $('#attendance').value;
  const note = $('#note').value.trim();
  if (!name || !attendance) return;
  const msg = `💍 *Boda de Joel y Luz*\n\nHola, soy *${name}*.\nConfirmación: *${attendance}*.${note ? `\nMensaje: ${note}` : ''}\n\n¡Gracias por la invitación!`;
  if (!/^\d{10,15}$/.test(CONFIG.whatsappConfirmaciones)) {
    try { await navigator.clipboard.writeText(msg); showToast('Confirmación copiada. Configura whatsappConfirmaciones en script.js para enviarla directamente.'); }
    catch { showToast('Configura el número de WhatsApp en script.js para activar la confirmación.'); }
    return;
  }
  window.open(`https://wa.me/${CONFIG.whatsappConfirmaciones}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');
});

$('#shareBtn').addEventListener('click',async()=>{
 const data={title:'Boda de Joel y Luz',text:'¡Estás invitado a nuestra boda el 26 de diciembre de 2026! 💍',url:location.href};
 if(navigator.share){try{await navigator.share(data);return}catch(e){if(e.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(location.href);showToast('¡Enlace copiado para enviarlo por WhatsApp!');}catch{showToast('Copia la dirección de esta página y compártela.');}
});

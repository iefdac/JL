
const botonAbrir = document.getElementById("abrir");
const sobre = document.getElementById("sobre");
const contenido = document.getElementById("contenido");

botonAbrir.addEventListener("click", () => {
  sobre.style.display = "none";
  contenido.classList.remove("oculto");
});

// Fecha del matrimonio: año, mes (0 = enero), día, hora
const fechaBoda = new Date(2026, 12, 26, 16, 0, 0);

function actualizarContador() {
  const ahora = new Date();
  const diferencia = fechaBoda - ahora;
  const contador = document.getElementById("contador");

  if (diferencia <= 0) {
    contador.textContent = "¡Hoy es nuestro gran día!";
    return;
  }

  const dias = Math.floor(
    diferencia / (1000 * 60 * 60 * 24)
  );
  const horas = Math.floor(
    (diferencia / (1000 * 60 * 60)) % 24
  );
  const minutos = Math.floor(
    (diferencia / (1000 * 60)) % 60
  );
  const segundos = Math.floor(
    (diferencia / 1000) % 60
  );

  contador.textContent =
    `${dias} días, ${horas} h, ${minutos} min y ${segundos} s`;
}

actualizarContador();
setInterval(actualizarContador, 1000);

// Confirmación por WhatsApp
const telefono = "51952349829"; // Reemplazar por el número real
const mensaje = encodeURIComponent(
  "¡Hola! Confirmo mi asistencia al matrimonio de Luz y Joel."
);

document.getElementById("confirmar").href =
  `https://wa.me/${telefono}?text=${mensaje}`;
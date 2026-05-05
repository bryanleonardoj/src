// =========================
// NAVBAR HAMBURGUESA
// =========================

function initNavbar() {
	const hamburger = document.querySelector('.hamburger');
	const navMenu = document.querySelector('.nav-menu');
	const navLinks = document.querySelectorAll('.nav-link');

	if (!hamburger) return;

	hamburger.addEventListener('click', () => {
		hamburger.classList.toggle('active');
		navMenu.classList.toggle('active');
	});

	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			hamburger.classList.remove('active');
			navMenu.classList.remove('active');
		});
	});

	// Cerrar menú al hacer scroll
	document.addEventListener('scroll', () => {
		hamburger.classList.remove('active');
		navMenu.classList.remove('active');
	});
}

// =========================
// DATOS
// =========================

const comunas = [
  "Las Condes", "Providencia", "Santiago Centro", "Ñuñoa",
  "La Florida", "Maipú", "Puente Alto", "Vitacura",
  "Lo Barnechea", "San Miguel"
];

const preciosBase = {
  privado: 12000,
  ejecutivo: 17000,
  van: 22000
};

// =========================
// RENDER COMUNAS
// =========================

function renderComunas() {
  const select = document.getElementById('comuna');
  if (!select) return;

  select.innerHTML = '<option value="">-- Seleccionar comuna --</option>' + comunas
    .map((c, i) => `<option value="${i}">${c}</option>`)
    .join('');
}

// =========================
// COTIZADOR
// =========================

function cotizar(e) {
  e.preventDefault();

  const idx = document.getElementById('comuna').value;
  const servicio = document.getElementById('servicio').value;
  const pasajeros = +document.getElementById('pasajeros').value;
  const fecha = document.getElementById('fecha').value;

  // Validaciones
  if (!idx || isNaN(parseInt(idx)) || !comunas[parseInt(idx)]) {
    alert("Selecciona una comuna válida");
    return;
  }

  if (pasajeros < 1 || pasajeros > 10) {
    alert("El número de pasajeros debe ser entre 1 y 10");
    return;
  }

  if (!servicio || !preciosBase[servicio]) {
    alert("Selecciona un tipo de vehículo válido");
    return;
  }

  const idxNum = parseInt(idx);
  let precio = preciosBase[servicio];

  // Ajuste por pasajeros
  if (servicio === 'van' && pasajeros > 4) {
    precio += (pasajeros - 4) * 2000;
  }

  // Ajuste horario nocturno 🌙
  if (fecha) {
    const hora = new Date(fecha).getHours();
    if (hora >= 22 || hora <= 6) {
      precio *= 1.2; // recargo 20%
    }
  }

  const comunaNombre = comunas[idxNum];

  let msg = `
    <b>Destino:</b> ${comunaNombre}<br>
    <b>Servicio:</b> ${servicio}<br>
    <b>Pasajeros:</b> ${pasajeros}<br>
  `;

  if (fecha) {
    msg += `<b>Fecha:</b> ${new Date(fecha).toLocaleString('es-CL')}<br>`;
  }

  msg += `
    <br>
    <span style="font-size:1.4em;color:#22c55e">
      Total estimado: $${Math.round(precio).toLocaleString('es-CL')}
    </span>
    <p style="margin-top: 15px; color: #94a3b8; font-size: 0.9em;">
      <i class="fas fa-info-circle"></i> Reserva ahora con LEOTOUR
    </p>
  `;

  document.getElementById('resultado').innerHTML = msg;
}

// =========================
// CONTACTO
// =========================

function handleContactForm(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // Validaciones
  if (!nombre || nombre.length < 2) {
    alert("Por favor ingresa un nombre válido");
    return;
  }

  if (!correo || !correo.includes('@')) {
    alert("Por favor ingresa un correo válido");
    return;
  }

  if (!mensaje || mensaje.length < 10) {
    alert("El mensaje debe tener al menos 10 caracteres");
    return;
  }

  // Aquí puede ir la lógica de envío (API, email service, etc.)
  const resultDiv = document.getElementById('contactResult');
  resultDiv.style.display = 'block';
  resultDiv.style.color = '#22c55e';
  resultDiv.innerHTML = '✓ Mensaje enviado correctamente. Nos pondremos en contacto pronto.';

  // Limpiar formulario
  document.getElementById('contactForm').reset();

  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    resultDiv.style.display = 'none';
  }, 5000);
}

// =========================
// MAPA (Leaflet)
// =========================

let map;
let marcador;

function initMap() {
  if (!window.L) return;

  map = L.map('map').setView([-33.4489, -70.6693], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 18
  }).addTo(map);

  // Aeropuerto
  L.marker([-33.3930, -70.7858])
    .addTo(map)
    .bindPopup("Aeropuerto SCL");

  // Click en mapa
  map.on('click', function(e) {
    if (marcador) {
      map.removeLayer(marcador);
    }

    marcador = L.marker(e.latlng).addTo(map);

    const summary = document.getElementById('summary');
    if (summary) {
      summary.innerText =
        `Destino seleccionado: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
    }
  });
}

// =========================
// VUELOS (SIMULACIÓN)
// =========================

const vuelos = [
  { vuelo: "LA123", destino: "Antofagasta", hora: "10:30", estado: "En horario" },
  { vuelo: "SK456", destino: "Concepción", hora: "11:15", estado: "Retrasado" },
  { vuelo: "JA789", destino: "Puerto Montt", hora: "12:00", estado: "Embarcando" },
  { vuelo: "UA234", destino: "Iquique", hora: "13:45", estado: "En horario" },
  { vuelo: "AR567", destino: "Punta Arenas", hora: "14:20", estado: "Embarcando" },
  { vuelo: "VB890", destino: "Calama", hora: "15:00", estado: "Retrasado" }
];

function renderVuelos() {
  const cont = document.getElementById('vuelos');
  if (!cont) return;

  cont.innerHTML = vuelos.map(v => `
    <div class="vuelo-item">
      <div>${v.vuelo}</div>
      <div>${v.destino}</div>
      <div>${v.hora}</div>
      <div>Aeropuerto SCL</div>
      <div class="estado">${v.estado}</div>
    </div>
  `).join('');
}

// Cambiar estados automáticamente
function actualizarVuelos() {
  const estados = ["En horario", "Retrasado", "Embarcando", "Último llamado"];

  vuelos.forEach(v => {
    v.estado = estados[Math.floor(Math.random() * estados.length)];
  });

  renderVuelos();
}

// =========================
// OBSERVADOR DE ELEMENTOS (SCROLL ANIMATIONS)
// =========================

function observarElementos() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });

  // Observar todos los elementos con animación
  document.querySelectorAll('.servicio-card, .vuelo-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

// =========================
// COTIZADOR DESTINOS TURÍSTICOS
// =========================

function cotizarDestino(destino, precioBase) {
  const resultado = document.getElementById('destinoResultado');
  
  if (!resultado) return;

  // Generar número de cotización único
  const numCotizacion = Math.floor(Math.random() * 100000) + 10000;
  
  // Crear la cotización con detalles
  const fecha = new Date().toLocaleDateString('es-CL');
  const hora = new Date().toLocaleTimeString('es-CL');
  
  const html = `
    <div class="cotizacion-confirmada">
      <div class="cotizacion-header">
        <i class="fas fa-check-circle"></i>
        <h3>¡Cotización Generada!</h3>
      </div>
      <div class="cotizacion-detalles">
        <div class="detalle-row">
          <span class="detalle-label">Destino:</span>
          <span class="detalle-valor">${destino}</span>
        </div>
        <div class="detalle-row">
          <span class="detalle-label">Precio:</span>
          <span class="detalle-valor precio-destino">$${precioBase.toLocaleString('es-CL')} CLP</span>
        </div>
        <div class="detalle-row">
          <span class="detalle-label">Número de Cotización:</span>
          <span class="detalle-valor">#${numCotizacion}</span>
        </div>
        <div class="detalle-row">
          <span class="detalle-label">Fecha y Hora:</span>
          <span class="detalle-valor">${fecha} - ${hora}</span>
        </div>
      </div>
      <div class="cotizacion-acciones">
        <button class="cotizacion-btn primario" onclick="reservarDestino('${destino}', ${precioBase})">
          <i class="fas fa-calendar-check"></i> Reservar Ahora
        </button>
        <button class="cotizacion-btn secundario" onclick="compartirCotizacion('${destino}', ${precioBase}, '${numCotizacion}')">
          <i class="fas fa-share-alt"></i> Compartir
        </button>
      </div>
    </div>
  `;
  
  resultado.innerHTML = html;
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function reservarDestino(destino, precio) {
  alert(`Reserva iniciada para ${destino}. Precio: $${precio.toLocaleString('es-CL')} CLP\n\nContáctanos para completar tu reserva.`);
}

function compartirCotizacion(destino, precio, numCotizacion) {
  const texto = `¡Acabo de cotizar un viaje a ${destino} con LEOTOUR! Precio: $${precio.toLocaleString('es-CL')} CLP. Cotización #${numCotizacion}. ¿Te gustaría viajar conmigo?`;
  
  // Intentar abrir WhatsApp
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

// =========================

window.addEventListener('DOMContentLoaded', () => {
  // Inicializar navbar
  initNavbar();

  renderComunas();
  initMap();
  renderVuelos();

  // Cotizador
  const form = document.getElementById('cotizadorForm');
  if (form) {
    form.addEventListener('submit', cotizar);
  }

  // Contacto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Actualizar vuelos cada 8 segundos
  setInterval(actualizarVuelos, 8000);

  // Iniciar scroll animations
  observarElementos();
});
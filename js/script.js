// ============================================
// LEOTOUR - SCRIPT PRINCIPAL
// ============================================
// Este archivo contiene toda la lógica de la aplicación
// con jQuery para simplificar manipulación del DOM

/* ============================================
   DATOS GLOBALES
   ============================================ */

// Array con información de destinos para el carrusel
const destinos = [
	{
		nombre: "Cartagena",
		descripcion: "Puerto histórico con playas y vistas al mar",
		imagen: "img/cartagena.jpg"
	},
	{
		nombre: "Valparaíso",
		descripcion: "Ciudad vibrante con cerros coloridos y arte",
		imagen: "img/valparaiso.jpg"
	},
	{
		nombre: "San Antonio",
		descripcion: "Puerto pesquero con playas tranquilas",
		imagen: "img/san-antonio.jpg"
	}
];

// Índice actual del carrusel
let indiceCarruselActual = 0;

// Array para almacenar usuarios registrados (simula una base de datos)
let usuariosRegistrados = [];

/* ============================================
   FUNCIONES DEL CARRUSEL
   ============================================ */

/**
 * Actualiza la imagen, nombre y descripción del carrusel
 * @param {number} indice - Índice del destino a mostrar
 */
function actualizarCarrusel(indice) {
	// Asegurar que el índice esté dentro del rango válido
	if (indice < 0) {
		indiceCarruselActual = destinos.length - 1;
	} else if (indice >= destinos.length) {
		indiceCarruselActual = 0;
	} else {
		indiceCarruselActual = indice;
	}

	// Obtener datos del destino actual
	const destino = destinos[indiceCarruselActual];

	// Actualizar imagen
	$("#imagenCarrusel").attr("src", destino.imagen).attr("alt", destino.nombre);

	// Actualizar nombre y descripción
	$("#nombreDestino").text(destino.nombre);
	$("#descripcionDestino").text(destino.descripcion);

	// Actualizar indicadores visuales (puntos)
	$(".indicador").removeClass("active");
	$(`.indicador[data-index="${indiceCarruselActual}"]`).addClass("active");
}

/**
 * Mostrar la imagen anterior del carrusel
 */
function carruselAnterior() {
	actualizarCarrusel(indiceCarruselActual - 1);
}

/**
 * Mostrar la imagen siguiente del carrusel
 */
function carruselSiguiente() {
	actualizarCarrusel(indiceCarruselActual + 1);
}

/* ============================================
   FUNCIONES DE VALIDACIÓN
   ============================================ */

/**
 * Valida que el nombre tenga al menos 2 caracteres
 * @param {string} nombre - Nombre a validar
 * @returns {boolean} true si es válido
 */
function validarNombre(nombre) {
	return nombre.trim().length >= 2;
}

/**
 * Valida formato de email usando expresión regular
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
function validarEmail(email) {
	const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regexEmail.test(email);
}

/**
 * Valida que la contraseña tenga mínimo 6 caracteres
 * @param {string} contraseña - Contraseña a validar
 * @returns {boolean} true si es válido
 */
function validarContraseña(contraseña) {
	return contraseña.length >= 6;
}

/**
 * Valida que el teléfono tenga números
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si es válido
 */
function validarTelefono(telefono) {
	const regexTelefono = /^[\d\s\-\+]+$/;
	return regexTelefono.test(telefono) && telefono.trim().length >= 7;
}

/**
 * Valida que el mensaje tenga mínimo 10 caracteres
 * @param {string} mensaje - Mensaje a validar
 * @returns {boolean} true si es válido
 */
function validarMensaje(mensaje) {
	return mensaje.trim().length >= 10;
}

/* ============================================
   FORMULARIO DE INSCRIPCIÓN
   ============================================ */

/**
 * Maneja el envío del formulario de inscripción
 * Valida todos los campos y registra el usuario
 */
function manejarInscripcion(e) {
	e.preventDefault();

	// Obtener valores del formulario
	const nombre = $("#inscripcion_nombre").val().trim();
	const email = $("#inscripcion_email").val().trim();
	const telefono = $("#inscripcion_telefono").val().trim();
	const contraseña = $("#inscripcion_contraseña").val();

	// Limpiar mensajes de error previos
	$("[id^='error_inscripcion_']").text("");

	// Validar nombre
	if (!validarNombre(nombre)) {
		$("#error_inscripcion_nombre").text("El nombre debe tener al menos 2 caracteres");
		return;
	}

	// Validar email
	if (!validarEmail(email)) {
		$("#error_inscripcion_email").text("Ingresa un correo válido");
		return;
	}

	// Validar teléfono
	if (!validarTelefono(telefono)) {
		$("#error_inscripcion_telefono").text("Ingresa un teléfono válido");
		return;
	}

	// Validar contraseña
	if (!validarContraseña(contraseña)) {
		$("#error_inscripcion_contraseña").text("La contraseña debe tener mínimo 6 caracteres");
		return;
	}

	// Crear objeto de usuario
	const nuevoUsuario = {
		nombre: nombre,
		email: email,
		telefono: telefono,
		contraseña: contraseña // En producción NUNCA guardar contraseña en texto plano
	};

	// Guardar usuario en el array
	usuariosRegistrados.push(nuevoUsuario);

	// Mostrar mensaje de éxito
	$("#mensaje_inscripcion")
		.html('<div class="alert-success"><i class="fas fa-check-circle"></i> ¡Cuenta creada exitosamente! Bienvenido.</div>')
		.show();

	// Limpiar formulario
	$("#formularioInscripcion")[0].reset();

	// Ocultar mensaje después de 5 segundos
	setTimeout(() => {
		$("#mensaje_inscripcion").fadeOut();
	}, 5000);
}

/* ============================================
   FORMULARIO DE LOGIN
   ============================================ */

/**
 * Maneja el envío del formulario de login
 * Verifica credenciales contra usuarios registrados
 */
function manejarLogin(e) {
	e.preventDefault();

	// Obtener valores del formulario
	const email = $("#login_email").val().trim();
	const contraseña = $("#login_contraseña").val();

	// Limpiar mensajes de error
	$("[id^='error_login_']").text("");

	// Validar email
	if (!validarEmail(email)) {
		$("#error_login_email").text("Ingresa un correo válido");
		return;
	}

	// Validar que contraseña no esté vacía
	if (contraseña.length === 0) {
		$("#error_login_contraseña").text("Ingresa tu contraseña");
		return;
	}

	// Buscar usuario en el array
	const usuarioEncontrado = usuariosRegistrados.find(u => u.email === email && u.contraseña === contraseña);

	if (usuarioEncontrado) {
		// Credenciales correctas
		$("#mensaje_login")
			.html(`<div class="alert-success"><i class="fas fa-check-circle"></i> ¡Bienvenido ${usuarioEncontrado.nombre}! Sesión iniciada.</div>`)
			.show();

		// Limpiar formulario
		$("#formularioLogin")[0].reset();

		// Guardar sesión en localStorage si "Recordarme" está marcado
		if ($("#recordarme").is(":checked")) {
			localStorage.setItem("usuarioLogueado", email);
		}

		// Redirigir después de 2 segundos
		setTimeout(() => {
			alert("Acceso concedido - Redirigiendo...");
		}, 2000);
	} else {
		// Credenciales incorrectas
		$("#mensaje_login")
			.html('<div class="alert-danger"><i class="fas fa-exclamation-circle"></i> Correo o contraseña incorrectos.</div>')
			.show();
	}
}

/* ============================================
   FORMULARIO DE CONTACTO
   ============================================ */

/**
 * Maneja el envío del formulario de contacto
 * Valida y simula el envío del mensaje
 */
function manejarContacto(e) {
	e.preventDefault();

	// Obtener valores del formulario
	const nombre = $("#contacto_nombre").val().trim();
	const email = $("#contacto_email").val().trim();
	const mensaje = $("#contacto_mensaje").val().trim();

	// Limpiar mensajes de error
	$("[id^='error_contacto_']").text("");

	// Validar nombre
	if (!validarNombre(nombre)) {
		$("#error_contacto_nombre").text("El nombre debe tener al menos 2 caracteres");
		return;
	}

	// Validar email
	if (!validarEmail(email)) {
		$("#error_contacto_email").text("Ingresa un correo válido");
		return;
	}

	// Validar mensaje
	if (!validarMensaje(mensaje)) {
		$("#error_contacto_mensaje").text("El mensaje debe tener mínimo 10 caracteres");
		return;
	}

	// Mostrar mensaje de éxito
	$("#mensaje_contacto")
		.html('<div class="alert-success"><i class="fas fa-check-circle"></i> Mensaje enviado correctamente. Te contactaremos pronto.</div>')
		.show();

	// Limpiar formulario
	$("#formularioContacto")[0].reset();

	// Ocultar mensaje después de 5 segundos
	setTimeout(() => {
		$("#mensaje_contacto").fadeOut();
	}, 5000);
}

/* ============================================
   INICIALIZACIÓN DE EVENTOS
   ============================================ */

/**
 * Inicializa todos los eventos del carrusel
 * Se ejecuta cuando el documento está listo
 */
function inicializarCarrusel() {
	// Botón anterior
	$("#btnAnterior").click(carruselAnterior);

	// Botón siguiente
	$("#btnSiguiente").click(carruselSiguiente);

	// Indicadores (puntos)
	$(".indicador").click(function() {
		const index = $(this).data("index");
		actualizarCarrusel(index);
	});

	// Mostrar el primer destino
	actualizarCarrusel(0);
}

/**
 * Inicializa todos los eventos de los formularios
 */
function inicializarFormularios() {
	// Formulario de inscripción
	$("#formularioInscripcion").on("submit", manejarInscripcion);

	// Formulario de login
	$("#formularioLogin").on("submit", manejarLogin);

	// Formulario de contacto
	$("#formularioContacto").on("submit", manejarContacto);
}

/* ============================================
   PUNTO DE ENTRADA - DOCUMENT READY
   ============================================ */

$(document).ready(function() {
	console.log("Aplicación LEOTOUR iniciada");

	// Inicializar carrusel
	inicializarCarrusel();

	// Inicializar formularios
	inicializarFormularios();

	// Verificar si hay usuario guardado en localStorage
	const usuarioGuardado = localStorage.getItem("usuarioLogueado");
	if (usuarioGuardado) {
		console.log("Usuario recordado: " + usuarioGuardado);
	}
});
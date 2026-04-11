import StorageCiudad from "../acceso_datos/StorageCiudad.js";
import TurnoService from "../negocio/TurnoService.js";

const turnoService = new TurnoService();
let pausado = false;
let ciudadActual = null; 

const nombresEdificios = {
    "R1": "Casas", "R2": "Apartamentos",
    "C1": "Tiendas", "C2": "Centros Comerciales",
    "I1": "Fábricas", "I2": "Granjas",
    "S1": "Hospitales", "S2": "Est. Bomberos",
    "S3": "Est. Policía", "P1": "Parques",
    "U1": "Plantas Eléctricas", "U2": "Plantas de Agua"
};

function mostrarAlertaRecursos(alertas, edificiosInhabilitados) {
    const contenedor = document.getElementById("alertaRecursos");
    const mensajeEl = document.getElementById("alertaRecursosMensaje");
    const edificiosEl = document.getElementById("alertaEdificiosInhabilitados");
    if (!contenedor) return;

    if (alertas.length === 0 && edificiosInhabilitados.length === 0) {
        contenedor.classList.add("hidden");
        return;
    }

    const tiposUnicos = [...new Set(edificiosInhabilitados)]
        .map(tipo => nombresEdificios[tipo] || tipo)
        .join(", ");

    mensajeEl.textContent = alertas.join(" | ");
    edificiosEl.textContent = tiposUnicos
        ? `Edificios inhabilitados: ${tiposUnicos}`
        : "";

    contenedor.classList.remove("hidden");
}

function cargarCiudad() {
    const params = new URLSearchParams(window.location.search);
    const idUrl = params.get("cityId");

    if (!idUrl) {
        console.error("No se encontró cityId en la URL.");
        return null;
    }

    const lista = StorageCiudad.load();
    const ciudad = lista.find(c => String(c.id) === String(idUrl));

    if (!ciudad) {
        console.error(`No se encontró una ciudad con id=${idUrl}`);
        return null;
    }

    return ciudad;
}

function mostrarModalGameOver(razon) {
    const mensajes = {
        dinero:       "💸 La ciudad ha quebrado.",
        electricidad: "⚡ La ciudad se quedó sin electricidad.",
        agua:         "💧 La ciudad se quedó sin agua."
    };

    document.getElementById("modalGameOverMensaje").textContent =
        mensajes[razon] || "La ciudad ha colapsado.";

    document.getElementById("modalGameOver").classList.remove("hidden");

    // Forzar reproducción con sonido desde interacción del usuario
    const video = document.querySelector("#modalGameOver video");
    const btnPlay = document.getElementById("btnPlayVideo");
    
    video.play().catch(() => {
        // Si el navegador lo bloquea, mostrar el botón de play
        btnPlay.classList.remove("hidden");
    });

    btnPlay.onclick = () => {
        video.play();
        btnPlay.classList.add("hidden");
    };
}

function pausarJuego() {
    turnoService.detenerTurnos();
    pausado = true;
    console.log("⏸️ Juego pausado.");
}

function reanudarJuego() {
    const ciudad = cargarCiudad();
    if (!ciudad) return;
    turnoService.iniciarTurnos(ciudad);
    pausado = false;
    console.log("▶️ Juego reanudado.");
}

function togglePausa() {
    if (pausado) {
        reanudarJuego();
    } else {
        pausarJuego();
    }
}

// Mostrar el modal y cargar el valor actual
function mostrarModalDuracion() {
    const modal = document.getElementById("modalConfigDuracion");
    const input = document.getElementById("inputDuracionSegundos");
    if (!modal || !input || !ciudadActual) return;
    
    // Cargar la duración actual de la ciudad (en segundos)
    input.value = ciudadActual.duracionTurnoSeg || 300;
    modal.classList.remove("hidden");
}

// Cerrar modal
function cerrarModalDuracion() {
    const modal = document.getElementById("modalConfigDuracion");
    if (modal) modal.classList.add("hidden");
}

// Guardar la nueva duración
async function guardarDuracionTurno() {
    const input = document.getElementById("inputDuracionSegundos");
    if (!input || !ciudadActual) return;
    
    let segundos = parseInt(input.value, 10);
    if (isNaN(segundos) || segundos <= 0) segundos = 300;
    
    await turnoService.cambiarDuracionTurno(ciudadActual, segundos);
    
    // Recargar la ciudad para mantener la referencia actualizada
    ciudadActual = cargarCiudad();
    
    cerrarModalDuracion();
    console.log(`✅ Duración cambiada a ${segundos} segundos`);
}

// Conectar eventos al cargar la página
function conectarEventosDuracion() {
    // Botones desktop y mobile
    const btnDesktop = document.getElementById("btn-config-duracion-desktop");
    const btnMobile = document.getElementById("btn-config-duracion-mobile");
    const btnGuardar = document.getElementById("btnGuardarDuracion");
    const btnCancelar = document.getElementById("btnCancelarDuracion");
    
    if (btnDesktop) btnDesktop.addEventListener("click", mostrarModalDuracion);
    if (btnMobile) btnMobile.addEventListener("click", mostrarModalDuracion);
    if (btnGuardar) btnGuardar.addEventListener("click", guardarDuracionTurno);
    if (btnCancelar) btnCancelar.addEventListener("click", cerrarModalDuracion);
    
    // Cerrar modal si se hace clic fuera del contenido (opcional)
    const modal = document.getElementById("modalConfigDuracion");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) cerrarModalDuracion();
        });
    }
}



function iniciarJuego() {
    const ciudad = cargarCiudad();   // ✅ declaramos variable local
    if (!ciudad) {
        console.error("No se pudo cargar la ciudad. Abortando.");
        return;
    }
    ciudadActual = ciudad;           // ✅ asignamos la global

    const inputDuracion = document.getElementById("duracionTurno");
    if (inputDuracion) {
        inputDuracion.value = ciudad.duracionTurnoSeg || 300;
    }

    turnoService.onGameOver = (razon) => {
        mostrarModalGameOver(razon);
    };

    turnoService.onTurno = (resultado) => {
        mostrarAlertaRecursos(resultado.alertas || [], resultado.edificiosInhabilitados || []);
    };

    console.log("🎮 Juego iniciado con:", ciudad.nombre);
    turnoService.iniciarTurnos(ciudad);
    conectarEventosDuracion();      // ✅ botones activados

    const btnPause = document.getElementById("btnPause");
    if (btnPause) {
        btnPause.addEventListener("click", (e) => {
            e.stopPropagation();
            togglePausa();
        });
    }

    document.addEventListener("click", () => {
        if (pausado) reanudarJuego();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) pausarJuego();
        else reanudarJuego();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - TurnoController");
    iniciarJuego();
});
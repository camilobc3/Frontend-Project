import StorageCiudad from "../acceso_datos/StorageCiudad.js";
import TurnoService from "../negocio/TurnoService.js";

const turnoService = new TurnoService();
let pausado = false;

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

function iniciarJuego() {
    const ciudad = cargarCiudad();

    if (!ciudad) {
        console.error("No se pudo cargar la ciudad. Abortando.");
        return;
    }

    turnoService.onGameOver = (razon) => {
        mostrarModalGameOver(razon);
    };

    console.log("🎮 Juego iniciado con:", ciudad.nombre);
    turnoService.iniciarTurnos(ciudad);

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

    // ⏸️ Pausar cuando se sale de la pestaña
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
        pausarJuego();
        } else {
        reanudarJuego();
        }
});
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - TurnoController");
    iniciarJuego();
});
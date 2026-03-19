import StorageCiudad from "../acceso_datos/StorageCiudad.js";
import TurnoService from "../negocio/TurnoService.js";
import { actualizarPanelRecursos } from "../presentacion/ui/RecursosUI.js";

const turnoService = new TurnoService();

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

function iniciarJuego() {
    const ciudad = cargarCiudad();

    if (!ciudad) {
        console.error("No se pudo cargar la ciudad. Abortando.");
        return;
    }

    console.log("🎮 Juego iniciado con:", ciudad.nombre);
    turnoService.iniciarTurnos(ciudad);

    setInterval(() => {
        const ciudadFresca = cargarCiudad();
        if (ciudadFresca) actualizarPanelRecursos(ciudadFresca);
    }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - TurnoController");
    iniciarJuego();
});
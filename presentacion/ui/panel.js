import CiudadService from "../../negocio/CiudadService.js";

const Poblacion = document.getElementById("por-poblacion");
const Felicidad = document.getElementById("por-felicidad");
const Edificios = document.getElementById("por-edificios");
const Recursos = document.getElementById("por-recursos");
const Bonificaciones = document.getElementById("por-bonificaciones");
const Penalizaciones = document.getElementById("por-penalizaciones");
const puntuacionTotal = document.getElementById("puntuacion-total");

export function actualizarEstadisticas(ciudad) {
    const ciudadService = new CiudadService();
    const resultado = ciudadService.calcularPuntuacion(ciudad);
    Poblacion.textContent = `+${resultado.poblacion || 0}`;
    Felicidad.textContent = `+${resultado.felicidad || 0}`;
    Edificios.textContent = `+${resultado.edificios || 0}`;
    Recursos.textContent = `+${resultado.recursos || 0}`;
    Bonificaciones.textContent = `+${resultado.bonus || 0}`;
    Penalizaciones.textContent = `${resultado.penalizaciones || 0}`;
    puntuacionTotal.textContent = `${resultado.puntuacionFinal}`;
}
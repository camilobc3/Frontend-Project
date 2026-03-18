import CiudadService from "../../negocio/CiudadService.js";

const Poblacion = document.getElementById("por-poblacion");
const Felicidad = document.getElementById("por-felicidad");
const Edificios = document.getElementById("por-edificios");
const Recursos = document.getElementById("por-recursos");
const Bonificaciones = document.getElementById("por-bonificaciones");
const Penalizaciones = document.getElementById("por-penalizaciones");
const puntuacionTotal = document.getElementById("puntuacion-total");

export function actualizarEstadisticas(ciudad) {
    const resultado = CiudadService.calcularPuntuacion(ciudad);
    Poblacion.textContent = `+${resultado.poblacion}`;
    Felicidad.textContent = `+${resultado.felicidad}`;
    Edificios.textContent = `+${resultado.edificios}`;
    Recursos.textContent = `+${resultado.recursos}`;
    Bonificaciones.textContent = `+${resultado.bonificaciones}`;
    Penalizaciones.textContent = `-${resultado.penalizaciones}`;
    puntuacionTotal.textContent = puntuacion;
}
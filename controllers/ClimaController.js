import ClimaService from "../negocio/ClimaService.js";

const INTERVALO_CLIMA = 30 * 60 * 1000; // 30 minutos
let intervaloClima = null;

const climaService = new ClimaService();

export async function mostrarClima() {
    try {
        const clima = await climaService.obtenerClima();

        document.getElementById("iconoClima").src = clima.iconoUrl;
        document.getElementById("temp").textContent = clima.temperatura + "°C";
        document.getElementById("condicion").textContent = "Condición: " + clima.condicion;
        document.getElementById("humedad").textContent = "Humedad: " + clima.humedad + "%";
        document.getElementById("viento").textContent = "Viento: " + clima.viento + " m/s";

    } catch (error) {
        console.error("Error al obtener clima:", error);
        const tempElement = document.getElementById("temp");
        if (tempElement) tempElement.textContent = "⚠️ Error";
    }
}

export function iniciarClimaAutomatico() {
    if (!intervaloClima) {
        mostrarClima();
        intervaloClima = setInterval(mostrarClima, INTERVALO_CLIMA);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - ClimaController");
    iniciarClimaAutomatico();
});
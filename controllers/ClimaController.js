import { obtenerClima } from "../api/ClimaApi.js";

const INTERVALO_CLIMA = 30 * 60 * 1000;
let intervaloClima = null;

export async function mostrarClima() {
    try {
        const data = await obtenerClima();

        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        document.getElementById("iconoClima").src = iconUrl;

        document.getElementById("temp").textContent =
            data.main.temp + "°C";

        document.getElementById("condicion").textContent =
            "Condición: " + data.weather[0].description;

        document.getElementById("humedad").textContent =
            "Humedad: " + data.main.humidity + "%";

        document.getElementById("viento").textContent =
            "Viento: " + data.wind.speed + " m/s";

    } catch (error) {
        console.error("Error al obtener clima:", error);
    }
}

export function iniciarClimaAutomatico() {
    if (!intervaloClima) {
        mostrarClima();

        intervaloClima = setInterval(() => {
            mostrarClima();
        }, INTERVALO_CLIMA);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - TurnoController");
    iniciarClimaAutomatico()
});
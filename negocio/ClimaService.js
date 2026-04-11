// negocio/ClimaService.js
import { obtenerClima } from "../api/ClimaApi.js";
import Clima from "../modelos/Clima.js";

export default class ClimaService {
    constructor(climaApi) {
        this.api = climaApi;   // instancia de ClimaApi
    }

    async obtenerClima() {
        const datosCrudos = await obtenerClima();

        const temperatura = datosCrudos.main.temp;
        const condicion   = datosCrudos.weather[0].description;
        const iconCode    = datosCrudos.weather[0].icon;
        const humedad     = datosCrudos.main.humidity;
        const viento      = datosCrudos.wind.speed;

        // El modelo guarda el código, no la URL (el getter la construirá)
        return new Clima(temperatura, condicion, iconCode, humedad, viento);
    }
}
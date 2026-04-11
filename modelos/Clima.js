export default class Clima {
    constructor(temperatura, condicion, icono, humedad, viento) {
        this.temperatura = temperatura || 0;
        this.condicion   = condicion   || "Desconocida";
        this.icono       = icono       || null;
        this.humedad     = humedad     || 0;
        this.viento      = viento      || 0;
    }

    get iconoUrl() {
        if (!this.icono) return "";
        return `https://openweathermap.org/img/wn/${this.icono}@2x.png`;
    }

}
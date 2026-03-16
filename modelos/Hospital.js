import EdificioServicio from './EdificioServicio.js';

/**
 * Clase Hospital
 * Representa un hospital que brinda atención médica
 */
class Hospital extends EdificioServicio {
    /**
     * @param {number} costo - Costo de construcción del hospital
     * @param {number} radio - Radio de cobertura del servicio
     * @param {number} beneficio - Beneficio que proporciona a la salud
     */
    constructor(costo=6000, radio=7, beneficio=10) {
        super(costo, radio, beneficio);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de salud producida por turno
     */
    produccionXTurno() {
        // Implementación específica para hospital
        return 0;
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() { //Consumo agua por turno
        return 10;
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() { //Consumo electricidad por turno
        return 20;
    }
}

export default Hospital;
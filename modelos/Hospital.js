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
    constructor(costo, radio, beneficio) {
        super(costo, radio, beneficio);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de salud producida por turno
     */
    produccionXTurno() {
        // Implementación específica para hospital
        return 90; // Valor por defecto
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 60; // Los hospitales consumen mucha agua
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 80; // Los hospitales requieren mucha electricidad
    }
}


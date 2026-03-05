import EdificioServicio from './EdificioServicio.js';

/**
 * Clase EstacionBombero
 * Representa una estación de bomberos que brinda protección contra incendios
 */
class EstacionBombero extends EdificioServicio {
    /**
     * @param {number} costo - Costo de construcción de la estación de bomberos
     * @param {number} radio - Radio de cobertura del servicio
     * @param {number} beneficio - Beneficio que proporciona a la protección
     */
    constructor(costo, radio, beneficio) {
        super(costo, radio, beneficio);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de protección producida por turno
     */
    produccionXTurno() {
        // Implementación específica para estación de bomberos
        return 70; // Valor por defecto
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 50; // Las estaciones de bomberos consumen más agua
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 35; // Valor por defecto
    }
}


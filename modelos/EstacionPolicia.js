import EdificioServicio from './EdificioServicio.js';

/**
 * Clase EstacionPolicia
 * Representa una estación de policía que brinda seguridad
 */
class EstacionPolicia extends EdificioServicio {
    /**
     * @param {number} costo - Costo de construcción de la estación de policía
     * @param {number} radio - Radio de cobertura del servicio
     * @param {number} beneficio - Beneficio que proporciona a la seguridad
     */
    constructor(costo, radio, beneficio) {
        super(costo, radio, beneficio);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de seguridad producida por turno
     */
    produccionXTurno() {
        // Implementación específica para estación de policía
        return 80; // Valor por defecto
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 20; // Valor por defecto
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 40; // Valor por defecto
    }
}


import EdificioIndustrial from './EdificioIndustrial.js';

/**
 * Clase Granja
 * Representa una granja que produce alimentos
 */
class Granja extends EdificioIndustrial {
    /**
     * @param {number} costo - Costo de construcción de la granja
     * @param {number} numeroEmpleos - Número de empleos que genera
     */
    constructor(costo, numeroEmpleos) {
        super(costo, numeroEmpleos);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de alimentos producidos por turno
     */
    produccionXTurno() {
        // Implementación específica para granja
        return 120; // Valor por defecto
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 80; // Las granjas consumen mucha agua para irrigación
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 30; // Valor por defecto
    }
}


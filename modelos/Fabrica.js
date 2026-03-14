import EdificioIndustrial from './EdificioIndustrial.js';

/**
 * Clase Fabrica
 * Representa una fábrica que produce bienes industriales
 */
class Fabrica extends EdificioIndustrial {
    /**
     * @param {number} costo - Costo de construcción de la fábrica
     * @param {number} numeroEmpleos - Número de empleos que genera
     */
    constructor(costo, numeroEmpleos) {
        super(costo, numeroEmpleos);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de bienes producidos por turno
     */
    produccionXTurno() {
        // Implementación específica para fábrica
        return 150; // Valor por defecto
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 40; // Valor por defecto
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 100; // Las fábricas consumen mucha electricidad
    }
}

export default Fabrica;
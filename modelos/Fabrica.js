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
    constructor(costo=5000, numeroEmpleos=15) {
        super(costo, numeroEmpleos);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de bienes producidos por turno
     */
    produccionXTurno() {
        // Implementación específica para fábrica
        return 800;
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() { //Consumo por turno
        return 15;
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() { //Consumo por turno
        return 20;
    }
}

export default Fabrica;
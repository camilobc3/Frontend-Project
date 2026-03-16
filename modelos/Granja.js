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
    constructor(costo=3000, numeroEmpleos=8) {
        super(costo, numeroEmpleos);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de alimentos producidos por turno
     */
    produccionXTurno() {
        // Implementación específica para granja
        return 0;
    }

    produccionAlimento(){ //Produccion por turno
        return 50;
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {//Consumo por turno
        return 10;
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() { //Consumo por turno
        return 0;
    }
}

export default Granja;
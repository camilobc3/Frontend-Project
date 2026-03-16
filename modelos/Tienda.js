import EdificioComercial from './EdificioComercial.js';

/**
 * Clase Tienda
 * Representa una tienda pequeña que vende productos
 */
class Tienda extends EdificioComercial {
    /**
     * @param {number} costo - Costo de construcción de la tienda
     * @param {number} numeroEmpleos - Número de empleos que genera
     */
    constructor(costo=2000, numeroEmpleos=6) {
        super(costo, numeroEmpleos);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de ingresos generados por turno
     */
    produccionXTurno() {
        // Implementación específica para tienda
        return 500;
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() { //Consumo por turno
        return 0;
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {//Consumo por turno
        return 8;
    }
}

export default Tienda;
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
    constructor(costo, numeroEmpleos) {
        super(costo, numeroEmpleos);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de ingresos generados por turno
     */
    produccionXTurno() {
        // Implementación específica para tienda
        return 60; // Valor por defecto
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 15; // Valor por defecto
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 25; // Valor por defecto
    }
}


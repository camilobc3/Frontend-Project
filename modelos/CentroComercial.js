import EdificioComercial from './EdificioComercial.js';

/**
 * Clase CentroComercial
 * Representa un centro comercial grande con múltiples tiendas
 */
class CentroComercial extends EdificioComercial {
    /**
     * @param {number} costo - Costo de construcción del centro comercial
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
        // Implementación específica para centro comercial
        return 200; // Valor por defecto - más alto que tienda
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 50; // Los centros comerciales consumen más agua
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 90; // Los centros comerciales requieren mucha electricidad
    }
}


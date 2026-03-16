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
    constructor(costo=8000, numeroEmpleos=20) {
        super(costo, numeroEmpleos);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de ingresos generados por turno
     */
    produccionXTurno() {
        // Implementación específica para centro comercial
        return 2000;
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 0;
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 25;
    }
}

export default CentroComercial;
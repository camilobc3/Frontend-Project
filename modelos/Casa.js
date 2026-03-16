import EdificioResidencial from './EdificioResidencial.js';

/**
 * Clase Casa
 * Representa una casa familiar individual
 */
class Casa extends EdificioResidencial {
    /**
     * @param {number} costo - Costo de construcción de la casa
     * @param {number} capacidadVivienda - Número de habitantes que puede albergar
     */
    constructor(costo=1000, capacidadVivienda=4) {
        super(costo, capacidadVivienda);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de impuestos generados por turno
     */
    produccionXTurno() {
        // Implementación específica para casa
        return 0; // Valor por defecto
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() { //Consumo agua por turno
        return 3;
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() { //consumo electricidad por turno
        return 5;
    }
}

export default Casa;
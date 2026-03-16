import EdificioResidencial from './EdificioResidencial.js';

/**
 * Clase Apartamento
 * Representa un edificio de apartamentos con múltiples unidades
 */
class Apartamento extends EdificioResidencial {
    /**
     * @param {number} costo - Costo de construcción del edificio de apartamentos
     * @param {number} capacidadVivienda - Número de habitantes que puede albergar
     */
    constructor(costo=3000, capacidadVivienda=12) {
        super(costo, capacidadVivienda);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de impuestos generados por turno
     */
    produccionXTurno() {
        // Implementación específica para apartamento
        return 0;
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {//Consumo agua por turno
        return 10;
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {//consumo electricidad por turno
        return 15;
    }
}

export default Apartamento;
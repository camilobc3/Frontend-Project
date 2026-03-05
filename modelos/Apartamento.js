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
    constructor(costo, capacidadVivienda) {
        super(costo, capacidadVivienda);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de impuestos generados por turno
     */
    produccionXTurno() {
        // Implementación específica para apartamento
        return 80; // Valor por defecto - más alto que casa por tener más unidades
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        return 70; // Los apartamentos consumen más agua por tener más habitantes
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        return 60; // Los apartamentos consumen más electricidad
    }
}


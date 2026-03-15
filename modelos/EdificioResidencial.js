import Edificio from './Edificio.js';


/**
 * Clase abstracta EdificioResidencial
 * Hereda de Edificio e implementa las interfaces Produccion y ConsumoServicios
 */
class EdificioResidencial extends Edificio {
    /**
     * @param {number} costo - Costo de construcción del edificio residencial
     * @param {number} capacidadVivienda - Capacidad de habitantes
     */
    constructor(costo, capacidadVivienda) {
        if (new.target === EdificioResidencial) {
            throw new Error("No se puede instanciar la clase abstracta EdificioResidencial");
        }
        super(costo);
        this.capacidadVivienda = capacidadVivienda;
    }

    /**
     * Implementación del método de la interfaz Produccion
     * @returns {number} La cantidad de producción por turno
     */
    produccionXTurno() {
        throw new Error("El método produccionXTurno() debe ser implementado en las clases derivadas");
    }

    /**
     * Implementación del método de la interfaz ConsumoServicios
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        throw new Error("El método consumoAgua() debe ser implementado en las clases derivadas");
    }

    /**
     * Implementación del método de la interfaz ConsumoServicios
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        throw new Error("El método consumoElectricidad() debe ser implementado en las clases derivadas");
    }
}

export default EdificioResidencial;
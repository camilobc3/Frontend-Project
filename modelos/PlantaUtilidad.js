import Edificio from './Edificio.js';
import Produccion from './Produccion.js';
import ConsumoServicios from './ConsumoServicios.js';

/**
 * Clase abstracta PlantaUtilidad
 * Hereda de Edificio e implementa las interfaces Produccion y ConsumoServicios
 */
class PlantaUtilidad extends Edificio {
    /**
     * @param {number} costo - Costo de construcción de la planta
     */
    constructor(costo) {
        if (new.target === PlantaUtilidad) {
            throw new Error("No se puede instanciar la clase abstracta PlantaUtilidad");
        }
        super(costo);
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


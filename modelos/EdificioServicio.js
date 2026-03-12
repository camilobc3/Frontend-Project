import Edificio from './Edificio.js';
import Produccion from './Produccion.js';
import ConsumoServicios from './ConsumoServicios.js';

/**
 * Clase abstracta EdificioServicio
 * Hereda de Edificio e implementa las interfaces Produccion y ConsumoServicios
 */
class EdificioServicio extends Edificio {
    /**
     * @param {number} costo - Costo de construcción del edificio de servicio
     * @param {number} radio - Radio de cobertura del servicio
     * @param {number} beneficio - Beneficio que proporciona el servicio
     */
    constructor(costo, radio, beneficio) {
        if (new.target === EdificioServicio) {
            throw new Error("No se puede instanciar la clase abstracta EdificioServicio");
        }
        super(costo);
        this.radio = radio;
        this.beneficio = beneficio;
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

export default EdificioServicio;
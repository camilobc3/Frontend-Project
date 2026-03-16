import PlantaUtilidad from './PlantaUtilidad.js';

/**
 * Clase PlantaElectrica
 * Representa una planta de electricidad que produce energía
 */
class PlantaElectrica extends PlantaUtilidad {
    /**
     * @param {number} costo - Costo de construcción de la planta eléctrica
     */
    constructor(costo=10000) {
        super(costo);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de electricidad producida por turno
     */
    produccionXTurno() {
        // Implementación específica para planta eléctrica
        return 0; // Valor por defecto, puede ser modificado según lógica del juego
    }

    produccionElectricidad(){//Produccion por turno
        return 200;
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {//Consumo por turno
        return 0; // Valor por defecto
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() { //Consumo por turno
        return 0; // Valor por defecto
    }
}

export default PlantaElectrica;
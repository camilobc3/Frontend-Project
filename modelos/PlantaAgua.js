import PlantaUtilidad from './PlantaUtilidad.js';

/**
 * Clase PlantaAgua
 * Representa una planta de agua que produce agua potable
 */
class PlantaAgua extends PlantaUtilidad {
    /**
     * @param {number} costo - Costo de construcción de la planta de agua
     */
    constructor(costo=8000) {
        super(costo);
        this.tipo = "U2";
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de agua producida por turno
     */
    produccionXTurno() {
        return 0; // Valor por defecto, puede ser modificado según lógica del juego
    }

    produccionAgua(){//Produccion por turno
        return 150;
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
    consumoElectricidad() {//Consumo por turno
        return 20; // Valor por defecto
    }
}

export default PlantaAgua;
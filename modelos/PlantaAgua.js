import PlantaUtilidad from './PlantaUtilidad.js';

/**
 * Clase PlantaAgua
 * Representa una planta de agua que produce agua potable
 */
class PlantaAgua extends PlantaUtilidad {
    /**
     * @param {number} costo - Costo de construcción de la planta de agua
     */
    constructor(costo) {
        super(costo);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de agua producida por turno
     */
    produccionXTurno() {
        // Implementación específica para planta de agua
        return 100; // Valor por defecto, puede ser modificado según lógica del juego
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        // Las plantas de agua producen más de lo que consumen
        return 5; // Valor por defecto
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        // Las plantas de agua necesitan electricidad para bombear
        return 30; // Valor por defecto
    }
}

export default PlantaAgua;
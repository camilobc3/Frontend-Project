import PlantaUtilidad from './PlantaUtilidad.js';

/**
 * Clase PlantaElectrica
 * Representa una planta de electricidad que produce energía
 */
class PlantaElectrica extends PlantaUtilidad {
    /**
     * @param {number} costo - Costo de construcción de la planta eléctrica
     */
    constructor(costo) {
        super(costo);
    }

    /**
     * Implementación del método produccionXTurno
     * @returns {number} La cantidad de electricidad producida por turno
     */
    produccionXTurno() {
        // Implementación específica para planta eléctrica
        return 100; // Valor por defecto, puede ser modificado según lógica del juego
    }

    /**
     * Implementación del método consumoAgua
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        // Las plantas eléctricas consumen agua para enfriamiento
        return 50; // Valor por defecto
    }

    /**
     * Implementación del método consumoElectricidad
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        // Las plantas eléctricas producen más de lo que consumen
        return 10; // Valor por defecto
    }
}

export default PlantaElectrica;

import Edificio from './Edificio.js';

/**
 * Clase Camino
 * Representa un camino en la ciudad
 */
class Camino extends Edificio {
    /**
     * @param {number} costo - Costo de construcción del camino
     * @param {number} beneficio - Beneficio que proporciona el camino
     */
    constructor(costo, beneficio) {
        super(costo);
        this.beneficio = beneficio;
    }
}


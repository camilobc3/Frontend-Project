import Edificio from './Edificio.js';

/**
 * Clase Parque
 * Representa un parque en la ciudad
 */
class Parque extends Edificio {
    /**
     * @param {number} costo - Costo de construcción del parque
     * @param {number} beneficio - Beneficio que proporciona el parque
     */
    constructor(costo, beneficio) {
        super(costo);
        this.beneficio = beneficio;
    }
}

export default Parque;

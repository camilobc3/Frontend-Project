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
    constructor(costo=100, beneficio=0) {
        super(costo);
        this.tipo = "R";
        this.beneficio = beneficio;
    }
}

export default Camino;
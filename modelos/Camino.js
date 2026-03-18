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

    produccionXTurno() {
    //Implementación específica para Camino
       return 0;
    }

   
    //Implementación del método consumoAgua
    //@returns {number} La cantidad de agua consumida
    
    consumoAgua() { //Consumo por turno
        return 0;
    }

    
    //Implementación del método consumoElectricidad
    //@returns {number} La cantidad de electricidad consumida
        
    consumoElectricidad() {//Consumo por turno
        return 0;
    }
}

export default Camino;
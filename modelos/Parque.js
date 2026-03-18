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
    constructor(costo=1500, beneficio=5) {
        super(costo);
        this.tipo = "P1";
        this.beneficio = beneficio;
    }

    produccionXTurno() {
        //Implementación específica para Parque
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

export default Parque;
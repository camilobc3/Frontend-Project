/**
 * Clase Mapa
 * Representa el mapa de la ciudad donde se ubican los edificios
 */
class Mapa {
    /**
     * @param {number} tamaño - Tamaño del mapa
     */
    constructor(tamaño) {
        this.tamaño = tamaño;
        this.misEdificios = []; // Relación 1-n con Edificio
    }

    /**
     * Agrega un edificio al mapa
     * @param {Edificio} edificio - El edificio a agregar
     */
    agregarEdificio(edificio) {
        this.misEdificios.push(edificio);
    }

    /**
     * Elimina un edificio del mapa
     * @param {Edificio} edificio - El edificio a eliminar
     */
    eliminarEdificio(edificio) {
        this.misEdificios = this.misEdificios.filter(e => e !== edificio);
    }
}

export default Mapa;

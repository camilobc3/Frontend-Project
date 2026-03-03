/**
 * Interfaz Produccion
 * Las clases que implementen esta interfaz deben proporcionar el método produccionXTurno()
 */
class Produccion {
    /**
     * Método que debe ser implementado por las clases que implementen esta interfaz
     * @returns {number} La cantidad de producción por turno
     */
    produccionXTurno() {
        throw new Error("El método produccionXTurno() debe ser implementado");
    }
}

export default Produccion;

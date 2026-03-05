/**
 * Interfaz ConsumoServicios
 * Las clases que implementen esta interfaz deben proporcionar los métodos consumoAgua() y consumoElectricidad()
 */
class ConsumoServicios {
    /**
     * Método que debe ser implementado por las clases que implementen esta interfaz
     * @returns {number} La cantidad de agua consumida
     */
    consumoAgua() {
        throw new Error("El método consumoAgua() debe ser implementado");
    }

    /**
     * Método que debe ser implementado por las clases que implementen esta interfaz
     * @returns {number} La cantidad de electricidad consumida
     */
    consumoElectricidad() {
        throw new Error("El método consumoElectricidad() debe ser implementado");
    }
}


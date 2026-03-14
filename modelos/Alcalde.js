/**
 * Clase Alcalde
 * Representa un alcalde que puede gestionar múltiples ciudades
 */
class Alcalde {
    /**
     * @param {number} id - Identificador único del alcalde
     * @param {string} nombre - Nombre del alcalde
     * @param {string} contraseña - Contraseña del alcalde
     */
    constructor(id, nombre, contraseña) {
        this.id = id;
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.misCiudades = []; // Relación 1-n con Ciudad
    }
}

export default Alcalde;
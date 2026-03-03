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

    /**
     * Agrega una ciudad a la lista de ciudades del alcalde
     * @param {Ciudad} ciudad - La ciudad a agregar
     */
    agregarCiudad(ciudad) {
        this.misCiudades.push(ciudad);
    }

    /**
     * Elimina una ciudad de la lista de ciudades del alcalde
     * @param {number} ciudadId - ID de la ciudad a eliminar
     */
    eliminarCiudad(ciudadId) {
        this.misCiudades = this.misCiudades.filter(ciudad => ciudad.id !== ciudadId);
    }
}

export default Alcalde;

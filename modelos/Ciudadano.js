import Ciudad from "/modelos/Ciudad.js";

/**
 * Clase Ciudadano
 * Representa un ciudadano de la ciudad con su nivel de felicidad
 */
class Ciudadano {
    /**
     * @param {number} id - Identificador único del ciudadano
     * @param {number} nivelFelicidad - Nivel de felicidad del ciudadano
     */
    constructor(id, nivelFelicidad) {
        this.id = id;
        this.nivelFelicidad = nivelFelicidad;
        this.miCiudad = Ciudad; // Relación 1-1 con Ciudad
        this.misContratos = []; // Relación n-n con Edificio a través de Contrato
    }

    /**
     * Agrega un contrato al ciudadano
     * @param {Contrato} contrato - El contrato a agregar
     */
    agregarContrato(contrato) {
        this.misContratos.push(contrato);
    }

    /**
     * Elimina un contrato del ciudadano
     * @param {number} contratoId - ID del contrato a eliminar
     */
    eliminarContrato(contratoId) {
        this.misContratos = this.misContratos.filter(contrato => contrato.id !== contratoId);
    }

    /**
     * Obtiene un ciudadano por su ID de una lista
     * @param {Array} listaCiudadanos - Lista de ciudadanos
     * @param {number} id - ID del ciudadano a buscar
     * @returns {Ciudadano|null} El ciudadano encontrado o null
     */
    obtenerCiudadanoPorId(listaCiudadanos, id) {
        return listaCiudadanos.find(c => c.id === id) ?? null;
    }
}

export default Ciudadano;
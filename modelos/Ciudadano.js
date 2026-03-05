import Ciudad from "./Ciudad";

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
}

export default Ciudadano;

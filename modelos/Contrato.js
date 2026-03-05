/**
 * Clase Contrato
 * Representa la relación muchos a muchos entre Ciudadano y Edificio
 */
class Contrato {
    /**
     * @param {number} id - Identificador único del contrato
     * @param {Ciudadano} miCiudadano - El ciudadano asociado al contrato
     * @param {Edificio} miEdificio - El edificio asociado al contrato
     */
    constructor(id, miCiudadano = null, miEdificio = null) {
        this.id = id;
        this.miCiudadano = miCiudadano; // Relación con Ciudadano
        this.miEdificio = miEdificio;   // Relación con Edificio
    }

    /**
     * Establece el ciudadano del contrato
     * @param {Ciudadano} ciudadano - El ciudadano a asignar
     */
    setCiudadano(ciudadano) {
        this.miCiudadano = ciudadano;
    }

    /**
     * Establece el edificio del contrato
     * @param {Edificio} edificio - El edificio a asignar
     */
    setEdificio(edificio) {
        this.miEdificio = edificio;
    }
}


/**
 * Clase Ciudad
 * Representa una ciudad gestionada por un alcalde
 */
class Ciudad {
    /**
     * @param {number} id - Identificador único de la ciudad
     * @param {string} nombre - Nombre de la ciudad
     * @param {number} turno - Número de turno actual
     * @param {Mapa} miMapa - El mapa de la ciudad
     */
    constructor(id, nombre, turno, miMapa = null) { //REVISAR SI EL MAPA SE ASIGNA EN EL CONSTRUCTOR O SE HACE DESPUES CON UN SETTER
        this.id = id;
        this.nombre = nombre;
        this.turno = turno;
        this.miMapa = miMapa;          // Relación 1-1 con Mapa
        this.misCiudadanos = [];       // Relación 1-n con Ciudadano
        this.misEdificios = [];        // Relación 1-n con Edificio

        this.dinero = 50000; // Dinero inicial de la ciudad
        this.agua = 30;
        this.electricidad = 30;
        this.alimento = 30;

        this.ingresosXTurno = 100;
        this.electricidadXTurno = 0;
        this.aguaXTurno = 0;
        this.alimentoXTurno = 0;
    }

    /**
     * Establece el mapa de la ciudad
     * @param {Mapa} mapa - El mapa a asignar
     */
    setMapa(mapa) {
        this.miMapa = mapa;
    }

    /**
     * Agrega un ciudadano a la ciudad
     * @param {Ciudadano} ciudadano - El ciudadano a agregar
     */
    agregarCiudadano(ciudadano) {
        this.misCiudadanos.push(ciudadano);
    }

    /**
     * Elimina un ciudadano de la ciudad
     * @param {number} ciudadanoId - ID del ciudadano a eliminar
     */
    eliminarCiudadano(ciudadanoId) {
        this.misCiudadanos = this.misCiudadanos.filter(c => c.id !== ciudadanoId);
    }

    /**
     * Agrega un edificio a la ciudad
     * @param {Edificio} edificio - El edificio a agregar
     */
    agregarEdificio(edificio) {
        this.misEdificios.push(edificio);
    }

    /**
     * Elimina un edificio de la ciudad
     * @param {Edificio} edificio - El edificio a eliminar
     */
    eliminarEdificio(edificio) {
        this.misEdificios = this.misEdificios.filter(e => e !== edificio);
    }

    /**
     * Avanza al siguiente turno
     */
    avanzarTurno() {
        this.turno++;
    }
}


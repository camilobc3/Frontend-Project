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
     * @param {string} region - La región geográfica de la ciudad
     */
    constructor(id, nombre, turno=0, miMapa = null, region) { //REVISAR SI EL MAPA SE ASIGNA EN EL CONSTRUCTOR O SE HACE DESPUES CON UN SETTER
        this.id = id;
        this.nombre = nombre;
        this.turno = turno;
        this.miMapa = miMapa;          // Relación 1-1 con Mapa
        this.misCiudadanos = [];       // Relación 1-n con Ciudadano
        this.misEdificios = [];        // Relación 1-n con Edificio
        this.region = region;          // La región geográfica de la ciudad

        this.dinero = 50000; // Dinero inicial de la ciudad
        this.agua = 0;
        this.electricidad = 0;
        this.alimento = 0;

        this.ingresosXTurno = 0;
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

     /**
     * Calcula la puntuación total de la ciudad y devuelve el desglose
     * Basado en la fórmula y reglas de las fuentes [1, 2, 6, 7]
     * @returns {Object} Desglose detallado de la puntuación
     */
    calcularPuntuacion() {
        // 1. Obtención de métricas base
        const poblacion = this.misCiudadanos.length;
        const numEdificios = this.misEdificios.length;
        
        // Calcular felicidad promedio (HU-013) [8, 9]
        const felicidadPromedio = poblacion > 0 
            ? this.misCiudadanos.reduce((sum, c) => sum + c.felicidad, 0) / poblacion 
            : 0;

        // Contar desempleados para penalización [7]
        const ciudadanosDesempleados = this.misCiudadanos.filter(c => !c.tieneEmpleo).length;

        // 2. Cálculo Base (Fórmula [1, 2])
        const puntosPoblacion = poblacion * 10;
        const puntosFelicidad = felicidadPromedio * 5;
        const puntosDinero = this.dinero / 100;
        const puntosEdificios = numEdificios * 50;
        const puntosElectricidad = this.balanceElectricidad * 2;
        const puntosAgua = this.balanceAgua * 2;

        let scoreBase = puntosPoblacion + puntosFelicidad + puntosDinero + 
                        puntosEdificios + puntosElectricidad + puntosAgua;

        // 3. Bonificaciones [2, 6]
        let bonificaciones = 0;
        if (poblacion > 0 && ciudadanosDesempleados === 0) bonificaciones += 500;
        if (felicidadPromedio > 80) bonificaciones += 300;
        if (this.dinero >= 0 && this.balanceElectricidad >= 0 && this.balanceAgua >= 0) {
            bonificaciones += 200;
        }
        if (poblacion > 1000) bonificaciones += 1000;

        // 4. Penalizaciones [2, 6, 7]
        let penalizaciones = 0;
        if (this.dinero < 0) penalizaciones += 500;
        if (this.balanceElectricidad < 0) penalizaciones += 300;
        if (this.balanceAgua < 0) penalizaciones += 300;
        if (felicidadPromedio < 40) penalizaciones += 400;
        penalizaciones += (ciudadanosDesempleados * 10);

        // 5. Resultado Final
        this.puntuacionAcumulada = Math.floor(scoreBase + bonificaciones - penalizaciones);

        // Retornar desglose para cumplir con la HU-018 [7]
        return {
            total: this.puntuacionAcumulada,
            desglose: {
                poblacion: puntosPoblacion,
                felicidad: puntosFelicidad,
                dinero: puntosDinero,
                edificios: puntosEdificios,
                recursos: puntosElectricidad + puntosAgua,
                bonos: bonificaciones,
                penalizaciones: -penalizaciones
            }
        };
    }
}

export default Ciudad;
/**
 * Clase abstracta Edificio
 * Clase base para todos los tipos de edificios en el juego
 */
class Edificio {
    /**
     * @param {number} id - Identificador único del edificio
     * @param {number} costo - Costo de construcción del edificio
     */
    constructor(id, costo) {
        if (new.target === Edificio) {
            throw new Error("No se puede instanciar la clase abstracta Edificio");
        }
        this.id = id;
        this.costo = costo;
        this.activo = true;
        
        this.misContratos = []; // Relación n-n con Ciudadano a través de Contrato
    
    }

    /**
     * Agrega un contrato al edificio
     * @param {Contrato} contrato - El contrato a agregar
     */
    agregarContrato(contrato) {
        this.misContratos.push(contrato);
    }

    /**
     * Elimina un contrato del edificio
     * @param {number} contratoId - ID del contrato a eliminar
     */
    eliminarContrato(contratoId) {
        this.misContratos = this.misContratos.filter(contrato => contrato.id !== contratoId);
    }

    /**
     * Obtiene un edificio por su ID de una lista
     * @param {Array} listaEdificios - Lista de edificios
     * @param {number} id - ID del edificio a buscar
     * @returns {Edificio|null} El edificio encontrado o null
     */
    obtenerEdificioPorId(listaEdificios, id) {
        return listaEdificios.find(e => e.id === id) ?? null;
    }
}

export default Edificio;
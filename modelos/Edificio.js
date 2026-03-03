/**
 * Clase abstracta Edificio
 * Clase base para todos los tipos de edificios en el juego
 */
class Edificio {
    /**
     * @param {number} costo - Costo de construcción del edificio
     */
    constructor(costo) {
        if (new.target === Edificio) {
            throw new Error("No se puede instanciar la clase abstracta Edificio");
        }
        this.costo = costo;
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
}

export default Edificio;

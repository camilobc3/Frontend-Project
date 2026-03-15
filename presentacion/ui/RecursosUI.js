import { ciudad } from "../../modelos/Ciudad.js";

export function actualizarRecursosUI() {

    document.getElementById("dinero").textContent = ciudad.dinero;
    document.getElementById("poblacion").textContent = ciudad.poblacion;
    document.getElementById("energia").textContent = ciudad.energia;
    document.getElementById("agua").textContent = ciudad.agua;
    document.getElementById("felicidad").textContent = ciudad.felicidad;

}
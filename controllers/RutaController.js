import RutaService from "../negocio/RutaService.js";

const rutaService = new RutaService();

let modoRuta = null;
let origen = null;
let destino = null;

function activarModoRuta() {
    modoRuta = "origen";
    origen = null;
    destino = null;
    limpiarRuta();
    mostrarMensaje("Selecciona el edificio de origen");
    document.getElementById("btnCancelarRuta").classList.remove("oculto");
    console.log("Modo ruta activado - selecciona el origen");
}

function cancelarRuta() {
    modoRuta = null;
    origen = null;
    destino = null;
    limpiarRuta();
    mostrarMensaje("");
    document.getElementById("btnCancelarRuta").classList.add("oculto");
    console.log("Ruta cancelada");
}

function mostrarMensaje(texto) {
    const el = document.getElementById("rutaMensaje");
    if (el) el.textContent = texto;
}

function limpiarRuta() {
    document.querySelectorAll("[data-ruta]").forEach(celda => {
        celda.removeAttribute("data-ruta");
    });
}

function animarRuta(ruta) {
    ruta.forEach(([fila, columna]) => {
        const celda = document.querySelector(
            `[data-fila="${fila}"][data-columna="${columna}"]`
        );
        if (celda) {
            celda.setAttribute("data-ruta", "true");
            console.log("atributo puesto:", celda.getAttribute("data-ruta"), celda);
        }
    });
}

export function manejarClickCelda(fila, columna) {
    if (!modoRuta) return false;

    if (modoRuta === "origen") {
        origen = [fila, columna];
        modoRuta = "destino";
        mostrarMensaje("Ahora selecciona el edificio de destino");
        console.log("Origen:", origen);
        return true;
    }

    if (modoRuta === "destino") {
        destino = [fila, columna];
        modoRuta = null;
        ejecutarCalculo();
        return true;
    }

    return false;
}

async function ejecutarCalculo() {
    const matriz = window.mapaActual;
    if (!matriz || !origen || !destino) return;

    mostrarMensaje("Calculando ruta...");

    try {
        const resultado = await rutaService.calcularRuta(matriz, origen, destino);
        animarRuta(resultado.route);
        mostrarMensaje("✅ Ruta calculada");
    } catch (error) {
        mostrarMensaje(`❌ ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnCalcularRuta = document.getElementById("btnCalcularRuta");
    const btnCancelarRuta = document.getElementById("btnCancelarRuta");

    if (btnCalcularRuta) btnCalcularRuta.addEventListener("click", activarModoRuta);
    if (btnCancelarRuta) btnCancelarRuta.addEventListener("click", cancelarRuta);
});
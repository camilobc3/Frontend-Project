// acceso_datos/MapaRepository.js
import { rehidratarEdificios, rehidratarMatriz } from "../acceso_datos/ReconstuirObjetosMapa.js";

function normalizarCelda(celda) {
    if (celda === null || celda === "." || celda === "g") return null;
    if (typeof celda === "string") return { tipo: celda };
    return celda;
}

function normalizarMatriz(matrizRaw, mensajeError) {
    if (!Array.isArray(matrizRaw)) {
        throw new Error(mensajeError);
    }

    return matrizRaw.map(fila => fila.map(normalizarCelda));
}

const MapaRepository = {
    cargarDesdeTexto(texto) {
        try {
            const datos = JSON.parse(texto);

            if (datos && typeof datos === "object" && datos.ciudad) {
                const ciudad = datos.ciudad;
                const matrizRaw = ciudad.miMapa?.matriz;
                const matrizPlana = normalizarMatriz(
                    matrizRaw,
                    "El archivo de ciudad no contiene una matriz valida"
                );

                ciudad.miMapa.matriz = rehidratarMatriz(matrizPlana);
                if (Array.isArray(ciudad.misEdificios)) {
                    ciudad.misEdificios = rehidratarEdificios(ciudad.misEdificios);
                }

                return { tipo: "ciudad", ciudad };
            }

            const matrizRaw = datos?.matriz ?? datos;
            const matrizPlana = normalizarMatriz(matrizRaw, "El archivo no tiene formato de matriz valido");

            return { tipo: "matriz", matriz: rehidratarMatriz(matrizPlana) };
        } catch (error) {
            throw new Error("Error al procesar el archivo: " + error.message);
        }
    }
};

export default MapaRepository;
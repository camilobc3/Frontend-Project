// acceso_datos/MapaRepository.js
import { rehidratarEdificios, rehidratarMatriz } from "../acceso_datos/ReconstuirObjetosMapa.js";


const MapaRepository = {
    cargarDesdeArchivo() {
        return new Promise((resolve, reject) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";

            input.addEventListener("change", async (e) => {
                const archivo = e.target.files[0];
                if (!archivo) {
                    reject(new Error("No se seleccionó ningún archivo"));
                    return;
                }
                try {
                    const texto = await archivo.text();
                    const datos = JSON.parse(texto);

                    if (datos && typeof datos === "object" && datos.ciudad) {
                        const ciudad = datos.ciudad;
                        const matrizRaw = ciudad.miMapa?.matriz;

                        if (!Array.isArray(matrizRaw)) {
                            throw new Error("El archivo de ciudad no contiene una matriz valida");
                        }

                        const matrizPlana = matrizRaw.map(fila =>
                            fila.map(celda => {
                                if (celda === null || celda === "." || celda === "g") return null;
                                if (typeof celda === "string") return { tipo: celda };
                                return celda;
                            })
                        );

                        ciudad.miMapa.matriz = rehidratarMatriz(matrizPlana);
                        if (Array.isArray(ciudad.misEdificios)) {
                            ciudad.misEdificios = rehidratarEdificios(ciudad.misEdificios);
                        }

                        resolve({ tipo: "ciudad", ciudad });
                        return;
                    }

                    const matrizRaw = datos.matriz ?? datos;
                    if (!Array.isArray(matrizRaw)) {
                        throw new Error("El archivo no tiene formato de matriz valido");
                    }

                    const matrizPlana = matrizRaw.map(fila =>
                        fila.map(celda => {
                            if (celda === null || celda === "." || celda === "g") return null;
                            if (typeof celda === "string") return { tipo: celda };
                            return celda;
                        })
                    );

                    resolve({ tipo: "matriz", matriz: rehidratarMatriz(matrizPlana) });
                } catch (error) {
                    reject(new Error("Error al procesar el archivo: " + error.message));
                }
            });

            input.click();
        });
    }
};

export default MapaRepository;
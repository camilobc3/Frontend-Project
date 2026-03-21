// acceso_datos/MapaRepository.js
import { rehidratarMatriz } from "../acceso_datos/ReconstuirObjetosMapa.js";


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
                    const matrizRaw = datos.matriz ?? datos;

                    const matrizPlana = matrizRaw.map(fila =>
                        fila.map(celda => {
                            if (celda === null || celda === "." || celda === "g") return null;
                            if (typeof celda === "string") return { tipo: celda };
                            return celda;
                        })
                    );

                    resolve(rehidratarMatriz(matrizPlana));
                } catch (error) {
                    reject(new Error("Error al procesar el archivo: " + error.message));
                }
            });

            input.click();
        });
    }
};
//Si
export default MapaRepository;
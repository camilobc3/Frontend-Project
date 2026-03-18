import { rehidratarMatriz } from "../acceso_datos/ReconstuirObjetosMapa.js";

const StorageCiudad = {
    key: "ciudades_v1",

    load() {
        const lista = JSON.parse(localStorage.getItem(this.key) || "[]");
        // ✅ Rehidrata antes de entregar los datos
        return lista.map(ciudad => {
            if (ciudad.miMapa?.matriz) {
                ciudad.miMapa.matriz = rehidratarMatriz(ciudad.miMapa.matriz);
            }
            return ciudad;
        });
    },

    save(lista) {
        localStorage.setItem(this.key, JSON.stringify(lista));
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};

export default StorageCiudad;
import { rehidratarEdificios, rehidratarMatriz, rehidratarCiudadanos  } from "../acceso_datos/ReconstuirObjetosMapa.js";

const StorageCiudad = {
    key: "ciudades_v1",

    // load() {
    //     const lista = JSON.parse(localStorage.getItem(this.key) || "[]");
    //     // ✅ Rehidrata antes de entregar los datos
    //     return lista.map(ciudad => {
    //         if (ciudad.miMapa?.matriz) {
    //             ciudad.miMapa.matriz = rehidratarMatriz(ciudad.miMapa.matriz);
    //         }
    //         return ciudad;
    //     });
    // },

    load() {
        const lista = JSON.parse(localStorage.getItem(this.key) || "[]");
        return lista.map(ciudad => {
            if (!ciudad.duracionTurnoSeg) {
                ciudad.duracionTurnoSeg = 300; // Si la ciudad no tiene duracionTurnoSeg, asignamos el valor por defecto, especialmente con las ciudades que antes no tenian este atributo
            }
            if (ciudad.miMapa?.matriz) {
                ciudad.miMapa.matriz = rehidratarMatriz(ciudad.miMapa.matriz); // ← intacto
            }
            if (ciudad.misEdificios) {
                ciudad.misEdificios = rehidratarEdificios(ciudad.misEdificios); // ← solo esto se agrega
            }
            // 4. Rehidratar ciudadanos (NUEVO, pero con try-catch)
            if (ciudad.misCiudadanos) {
                try {
                    ciudad.misCiudadanos = rehidratarCiudadanos(ciudad.misCiudadanos);
                } catch (error) {
                    console.error(`Error al rehidratar ciudadanos de ciudad ${ciudad.id}:`, error);
                    // No hacemos nada, dejamos los ciudadanos como estaban (objetos planos)
                }
            }
            return ciudad;
        });
    },

    getListaCiudades() {
        return this.load().map(ciudad => ({
            id: ciudad.id,
            nombre: ciudad.nombre
        }));
    },

    save(lista) {
        localStorage.setItem(this.key, JSON.stringify(lista));
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};

export default StorageCiudad;
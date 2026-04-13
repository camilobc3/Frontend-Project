import { rehidratarEdificios, rehidratarMatriz } from "../acceso_datos/ReconstuirObjetosMapa.js";

const StorageCiudad = {
    key: "ciudades_v1",
    rankingKey: "ranking_v1",



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

    loadRanking() {
        const raw = localStorage.getItem(this.rankingKey);
        if (!raw) return [];

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed.ranking) ? parsed.ranking : [];
        } catch {
            return [];
        }
    },

    saveRanking(rankingItems) {
        localStorage.setItem(this.rankingKey, JSON.stringify({ ranking: rankingItems }));
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};

export default StorageCiudad;
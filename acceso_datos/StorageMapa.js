// StorageMapa.js
// Guarda y carga instancias de Mapa en localStorage

const StorageMapa = {
    key: "mapas_v1",

    load() {
        return JSON.parse(localStorage.getItem(this.key) || "[]");
    },

    save(lista) {
        localStorage.setItem(this.key, JSON.stringify(lista));
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};

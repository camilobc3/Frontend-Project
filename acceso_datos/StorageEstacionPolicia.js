// StorageEstacionPolicia.js
// Guarda y carga instancias de EstacionPolicia en localStorage

const StorageEstacionPolicia = {
    key: "estaciones_policia_v1",

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

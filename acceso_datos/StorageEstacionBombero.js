// StorageEstacionBombero.js
// Guarda y carga instancias de EstacionBombero en localStorage

const StorageEstacionBombero = {
    key: "estaciones_bombero_v1",

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

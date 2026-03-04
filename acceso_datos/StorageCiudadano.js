// StorageCiudadano.js
// Guarda y carga instancias de Ciudadano en localStorage

const StorageCiudadano = {
    key: "ciudadanos_v1",

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

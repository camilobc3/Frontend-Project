// StorageGranja.js
// Guarda y carga instancias de Granja en localStorage

const StorageGranja = {
    key: "granjas_v1",

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

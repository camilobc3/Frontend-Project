// StorageAlcalde.js
// Guarda y carga instancias de Alcalde en localStorage

const StorageAlcalde = {
    key: "alcaldes_v1",

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

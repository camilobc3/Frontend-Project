// StorageParque.js
// Guarda y carga instancias de Parque en localStorage

const StorageParque = {
    key: "parques_v1",

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

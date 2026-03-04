// StorageCamino.js
// Guarda y carga instancias de Camino en localStorage

const StorageCamino = {
    key: "caminos_v1",

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

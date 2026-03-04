// StorageFabrica.js
// Guarda y carga instancias de Fabrica en localStorage

const StorageFabrica = {
    key: "fabricas_v1",

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

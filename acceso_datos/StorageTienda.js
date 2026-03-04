// StorageTienda.js
// Guarda y carga instancias de Tienda en localStorage

const StorageTienda = {
    key: "tiendas_v1",

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

// StorageCentroComercial.js
// Guarda y carga instancias de CentroComercial en localStorage

const StorageCentroComercial = {
    key: "centros_comerciales_v1",

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

// StorageContrato.js
// Guarda y carga instancias de Contrato en localStorage

const StorageContrato = {
    key: "contratos_v1",

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

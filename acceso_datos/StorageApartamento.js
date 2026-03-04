// StorageApartamento.js
// Guarda y carga instancias de Apartamento en localStorage

const StorageApartamento = {
    key: "apartamentos_v1",

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

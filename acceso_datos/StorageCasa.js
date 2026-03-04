// StorageCasa.js
// Guarda y carga instancias de Casa en localStorage

const StorageCasa = {
    key: "casas_v1",

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

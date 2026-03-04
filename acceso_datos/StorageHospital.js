// StorageHospital.js
// Guarda y carga instancias de Hospital en localStorage

const StorageHospital = {
    key: "hospitales_v1",

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

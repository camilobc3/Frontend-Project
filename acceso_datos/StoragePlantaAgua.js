// StoragePlantaAgua.js
// Guarda y carga instancias de PlantaAgua en localStorage

const StoragePlantaAgua = {
    key: "plantas_agua_v1",

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

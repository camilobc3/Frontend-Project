// StoragePlantaElectrica.js
// Guarda y carga instancias de PlantaElectrica en localStorage

const StoragePlantaElectrica = {
    key: "plantas_electricas_v1",

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

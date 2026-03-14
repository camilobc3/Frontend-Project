import PlantaAgua from "../modelos/PlantaAgua.js";
class PlantaAguaService {

    //cargarPlantasAgua();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarPlantasAgua() {
        const lista = StoragePlantaAgua.load();
        console.log("Plantas de agua cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarPlantaAgua(indice) {
        const lista = StoragePlantaAgua.load();
        const planta = lista[indice];
        console.log("Planta de agua encontrada:", planta);
        return planta || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearPlantaAgua(costo) {
        const lista = StoragePlantaAgua.load();
        const nuevaPlanta = new PlantaAgua(costo);
        lista.push(nuevaPlanta);
        StoragePlantaAgua.save(lista);
        console.log("Planta de agua creada:", nuevaPlanta);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarPlantaAgua(indice, costo) {
        const lista = StoragePlantaAgua.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo };
        StoragePlantaAgua.save(lista);
        console.log("Planta de agua actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarPlantaAgua(indice) {
        const lista = StoragePlantaAgua.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StoragePlantaAgua.save(lista);
        console.log("Planta de agua eliminada:", eliminada[0]);
        return true;
    }
};

export default PlantaAguaService;
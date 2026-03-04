document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - PlantaAguaService");

    cargarPlantasAgua();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarPlantasAgua() {
        const lista = StoragePlantaAgua.load();
        console.log("Plantas de agua cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarPlantaAgua(indice) {
        const lista = StoragePlantaAgua.load();
        const planta = lista[indice];
        console.log("Planta de agua encontrada:", planta);
        return planta || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearPlantaAgua(costo) {
        const lista = StoragePlantaAgua.load();
        const nuevaPlanta = new PlantaAgua(costo);
        lista.push(nuevaPlanta);
        StoragePlantaAgua.save(lista);
        console.log("Planta de agua creada:", nuevaPlanta);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarPlantaAgua(indice, costo) {
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
    function eliminarPlantaAgua(indice) {
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
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - PlantaElectricaService");

    cargarPlantasElectricas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarPlantasElectricas() {
        const lista = StoragePlantaElectrica.load();
        console.log("Plantas eléctricas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarPlantaElectrica(indice) {
        const lista = StoragePlantaElectrica.load();
        const planta = lista[indice];
        console.log("Planta eléctrica encontrada:", planta);
        return planta || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearPlantaElectrica(costo) {
        const lista = StoragePlantaElectrica.load();
        const nuevaPlanta = new PlantaElectrica(costo);
        lista.push(nuevaPlanta);
        StoragePlantaElectrica.save(lista);
        console.log("Planta eléctrica creada:", nuevaPlanta);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarPlantaElectrica(indice, costo) {
        const lista = StoragePlantaElectrica.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo };
        StoragePlantaElectrica.save(lista);
        console.log("Planta eléctrica actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarPlantaElectrica(indice) {
        const lista = StoragePlantaElectrica.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StoragePlantaElectrica.save(lista);
        console.log("Planta eléctrica eliminada:", eliminada[0]);
        return true;
    }
});

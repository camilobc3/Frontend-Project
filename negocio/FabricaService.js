document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - FabricaService");

    cargarFabricas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarFabricas() {
        const lista = StorageFabrica.load();
        console.log("Fábricas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarFabrica(indice) {
        const lista = StorageFabrica.load();
        const fabrica = lista[indice];
        console.log("Fábrica encontrada:", fabrica);
        return fabrica || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearFabrica(costo, numeroEmpleos) {
        const lista = StorageFabrica.load();
        const nuevaFabrica = new Fabrica(costo, numeroEmpleos);
        lista.push(nuevaFabrica);
        StorageFabrica.save(lista);
        console.log("Fábrica creada:", nuevaFabrica);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarFabrica(indice, costo, numeroEmpleos) {
        const lista = StorageFabrica.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, numeroEmpleos };
        StorageFabrica.save(lista);
        console.log("Fábrica actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarFabrica(indice) {
        const lista = StorageFabrica.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StorageFabrica.save(lista);
        console.log("Fábrica eliminada:", eliminada[0]);
        return true;
    }

    // Esta funcón verifica si una fabrica tiene capacidad disponible para nuevos contratos(Empleos), comparando la cantidad de contratos actuales con la capacidad máxima de la vivienda.
    function empleoDisponibleFabrica(fabrica) {
        if(fabrica.misContratos.length === fabrica.numeroEmpleos){
            return false;
        } else {
            return true;
        }
    }
});

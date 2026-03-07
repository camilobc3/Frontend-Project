document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - GranjaService");

    cargarGranjas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarGranjas() {
        const lista = StorageGranja.load();
        console.log("Granjas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarGranja(indice) {
        const lista = StorageGranja.load();
        const granja = lista[indice];
        console.log("Granja encontrada:", granja);
        return granja || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearGranja(costo, numeroEmpleos) {
        const lista = StorageGranja.load();
        const nuevaGranja = new Granja(costo, numeroEmpleos);
        lista.push(nuevaGranja);
        StorageGranja.save(lista);
        console.log("Granja creada:", nuevaGranja);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarGranja(indice, costo, numeroEmpleos) {
        const lista = StorageGranja.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, numeroEmpleos };
        StorageGranja.save(lista);
        console.log("Granja actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarGranja(indice) {
        const lista = StorageGranja.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StorageGranja.save(lista);
        console.log("Granja eliminada:", eliminada[0]);
        return true;
    }

    // Esta funcón verifica si una granja tiene capacidad disponible para nuevos contratos(Empleos), comparando la cantidad de contratos actuales con la capacidad máxima de la vivienda.
    function empleoDisponibleGranja(granja) {
        if(granja.misContratos.length <= granja.numeroEmpleos){
            return true;
        } else {
            return false;
        }
    }
});

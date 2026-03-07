document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - TiendaService");

    cargarTiendas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarTiendas() {
        const lista = StorageTienda.load();
        console.log("Tiendas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarTienda(indice) {
        const lista = StorageTienda.load();
        const tienda = lista[indice];
        console.log("Tienda encontrada:", tienda);
        return tienda || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearTienda(costo, numeroEmpleos) {
        const lista = StorageTienda.load();
        const nuevaTienda = new Tienda(costo, numeroEmpleos);
        lista.push(nuevaTienda);
        StorageTienda.save(lista);
        console.log("Tienda creada:", nuevaTienda);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarTienda(indice, costo, numeroEmpleos) {
        const lista = StorageTienda.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, numeroEmpleos };
        StorageTienda.save(lista);
        console.log("Tienda actualizada:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarTienda(indice) {
        const lista = StorageTienda.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminada = lista.splice(indice, 1);
        StorageTienda.save(lista);
        console.log("Tienda eliminada:", eliminada[0]);
        return true;
    }

    // Esta funcón verifica si una tienda tiene capacidad disponible para nuevos contratos(Empleos), comparando la cantidad de contratos actuales con la capacidad máxima de la vivienda.
    function empleoDisponibleTienda(tienda) {
        if(tienda.misContratos.length === tienda.numeroEmpleos){
            return false;
        } else {
            return true;
        }
    }
});

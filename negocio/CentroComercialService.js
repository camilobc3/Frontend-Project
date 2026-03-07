document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CentroComercialService");

    cargarCentrosComerciales();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarCentrosComerciales() {
        const lista = StorageCentroComercial.load();
        console.log("Centros comerciales cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarCentroComercial(indice) {
        const lista = StorageCentroComercial.load();
        const centroComercial = lista[indice];
        console.log("Centro comercial encontrado:", centroComercial);
        return centroComercial || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearCentroComercial(costo, numeroEmpleos) {
        const lista = StorageCentroComercial.load();
        const nuevoCentro = new CentroComercial(costo, numeroEmpleos);
        lista.push(nuevoCentro);
        StorageCentroComercial.save(lista);
        console.log("Centro comercial creado:", nuevoCentro);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarCentroComercial(indice, costo, numeroEmpleos) {
        const lista = StorageCentroComercial.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, numeroEmpleos };
        StorageCentroComercial.save(lista);
        console.log("Centro comercial actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarCentroComercial(indice) {
        const lista = StorageCentroComercial.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminado = lista.splice(indice, 1);
        StorageCentroComercial.save(lista);
        console.log("Centro comercial eliminado:", eliminado[0]);
        return true;
    }

    // Esta funcón verifica si una centroComercial tiene capacidad disponible para nuevos contratos(Empleos), comparando la cantidad de contratos actuales con la capacidad máxima de la vivienda.
    function empleoDisponibleCentroComercial(centroComercial) {
        if(centroComercial.misContratos.length <= centroComercial.numeroEmpleos){
            return true;
        } else {
            return false;
        }
    }
});

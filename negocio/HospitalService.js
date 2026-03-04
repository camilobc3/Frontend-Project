document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - HospitalService");

    cargarHospitales();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarHospitales() {
        const lista = StorageHospital.load();
        console.log("Hospitales cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarHospital(indice) {
        const lista = StorageHospital.load();
        const hospital = lista[indice];
        console.log("Hospital encontrado:", hospital);
        return hospital || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearHospital(costo, radio, beneficio) {
        const lista = StorageHospital.load();
        const nuevoHospital = new Hospital(costo, radio, beneficio);
        lista.push(nuevoHospital);
        StorageHospital.save(lista);
        console.log("Hospital creado:", nuevoHospital);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function actualizarHospital(indice, costo, radio, beneficio) {
        const lista = StorageHospital.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        lista[indice] = { ...lista[indice], costo, radio, beneficio };
        StorageHospital.save(lista);
        console.log("Hospital actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    function eliminarHospital(indice) {
        const lista = StorageHospital.load();
        if (indice < 0 || indice >= lista.length) {
            console.warn(`Índice ${indice} fuera de rango`);
            return false;
        }
        const eliminado = lista.splice(indice, 1);
        StorageHospital.save(lista);
        console.log("Hospital eliminado:", eliminado[0]);
        return true;
    }
});

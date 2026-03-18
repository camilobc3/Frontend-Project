import Granja from "../modelos/Granja.js";
class GranjaService{

    //cargarGranjas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarGranjas() {
        const lista = StorageGranja.load();
        console.log("Granjas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarGranja(indice) {
        const lista = StorageGranja.load();
        const granja = lista[indice];
        console.log("Granja encontrada:", granja);
        return granja || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearGranja(costo, numeroEmpleos) {
        const lista = StorageGranja.load();
        const nuevaGranja = new Granja(costo, numeroEmpleos);
        lista.push(nuevaGranja);
        StorageGranja.save(lista);
        console.log("Granja creada:", nuevaGranja);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarGranja(indice, costo, numeroEmpleos) {
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
    eliminarGranja(indice) {
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
    empleoDisponibleGranja(granja) {
        if(granja.misContratos.length === granja.numeroEmpleos){
            return false;
        } else {
            return true;
        }
    }

    // Calcula cuántos empleos disponibles quedan en la granja
    numeroContratosDisponibles(granja) {
        return granja.numeroEmpleos - granja.misContratos.length;
    }

    // Obtiene los empleados actuales en la granja
    empleadosEnGranja(granja) {
        if (!granja || !granja.misContratos || !Array.isArray(granja.misContratos)) {
            return [];
        }
        return granja.misContratos.map(c => c.miCiudadano).filter(c => c !== null && c !== undefined);
    }
};

export default GranjaService;
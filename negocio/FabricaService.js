import Fabrica from "../modelos/Fabrica.js";
class FabricaService {

    //cargarFabricas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarFabricas() {
        const lista = StorageFabrica.load();
        console.log("Fábricas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarFabrica(indice) {
        const lista = StorageFabrica.load();
        const fabrica = lista[indice];
        console.log("Fábrica encontrada:", fabrica);
        return fabrica || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearFabrica(costo, numeroEmpleos) {
        const lista = StorageFabrica.load();
        const nuevaFabrica = new Fabrica(costo, numeroEmpleos);
        lista.push(nuevaFabrica);
        StorageFabrica.save(lista);
        console.log("Fábrica creada:", nuevaFabrica);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarFabrica(indice, costo, numeroEmpleos) {
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
    eliminarFabrica(indice) {
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
    empleoDisponibleFabrica(fabrica) {
        if(fabrica.misContratos.length === fabrica.numeroEmpleos){
            return false;
        } else {
            return true;
        }
    }

    // Calcula cuántos empleos disponibles quedan en la fábrica
    numeroContratosDisponibles(fabrica) {
        return fabrica.numeroEmpleos - fabrica.misContratos.length;
    }

    // Obtiene los empleados actuales en la fábrica
    empleadosEnFabrica(fabrica) {
        if (!fabrica || !fabrica.misContratos || !Array.isArray(fabrica.misContratos)) {
            return [];
        }
        return fabrica.misContratos.map(c => c.miCiudadano).filter(c => c !== null && c !== undefined);
    }
};

export default FabricaService;
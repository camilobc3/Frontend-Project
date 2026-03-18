import Tienda from "../modelos/Tienda.js";
class TiendaService {

    //cargarTiendas();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarTiendas() {
        const lista = StorageTienda.load();
        console.log("Tiendas cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarTienda(indice) {
        const lista = StorageTienda.load();
        const tienda = lista[indice];
        console.log("Tienda encontrada:", tienda);
        return tienda || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearTienda(costo, numeroEmpleos) {
        const lista = StorageTienda.load();
        const nuevaTienda = new Tienda(costo, numeroEmpleos);
        lista.push(nuevaTienda);
        StorageTienda.save(lista);
        console.log("Tienda creada:", nuevaTienda);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarTienda(indice, costo, numeroEmpleos) {
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
    eliminarTienda(indice) {
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
    empleoDisponibleTienda(tienda) {
        if(tienda.misContratos.length === tienda.numeroEmpleos){
            return false;
        } else {
            return true;
        }
    }

    // Calcula cuántos empleos disponibles quedan en la tienda
    numeroContratosDisponibles(tienda) {
        return tienda.numeroEmpleos - tienda.misContratos.length;
    }

    // Obtiene los empleados actuales en la tienda
    empleadosEnTienda(tienda) {
        if (!tienda || !tienda.misContratos || !Array.isArray(tienda.misContratos)) {
            return [];
        }
        return tienda.misContratos.map(c => c.miCiudadano).filter(c => c !== null && c !== undefined);
    }
};

export default TiendaService;
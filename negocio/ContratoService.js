import Contrato from "../modelos/Contrato.js";
class ContratoService {

    //cargarContratos();

    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarContratos() {
        const lista = StorageContrato.load();
        console.log("Contratos cargados:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarContrato(id) {
        const lista = StorageContrato.load();
        const contrato = lista.find(c => c.id === id);
        console.log("Contrato encontrado:", contrato);
        return contrato || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearContrato(id, miCiudadano = null, miEdificio = null) {
        const lista = StorageContrato.load();
        const existe = lista.some(c => c.id === id);
        if (existe) {
            console.warn(`Ya existe un contrato con id ${id}`);
            return false;
        }
        const nuevoContrato = new Contrato(id, miCiudadano, miEdificio);
        lista.push(nuevoContrato);
        StorageContrato.save(lista);
        console.log("Contrato creado:", nuevoContrato);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarContrato(id, miCiudadano, miEdificio) {
        const lista = StorageContrato.load();
        const indice = lista.findIndex(c => c.id === id);
        if (indice === -1) {
            console.warn(`No se encontró contrato con id ${id}`);
            return false;
        }
        lista[indice] = { ...lista[indice], miCiudadano, miEdificio };
        StorageContrato.save(lista);
        console.log("Contrato actualizado:", lista[indice]);
        return true;
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarContrato(id) {
        const lista = StorageContrato.load();
        const nuevaLista = lista.filter(c => c.id !== id);
        if (nuevaLista.length === lista.length) {
            console.warn(`No se encontró contrato con id ${id}`);
            return false;
        }
        StorageContrato.save(nuevaLista);
        console.log(`Contrato con id ${id} eliminado`);
        return true;
    }
};

export default ContratoService;
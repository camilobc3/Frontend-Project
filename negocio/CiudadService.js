//Importaciones
import { //Importacion de modelos
    Edificio,
    EdificioResidencial,
    EdificioComercial,
    EdificioIndustrial,
    EdificioServicio,
    PlantaUtilidad,
    Fabrica,
    Granja,
    Hospital,
    PlantaElectrica,
    PlantaAgua
} from "../modelos/index.js";

import {
    noticiasRepository,
    StorageAlcalde,
    StorageCiudad
} from "../acceso_datos/index.js";

import {calcularFelicidad} from "./CiudadanoService.js";
import {capacidadDisponibleCasa} from "./CasaService.js";
import {capacidadDisponibleApartamento} from "./ApartamentoService.js";
import {empleoDisponibleTienda} from "./TiendaService.js";
import {empleoDisponibleCentroComercial} from "./CentroComercialService.js";
import {empleoDisponibleFabrica} from "./FabricaService.js";
import {empleoDisponibleGranja} from "./GranjaService.js";
import {verificarContratoComercial} from "./CiudadanoService.js";
import {verificarContratoVivienda} from "./CiudadanoService.js";


class CiudadService{
    //OJO Revisar esta funcion
    //cargarCiudades();



    // ─── READ ALL ────────────────────────────────────────────────────────────
    cargarCiudades() {
        const lista = StorageCiudad.load();
        console.log("Ciudades cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    cargarCiudad(id) {
        const lista = StorageCiudad.load();
        const ciudad = lista.find(c => c.id === id);
        console.log("Ciudad encontrada:", ciudad);
        return ciudad || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    crearCiudad(id, nombre, turno, miMapa = null) {
        const lista = StorageCiudad.load();
        const existe = lista.some(c => c.id === id);
        if (existe) {
            console.warn(`Ya existe una ciudad con id ${id}`);
            return false;
        }
        const nuevaCiudad = new Ciudad(id, nombre, turno, miMapa);
        lista.push(nuevaCiudad);
        StorageCiudad.save(lista);
        console.log("Ciudad creada:", nuevaCiudad);
        return true;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    actualizarCiudad(id, nombre, turno) {
        const lista = StorageCiudad.load();
        const indice = lista.findIndex(c => c.id === id);
        if (indice === -1) {
            console.warn(`No se encontró ciudad con id ${id}`);
            return false;
        }
        lista[indice] = { ...lista[indice], nombre, turno };
        StorageCiudad.save(lista);
        console.log("Ciudad actualizada:", lista[indice]);
        return true;
    }

    actualizarCiudadCompleta(ciudad){ //Funcion para actualizar ciudad recibiendo el objeto
        const lista = StorageCiudad.load();
        const indice = lista.findIndex(c => c.id === ciudad.id);
        if (indice === -1) {
            console.warn(`No se encontró ciudad con id ${ciudad.id}`);
            return false;
        }
        lista[indice] = ciudad;
        StorageCiudad.save(lista);
        console.log("Ciudad actualizada:", lista[indice]);
        return true;
    }


    // ─── DELETE ──────────────────────────────────────────────────────────────
    eliminarCiudad(id) {
        const lista = StorageCiudad.load();
        const nuevaLista = lista.filter(c => c.id !== id);
        if (nuevaLista.length === lista.length) {
            console.warn(`No se encontró ciudad con id ${id}`);
            return false;
        }
        StorageCiudad.save(nuevaLista);
        console.log(`Ciudad con id ${id} eliminada`);
        return true;
    }

    //Lista de hospitales
    listaHospitales(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Hospital);
    }

    //Lista de parques 
    listaParques(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Parque);
    }

    //Lista de estaciones de policia
    listaEstacionesPolicia(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionPolicia);
    }

    //Lista de estaciones de bomberos
    listaEstacionesBomberos(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionBombero);
    }

    //Lista de casas
    listaCasas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Casa);
    }

    //Lista de apartamentos
    listaApartamentos(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Apartamento);
    }

    //Lista de tiendas
    listaTiendas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Tienda);
    }

    //Lista de centros comerciales
    listaFabricas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof CentroComercial);
    }

    //Lista de fabricas
    listaFabricas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Fabrica);
    }

    //Lista de granjas
    listaGranjas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Granja);
    }

    //Promedio de felicidad de la ciudad, calculado a partir de la felicidad de cada ciudadano
    promedioFelicidadCiudad(ciudad) {
        let promedioFelicidad = 0;
        
        if (ciudad.misCiudadanos.length > 0) { 
            for (let ciudadano of ciudad.misCiudadanos) {
                promedioFelicidad += (CiudadanoService.calcularFelicidad(ciudadano));
            }
            return (promedioFelicidad / ciudad.misCiudadanos.length);
        } else {
            return 0;
        }
    }

    //Creación automatica de ciudadanos si hay viviendas disponibles, empleos disponibles y verificando la felicidad promedio
    crearCiudadanosAutomaticamente(ciudad) {
        if(promedioFelicidadCiudad(ciudad)>60 && edificioDisponible(listaCasas(ciudad), capacidadDisponibleCasa)
            && edificioDisponible(listaApartamentos(ciudad), capacidadDisponibleApartamento) && edificioDisponible(listaTiendas(ciudad), empleoDisponibleTienda) 
            && edificioDisponible(listaCentrosComerciales(ciudad), empleoDisponibleCentroComercial) && edificioDisponible(listaFabricas(ciudad), empleoDisponibleFabrica) 
            && edificioDisponible(listaGranjas(ciudad), empleoDisponibleGranja)){
                for (let i = 0; i < 4; i++) {
                    const nuevoId = ciudad.misCiudadanos.length + 1
                    let nuevoCiudadano = new Ciudadano(nuevoId,0); // Realizar función para incrementar id´s del ciudadano
                    ciudad.misCiudadanos.push(nuevoCiudadano);
                }
            }
    }

    //Disponibilidad de vivienda

    //Verificar si hay alguna edificio con capacidad disponible para nuevos contratos, comparando .
    edificioDisponible(listaEdificios, funcionVerificacion) {
        return listaEdificios.some(edificio => funcionVerificacion(edificio));
    }

    //Estadisticas de la porblación

    //numero de ciudadanos en la ciudad
    numeroCiudadanos(ciudad) {
        return ciudad.misCiudadanos.length;
    }

    //numero de ciudadanos empleados en la ciudad
    numerociudadanosEmpleados(ciudad) {
        let ciudadanosEmpleados = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            if (verificarContratoComercial(ciudadano)) {
                ciudadanosEmpleados += 1;
            }
        }
        return ciudadanosEmpleados;
    }

    //numero de ciudadanos desempleados en la ciudad
    numeroCiudadanosDesempleados(ciudad) {
        let ciudadanosDesempleados = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            if (verificarContratoComercial(ciudadano) === false) {
                ciudadanosDesempleados += 1;
            }
        }
        return ciudadanosDesempleados;
    }

    //Lista de ciudadanos desempleados en la ciudad
    listaCiudadanosDesempleados(ciudad) {
        let ciudadanosEmpleados = [];
        for (let ciudadano of ciudad.misCiudadanos) {
            if (verificarContratoComercial(ciudadano) === false) {
                ciudadanosEmpleados.push(ciudadano);
            }
        }
        return ciudadanosEmpleados;
    }

    //Lista de ciudadanos sin vivienda en la ciudad
    listaCiudadanosSinVivienda(ciudad) {
        let ciudadanosSinVivienda = [];
        for (let ciudadano of ciudad.misCiudadanos) {
            if (verificarContratoVivienda(ciudadano) === false) {
                ciudadanosSinVivienda.push(ciudadano);
            }
        }
        return ciudadanosSinVivienda;
    }

    //Retorna el primer edificio comercial/industrial con empleo disponible, o null si no hay ninguno
    obtenerEdificioConEmpleoDisponible(ciudad) {
        for (let edificio of ciudad.misEdificios) {
            if (edificio instanceof Tienda && empleoDisponibleTienda(edificio)) return edificio;
            if (edificio instanceof CentroComercial && empleoDisponibleCentroComercial(edificio)) return edificio;
            if (edificio instanceof Fabrica && empleoDisponibleFabrica(edificio)) return edificio;
            if (edificio instanceof Granja && empleoDisponibleGranja(edificio)) return edificio;
        }
        return null;
    }

    agregarCiudadanosATrabajosDisponibles(ciudad) {
        const ciudadanosDesempleados = listaCiudadanosDesempleados(ciudad);
                    /* Recorre todos los edificios de la ciudad y suma el total de contratos existentes en todos ellos, para usarlo como punto de partida para los nuevos IDs de contrato.

            Desglosado:

            .reduce((acc, e) => ..., 0) — acumulador que empieza en 0 e itera sobre cada edificio e.
            e.misContratos ? e.misContratos.length : 0 — si el edificio tiene el array misContratos, suma su cantidad; si no existe, suma 0 (evita errores).
            El resultado es el conteo total de contratos ya creados, que se usa como base para generar IDs únicos (contratoId++ antes de cada nuevo contrato).
            Ejemplo: si hay 3 edificios con 2, 5 y 3 contratos respectivamente, el resultado es 10, y el próximo contrato tendrá id 11. */
        let contratoId =  ciudad.misEdificios.reduce((acc, e) => acc + (e.misContratos ? e.misContratos.length : 0), 0); // Asumiendo que el ID del contrato es incremental y único, se puede usar la cantidad de ciudadanos como base para generar nuevos IDs de contrato;

        for (let ciudadano of ciudadanosDesempleados) {
            const edificioConEmpleo = obtenerEdificioConEmpleoDisponible(ciudad);
            if (edificioConEmpleo !== null) {
                contratoId++;
                const nuevoContrato = new Contrato(contratoId, ciudadano, edificioConEmpleo);
                ciudadano.misContratos.push(nuevoContrato);
                edificioConEmpleo.misContratos.push(nuevoContrato);
            }
        }
    
    }

    //Retorna la primera vivienda con capacidad disponible, o null si no hay ninguna
    obtenerViviendaConCapacidadDisponible(ciudad) {
        for (let edificio of ciudad.misEdificios) {
            if (edificio instanceof Casa && capacidadDisponibleCasa(edificio)) return edificio;
            if (edificio instanceof Apartamento && capacidadDisponibleApartamento(edificio)) return edificio;
        }
        return null;
    }

    agregarCiudadanosAViviendasDisponibles(ciudad) {
        const ciudadanosSinVivienda = listaCiudadanosSinVivienda(ciudad);
        let contratoId = ciudad.misEdificios.reduce((acc, e) => acc + (e.misContratos ? e.misContratos.length : 0), 0);

        for (let ciudadano of ciudadanosSinVivienda) {
            const viviendaConCapacidad = obtenerViviendaConCapacidadDisponible(ciudad);
            if (viviendaConCapacidad !== null) {
                contratoId++;
                const nuevoContrato = new Contrato(contratoId, ciudadano, viviendaConCapacidad);
                ciudadano.misContratos.push(nuevoContrato);
                viviendaConCapacidad.misContratos.push(nuevoContrato);
            }
        }
        actualizarCiudadCompleta(ciudad);
    }

    calcularPuntuacion(ciudad) {

        // Variables que aportan constantemente a la puntuacion [IMPORTANTE]

        let poblacion = (ciudad.misCiudadanos.length * 10);
        let dinero = (ciudad.dinero/100);
        let edificios = (ciudad.misEdificios.length * 50);
        let electricidad = (ciudad.electricidad * 2);
        let agua = (ciudad.agua * 2);

        let felicidad = promedioFelicidadCiudad(ciudad)

        let puntuacionFinal = poblacion + dinero + edificios + electricidad + agua + felicidad ;

        // Bonus para la puntuacion

        // Ciudadanos empleados

        if (numerociudadanosEmpleados(ciudad) === ciudad.misCiudadanos.length) {
            puntuacionFinal += 500;
        }

        if (felicidad > 80) {
            puntuacionFinal += 300;
        }

        if (ciudad.electricidad > 0 && ciudad.agua > 0) {
            puntuacionFinal += 200;
        }

        if (ciudad.misCiudadanos.length > 1000) {
            puntuacionFinal += 1000
        }

        // Penalizaciones para la puntuacion

        if (ciudad.dinero < 0) {
            puntuacionFinal -= 500
        }

        if (ciudad.electricidad < 0) {
            puntuacionFinal -= 300
        }

        if (ciudad.agua < 0) {
            puntuacionFinal -= 300
        }

        if (felicidad < 40) {
            puntuacionFinal -= 400
        }

        // Restar por ciudadano desempleado

        puntuacionFinal -= (numeroCiudadanosDesempleados(ciudad) * 10)

        return puntuacionFinal

    }

    //Funcion para actualizar los recursos por turno segun el tipo de edificio
    actualizarRecursoXTurno(ciudad, edificio){ //Esta funcion se debe usar junto a la funcion de agregar edificio a una ciudad para actualizar los parametros de la ciudad segun el edificio agregado
        if (edificio instanceof EdificioResidencial){
            ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            ciudad.aguaXTurno -= edificio.consumoAgua();
        }
        else if (edificio instanceof EdificioComercial){
            ciudad.ingresosXTurno += edificio.produccionXTurno();
            ciudad.electricidadXTurno -= edificio.consumoElectricidad();
        }
        else if (edificio instanceof EdificioIndustrial){
            if (edificio instanceof Fabrica){
                ciudad.ingresosXTurno += edificio.produccionXTurno();
                ciudad.electricidadXTurno -= edificio.consumoElectricidad();
                ciudad.aguaXTurno -= edificio.consumoAgua();
            }
            else{ //Si no es fabrica, es Granja
                ciudad.alimentoXTurno += edificio.produccionXTurno();
                ciudad.aguaXTurno -= edificio.consumoAgua();
            }
        }
        else if (edificio instanceof EdificioServicio){
            ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            if (edificio instanceof Hospital){
                ciudad.aguaXTurno -= edificio.consumoAgua();
            }
        }
        else if (edificio instanceof PlantaUtilidad){
            if (edificio instanceof PlantaElectrica){
                ciudad.electricidadXTurno += edificio.produccionXTurno();
            }
            else{ //Si no es planta electrica, es planta de agua
                ciudad.aguaXTurno += edificio.produccionXTurno();
                ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            }
        }
        actualizarCiudadCompleta(ciudad);
    }
    
};

export default CiudadService;

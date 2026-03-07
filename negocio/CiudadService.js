//Importaciones
import {calcularFelicidad} from "./CiudadanoService.js";
import {capacidadDisponibleCasa} from "./CasaService.js";
import {capacidadDisponibleApartamento} from "./ApartamentoService.js";
import {empleoDisponibleTienda} from "./TiendaService.js";
import {empleoDisponibleCentroComercial} from "./CentroComercialService.js";
import {empleoDisponibleFabrica} from "./FabricaService.js";
import {empleoDisponibleGranja} from "./GranjaService.js";
import {verificarContratoComercial} from "./CiudadanoService.js";

document.addEventListener("DOMContentLoaded", function () {
    
    console.log("DOM cargado - CiudadService");

    cargarCiudades();



    // ─── READ ALL ────────────────────────────────────────────────────────────
    function cargarCiudades() {
        const lista = StorageCiudad.load();
        console.log("Ciudades cargadas:", lista);
        return lista;
    }

    // ─── READ ONE ────────────────────────────────────────────────────────────
    function cargarCiudad(id) {
        const lista = StorageCiudad.load();
        const ciudad = lista.find(c => c.id === id);
        console.log("Ciudad encontrada:", ciudad);
        return ciudad || null;
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────
    function crearCiudad(id, nombre, turno, miMapa = null) {
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
    function actualizarCiudad(id, nombre, turno) {
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

    function actualizarCiudadCompleta(ciudad){ //Funcion para actualizar ciudad recibiendo el objeto
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
    function eliminarCiudad(id) {
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
    function listaHospitales(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Hospital);
    }

    //Lista de parques 
    function listaParques(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Parque);
    }

    //Lista de estaciones de policia
    function listaEstacionesPolicia(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionPolicia);
    }

    //Lista de estaciones de bomberos
    function listaEstacionesBomberos(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionBombero);
    }

    //Lista de casas
    function listaCasas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Casa);
    }

    //Lista de apartamentos
    function listaApartamentos(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Apartamento);
    }

    //Lista de tiendas
    function listaTiendas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Tienda);
    }

    //Lista de centros comerciales
    function listaFabricas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof CentroComercial);
    }

    //Lista de fabricas
    function listaFabricas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Fabrica);
    }

    //Lista de granjas
    function listaGranjas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Granja);
    }

    //Promedio de felicidad de la ciudad, calculado a partir de la felicidad de cada ciudadano
    function promedioFelicidadCiudad(ciudad) {
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
    function crearCiudadanosAutomaticamente(ciudad) {
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
    function edificioDisponible(listaEdificios, funcionVerificacion) {
        return listaEdificios.some(edificio => funcionVerificacion(edificio));
    }

    //Estadisticas de la porblación

    //numero de ciudadanos en la ciudad
    function numeroCiudadanos(ciudad) {
        return ciudad.misCiudadanos.length;
    }

    //numero de ciudadanos empleados en la ciudad
    function numerociudadanosEmpleados(ciudad) {
        let ciudadanosEmpleados = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            if (verificarContratoComercial(ciudadano)) {
                ciudadanosEmpleados += 1;
            }
        }
        return ciudadanosEmpleados;
    }

    //numero de ciudadanos desempleados en la ciudad
    function numeroCiudadanosDesempleados(ciudad) {
        let ciudadanosDesempleados = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            if (verificarContratoComercial(ciudadano) === false) {
                ciudadanosDesempleados += 1;
            }
        }
        return ciudadanosDesempleados;
    }

    function calcularPuntuacion(ciudad) {

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
    function actualizarRecursoXTurno(ciudad, edificio){ //Esta funcion se debe usar junto a la funcion de agregar edificio a una ciudad para actualizar los parametros de la ciudad segun el edificio agregado
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



    window.crearCiudad = crearCiudad;
    window.cargarCiudad = cargarCiudad;
    window.actualizarCiudadCompleta = actualizarCiudadCompleta;

    
});

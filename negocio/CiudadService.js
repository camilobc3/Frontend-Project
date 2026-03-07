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

    function calcularPuntuacion(ciudad) {

        // Variables que aportan constantemente a la puntuacion [IMPORTANTE]

        let poblacion = (ciudad.misCiudadanos.length * 10);
        let dinero = (ciudad.dinero/100);
        let edificios = (ciudad.misEdificios.length * 50);
        let electricidad = (ciudad.electricidad * 2);
        let agua = (ciudad.agua * 2);

        let promedioFelicidad = 0;
        
        if (ciudad.misCiudadanos.length > 0) { 
            for (let ciudadano of ciudad.misCiudadanos) {
                promedioFelicidad += (CiudadanoService.calcularFelicidad(ciudadano));
            }
        }

        let felicidad = ((promedioFelicidad / ciudad.misCiudadanos.length) * 5);

        let puntuacionFinal = poblacion + dinero + edificios + electricidad + agua + felicidad ;

        // Bonus para la puntuacion

        // Ciudadanos empleados

        let ciudadanosEmpleados = 0;

        if (ciudad.misCiudadanos.length > 0) {
            for (let ciudadano of ciudad.misCiudadanos) {
                if (verificarContratoComercial(ciudadano)) {
                    ciudadanosEmpleados += 1;
                } 
            }

            if (ciudadanosEmpleados === mciudad.misCiudadanos.length) {
                puntuacionFinak += 500;
            }
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

        if (ciudad.misCiudadanos.length > 0) {
            for (let ciudadano of ciudad.misCiudadanos) {
                if (!verificarContratoComercial(ciudadano)) {
                    puntuacionFinal -= 10
                } 
            }
        }

        return puntuacionFinal

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
        if(promedioFelicidadCiudad(ciudad)>60 && CasaService.capacidadDisponibleCasa(ciudad) 
            && ApartamentoService.capacidadDisponibleApartamento(ciudad) && TiendaService.empleoDisponibleTienda(ciudad) 
            && CentroComercialService.empleoDisponibleCentroComercial(ciudad) && FabricaService.empleoDisponibleFabrica(ciudad) 
            && GranjaService.empleoDisponibleGranja(ciudad)){
                for (let i = 0; i < 4; i++) {
                    const nuevoId = ciudad.misCiudadanos.length + 1
                    let nuevoCiudadano = new Ciudadano(nuevoId,0); // Realizar función para incrementar id´s del ciudadano
                    ciudad.misCiudadanos.push(nuevoCiudadano);
                }
            }
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
    

    window.crearCiudad = crearCiudad;
    window.cargarCiudad = cargarCiudad;
    window.actualizarCiudadCompleta = actualizarCiudadCompleta;

    
});

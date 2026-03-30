// Importaciones de modelos
import {
    Ciudad,
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
    PlantaAgua,
    Casa,
    Apartamento,
    EstacionBombero,
    Camino,
    Tienda,
    CentroComercial,
    Parque,
    Ciudadano,
    Contrato
} from "../modelos/index.js";



import {
    noticiasRepository,
    StorageAlcalde,
    StorageCiudad
} from "../acceso_datos/index.js";

import { MapaService } from "./index.js";
import CiudadanoService from "./CiudadanoService.js";
import CasaService from "./CasaService.js";
import ApartamentoService from "./ApartamentoService.js";
import TiendaService from "./TiendaService.js";
import CentroComercialService from "./CentroComercialService.js";
import FabricaService from "./FabricaService.js";
import GranjaService from "./GranjaService.js";

// ✅ Las instancias se crean en el constructor (inyección de dependencias)

class CiudadService {
    constructor() {
    }


    asignacionId() {
        const lista = StorageCiudad.getListaCiudades();
        
        let i = 0;

        while (true) {
            i++;
            if (!lista.some(ciudad => ciudad.id === i)) {
                return i;
            }
        }
    }

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

    actualizarCiudadCompleta(ciudad) {
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

    // ─── LISTAS DE EDIFICIOS ─────────────────────────────────────────────────

    listaEstacionesPolicia(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionPolicia);
    }


    listaCasas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Casa);
    }

    listaApartamentos(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Apartamento);
    }

    listaTiendas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Tienda);
    }

    listaCentrosComerciales(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof CentroComercial);
    }

    listaFabricas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Fabrica);
    }

    listaGranjas(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Granja);
    }

    // ─── ESTADÍSTICAS ────────────────────────────────────────────────────────

    // ✅ ciudadanoService se recibe como parámetro — no se importa ni instancia aquí
    promedioFelicidadCiudad(ciudad) {
            const ciudadanoService = new CiudadanoService();
        if (ciudad.misCiudadanos.length === 0) return 100;

        let total = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            total += ciudadanoService.calcularFelicidad(ciudadano, ciudad);
        }
        let promedio = total / ciudad.misCiudadanos.length;
        return (promedio).toFixed(2);
    }

    numeroCiudadanos(ciudad) {
        return ciudad.misCiudadanos.length;
    }

    // ✅ ciudadanoService se recibe como parámetro
    listaCiudadanosDesempleados(ciudad, ciudadanoService) {
        return ciudad.misCiudadanos.filter(
            c => !ciudadanoService.verificarContratoComercial(c, ciudad)
        );
    }

    actualizarFelicidadCiudadanos(ciudad){
        const ciudadanoService = new CiudadanoService();
        for (let ciudadano of ciudad.misCiudadanos) {
            ciudadano.nivelFelicidad= ciudadanoService.calcularFelicidad(ciudadano, ciudad);
        }
    }
    


    // ─── DISPONIBILIDAD ──────────────────────────────────────────────────────

    edificioDisponible(listaEdificios, funcionVerificacion) {
        return listaEdificios.some(edificio => funcionVerificacion(edificio));
    }

    crearCiudadanosAutomaticamente(ciudad) {
        const TASA_CRECIMIENTO = 3; // parametrizable: entre 1 y 3

        const casaService = new CasaService();
        const apartamentoService = new ApartamentoService();
        const tiendaService = new TiendaService();
        const centroComercialService = new CentroComercialService();
        const fabricaService = new FabricaService();
        const granjaService = new GranjaService();

        const hayVivienda =
            this.edificioDisponible(this.listaCasas(ciudad), e => casaService.capacidadDisponibleCasa(e)) ||
            this.edificioDisponible(this.listaApartamentos(ciudad), e => apartamentoService.capacidadDisponibleApartamento(e));

        const hayEmpleo =
            this.edificioDisponible(this.listaTiendas(ciudad), e => tiendaService.empleoDisponibleTienda(e)) ||
            this.edificioDisponible(this.listaCentrosComerciales(ciudad), e => centroComercialService.empleoDisponibleCentroComercial(e)) ||
            this.edificioDisponible(this.listaFabricas(ciudad), e => fabricaService.empleoDisponibleFabrica(e)) ||
            this.edificioDisponible(this.listaGranjas(ciudad), e => granjaService.empleoDisponibleGranja(e));

        // ✅ Calcular felicidad ANTES de usarla
        const felicidad = this.promedioFelicidadCiudad(ciudad, new CiudadanoService());

        console.log("🏙️ Crear Ciudadanos - Turno:", ciudad.turno, "| Felicidad:", felicidad, "| Vivienda:", hayVivienda, "| Empleo:", hayEmpleo);

        if (felicidad > 60 && hayVivienda && hayEmpleo) {
            console.log(`✅ Condiciones OK - Creando ${TASA_CRECIMIENTO} ciudadanos`);
            for (let i = 0; i < TASA_CRECIMIENTO; i++) {
                const nuevoId = ciudad.misCiudadanos.length + 1;
                const nuevoCiudadano = new Ciudadano(nuevoId, 100);
                ciudad.misCiudadanos.push(nuevoCiudadano);
            }
        } else {
            console.log("❌ Condiciones NO cumplidas. Felicidad:", felicidad, "| Vivienda:", hayVivienda, "| Empleo:", hayEmpleo);
        }
    }

    obtenerEdificioConEmpleoDisponible(ciudad) {
        const tiendaService = new TiendaService();
        const centroComercialService = new CentroComercialService();
        const fabricaService = new FabricaService();
        const granjaService = new GranjaService();
        
        for (let edificio of ciudad.misEdificios) {
            if (edificio instanceof Tienda && tiendaService.empleoDisponibleTienda(edificio)) return edificio;
            if (edificio instanceof CentroComercial && centroComercialService.empleoDisponibleCentroComercial(edificio)) return edificio;
            if (edificio instanceof Fabrica && fabricaService.empleoDisponibleFabrica(edificio)) return edificio;
            if (edificio instanceof Granja && granjaService.empleoDisponibleGranja(edificio)) return edificio;
        }
        return null;
    }

    agregarCiudadanosATrabajosDisponibles(ciudad) {
        const ciudadanoService = new CiudadanoService();
        const ciudadanosDesempleados = this.listaCiudadanosDesempleados(ciudad, ciudadanoService);
        let contratoId = ciudad.misEdificios.reduce((acc, e) => acc + (e.misContratos ? e.misContratos.length : 0), 0);

        for (let ciudadano of ciudadanosDesempleados) {
            const edificio = this.obtenerEdificioConEmpleoDisponible(ciudad);
            if (edificio !== null) {
                contratoId++;
                const nuevoContrato = new Contrato(contratoId, ciudadano.id, edificio.id);
                ciudadano.misContratos.push(nuevoContrato);
                edificio.misContratos.push(nuevoContrato);
            }
        }

        this.actualizarCiudadCompleta(ciudad);
    }

    obtenerViviendaConCapacidadDisponible(ciudad) {
        const casaService = new CasaService();
        const apartamentoService = new ApartamentoService();
        
        for (let edificio of ciudad.misEdificios) {
            if (edificio instanceof Casa && casaService.capacidadDisponibleCasa(edificio)) return edificio;
            if (edificio instanceof Apartamento && apartamentoService.capacidadDisponibleApartamento(edificio)) return edificio;
        }
        return null;
    }

    // En CiudadService.js
    listaCiudadanosSinVivienda(ciudad, ciudadanoService) {
        return ciudad.misCiudadanos.filter(
            c => !ciudadanoService.verificarContratoVivienda(c, ciudad)
        );
    }

    agregarCiudadanosAViviendasDisponibles(ciudad) {
        const ciudadanoService = new CiudadanoService();
        // ✅ Así debe estar — la función es de CiudadService, se llama con this
        const ciudadanosSinVivienda = this.listaCiudadanosSinVivienda(ciudad, ciudadanoService);
        let contratoId = ciudad.misEdificios.reduce((acc, e) => acc + (e.misContratos ? e.misContratos.length : 0), 0);

        for (let ciudadano of ciudadanosSinVivienda) {
            const vivienda = this.obtenerViviendaConCapacidadDisponible(ciudad);
            if (vivienda !== null) {
                contratoId++;
                const nuevoContrato = new Contrato(contratoId, ciudadano.id, vivienda.id);
                ciudadano.misContratos.push(nuevoContrato);
                vivienda.misContratos.push(nuevoContrato);
            }
        }

        this.actualizarCiudadCompleta(ciudad);
    }

    calcularPuntuacion(ciudad) {
        const ciudadanoService = new CiudadanoService();
        // Variables que aportan constantemente a la puntuacion [IMPORTANTE]

        let poblacion = (ciudad.misCiudadanos.length * 10);
        let dinero = (ciudad.dinero/100);
        let edificios = (ciudad.misEdificios.length * 50);
        let electricidad = (ciudad.electricidad * 2);
        let agua = (ciudad.agua * 2);

        let recursos = electricidad + agua;

        let promedioFelicidad = 0;
        
        if (ciudad.misCiudadanos.length > 0) { 
            for (let ciudadano of ciudad.misCiudadanos) {
                promedioFelicidad += ciudadano.felicidad;
            }
        }

        let felicidad = 0;

        if (ciudad.misCiudadanos.length > 0) {
            felicidad = (promedioFelicidad / ciudad.misCiudadanos.length) * 5;
        }

        let puntuacionFinal = poblacion + dinero + edificios + electricidad + agua + felicidad ;

        // Bonus para la puntuacion

        // Ciudadanos empleados

        let ciudadanosEmpleados = 0;

        let bonus = 0;

        if (ciudad.misCiudadanos.length > 0) {
            for (let ciudadano of ciudad.misCiudadanos) {
                if (ciudadanoService.verificarContratoComercial(ciudadano, ciudad)) {
                    ciudadanosEmpleados += 1;
                } 
            }

            if (ciudadanosEmpleados === ciudad.misCiudadanos.length) {
                bonus += 500;
            }
        }

        if (felicidad > 80) {
            bonus += 300;
        }

        if (ciudad.electricidad > 0 && ciudad.agua > 0) {
            bonus += 200;
        }

        if (ciudad.misCiudadanos.length > 1000) {
            bonus += 1000
        }

        // Penalizaciones para la puntuacion

        let penalizaciones = 0;

        if (ciudad.dinero < 0) {
            penalizaciones -= 500
        }

        if (ciudad.electricidad < 0) {
            penalizaciones -= 300
        }

        if (ciudad.agua < 0) {
            penalizaciones -= 300
        }

        if (felicidad < 40) {
            penalizaciones -= 400
        }

        puntuacionFinal += bonus + penalizaciones;

        // Restar por ciudadano desempleado

        if (ciudad.misCiudadanos.length > 0) {
            for (let ciudadano of ciudad.misCiudadanos) {
                if (!ciudadanoService.verificarContratoComercial(ciudadano, ciudad)) {
                    puntuacionFinal -= 10
                } 
            }
        }

        return {
            poblacion,
            edificios,
            recursos,
            felicidad,
            bonus,
            penalizaciones,
            puntuacionFinal
        };

    }

    // ─── RECURSOS POR TURNO ──────────────────────────────────────────────────
    actualizarRecursoXTurno(ciudad, edificio) {
        if (edificio instanceof EdificioResidencial) {
            ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            ciudad.aguaXTurno -= edificio.consumoAgua();
        } else if (edificio instanceof EdificioComercial) {
            ciudad.ingresosXTurno += edificio.produccionXTurno();
            ciudad.electricidadXTurno -= edificio.consumoElectricidad();
        } else if (edificio instanceof EdificioIndustrial) {
            if (edificio instanceof Fabrica) {
                ciudad.ingresosXTurno += edificio.produccionXTurno();
                ciudad.electricidadXTurno -= edificio.consumoElectricidad();
                ciudad.aguaXTurno -= edificio.consumoAgua();
            } else if (edificio instanceof Granja){ // Granja
                ciudad.alimentoXTurno += edificio.produccionAlimento();
                ciudad.aguaXTurno -= edificio.consumoAgua();
            }
        } else if (edificio instanceof EdificioServicio) {
            ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            if (edificio instanceof Hospital) {
                ciudad.aguaXTurno -= edificio.consumoAgua();
            }
        } else if (edificio instanceof PlantaUtilidad) {
            if (edificio instanceof PlantaElectrica) {
                ciudad.electricidadXTurno += edificio.produccionElectricidad();
            } else if (edificio instanceof PlantaAgua){ // PlantaAgua
                ciudad.aguaXTurno += edificio.produccionAgua();
                ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            }
        }
        this.actualizarCiudadCompleta(ciudad); // ✅ usar this.
    }

    asignarMapa(ciudad, matriz) {
        ciudad.miMapa.matriz = matriz;
        this.actualizarCiudadCompleta(ciudad);
        return ciudad;
    }
    
}

export default CiudadService;
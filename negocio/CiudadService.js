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
    Camino
} from "../modelos/index.js";

import {
    noticiasRepository,
    StorageAlcalde,
    StorageCiudad
} from "../acceso_datos/index.js";

import { MapaService } from "./index.js";

// ✅ Las instancias se crean DENTRO de los métodos o se pasan como parámetros
// NO se instancian aquí arriba para evitar el ciclo de importaciones

class CiudadService {

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
    listaHospitales(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Hospital);
    }

    listaParques(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof Parque);
    }

    listaEstacionesPolicia(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionPolicia);
    }

    listaEstacionesBomberos(ciudad) {
        return ciudad.misEdificios.filter(e => e instanceof EstacionBombero);
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
    promedioFelicidadCiudad(ciudad, ciudadanoService) {
        if (ciudad.misCiudadanos.length === 0) return 0;

        let total = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            total += ciudadanoService.calcularFelicidad(ciudadano);
        }
        return total / ciudad.misCiudadanos.length;
    }

    numeroCiudadanos(ciudad) {
        return ciudad.misCiudadanos.length;
    }

    // ✅ ciudadanoService se recibe como parámetro
    numeroCiudadanosEmpleados(ciudad, ciudadanoService) {
        let empleados = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            if (ciudadanoService.verificarContratoComercial(ciudadano)) {
                empleados += 1;
            }
        }
        return empleados;
    }

    // ✅ ciudadanoService se recibe como parámetro
    numeroCiudadanosDesempleados(ciudad, ciudadanoService) {
        let desempleados = 0;
        for (let ciudadano of ciudad.misCiudadanos) {
            if (!ciudadanoService.verificarContratoComercial(ciudadano)) {
                desempleados += 1;
            }
        }
        return desempleados;
    }

    // ✅ ciudadanoService se recibe como parámetro
    listaCiudadanosDesempleados(ciudad, ciudadanoService) {
        return ciudad.misCiudadanos.filter(
            c => !ciudadanoService.verificarContratoComercial(c)
        );
    }

    // ✅ ciudadanoService se recibe como parámetro
    listaCiudadanosSinVivienda(ciudad, ciudadanoService) {
        return ciudad.misCiudadanos.filter(
            c => !ciudadanoService.verificarContratoVivienda(c)
        );
    }

    // ─── DISPONIBILIDAD ──────────────────────────────────────────────────────

    edificioDisponible(listaEdificios, funcionVerificacion) {
        return listaEdificios.some(edificio => funcionVerificacion(edificio));
    }

    // ✅ servicios se reciben como parámetros
    crearCiudadanosAutomaticamente(ciudad, ciudadanoService, casaService, apartamentoService,
        tiendaService, centroComercialService, fabricaService, granjaService) {

        const felicidad = this.promedioFelicidadCiudad(ciudad, ciudadanoService);
        const hayVivienda =
            this.edificioDisponible(this.listaCasas(ciudad), e => casaService.capacidadDisponibleCasa(e)) ||
            this.edificioDisponible(this.listaApartamentos(ciudad), e => apartamentoService.capacidadDisponibleApartamento(e));
        const hayEmpleo =
            this.edificioDisponible(this.listaTiendas(ciudad), e => tiendaService.empleoDisponibleTienda(e)) ||
            this.edificioDisponible(this.listaCentrosComerciales(ciudad), e => centroComercialService.empleoDisponibleCentroComercial(e)) ||
            this.edificioDisponible(this.listaFabricas(ciudad), e => fabricaService.empleoDisponibleFabrica(e)) ||
            this.edificioDisponible(this.listaGranjas(ciudad), e => granjaService.empleoDisponibleGranja(e));

        if (felicidad > 60 && hayVivienda && hayEmpleo) {
            for (let i = 0; i < 4; i++) {
                const nuevoId = ciudad.misCiudadanos.length + 1;
                const nuevoCiudadano = new Ciudadano(nuevoId, 0);
                ciudad.misCiudadanos.push(nuevoCiudadano);
            }
        }
    }

    // ✅ servicios se reciben como parámetros
    obtenerEdificioConEmpleoDisponible(ciudad, tiendaService, centroComercialService, fabricaService, granjaService) {
        for (let edificio of ciudad.misEdificios) {
            if (edificio instanceof Tienda && tiendaService.empleoDisponibleTienda(edificio)) return edificio;
            if (edificio instanceof CentroComercial && centroComercialService.empleoDisponibleCentroComercial(edificio)) return edificio;
            if (edificio instanceof Fabrica && fabricaService.empleoDisponibleFabrica(edificio)) return edificio;
            if (edificio instanceof Granja && granjaService.empleoDisponibleGranja(edificio)) return edificio;
        }
        return null;
    }

    // ✅ servicios se reciben como parámetros
    agregarCiudadanosATrabajosDisponibles(ciudad, ciudadanoService, tiendaService, centroComercialService, fabricaService, granjaService) {
        const ciudadanosDesempleados = this.listaCiudadanosDesempleados(ciudad, ciudadanoService);
        let contratoId = ciudad.misEdificios.reduce((acc, e) => acc + (e.misContratos ? e.misContratos.length : 0), 0);

        for (let ciudadano of ciudadanosDesempleados) {
            const edificio = this.obtenerEdificioConEmpleoDisponible(ciudad, tiendaService, centroComercialService, fabricaService, granjaService);
            if (edificio !== null) {
                contratoId++;
                const nuevoContrato = new Contrato(contratoId, ciudadano, edificio);
                ciudadano.misContratos.push(nuevoContrato);
                edificio.misContratos.push(nuevoContrato);
            }
        }
    }

    obtenerViviendaConCapacidadDisponible(ciudad, casaService, apartamentoService) {
        for (let edificio of ciudad.misEdificios) {
            if (edificio instanceof Casa && casaService.capacidadDisponibleCasa(edificio)) return edificio;
            if (edificio instanceof Apartamento && apartamentoService.capacidadDisponibleApartamento(edificio)) return edificio;
        }
        return null;
    }

    // ✅ servicios se reciben como parámetros
    agregarCiudadanosAViviendasDisponibles(ciudad, ciudadanoService, casaService, apartamentoService) {
        const ciudadanosSinVivienda = this.listaCiudadanosSinVivienda(ciudad, ciudadanoService);
        let contratoId = ciudad.misEdificios.reduce((acc, e) => acc + (e.misContratos ? e.misContratos.length : 0), 0);

        for (let ciudadano of ciudadanosSinVivienda) {
            const vivienda = this.obtenerViviendaConCapacidadDisponible(ciudad, casaService, apartamentoService);
            if (vivienda !== null) {
                contratoId++;
                const nuevoContrato = new Contrato(contratoId, ciudadano, vivienda);
                ciudadano.misContratos.push(nuevoContrato);
                vivienda.misContratos.push(nuevoContrato);
            }
        }
        this.actualizarCiudadCompleta(ciudad); // ✅ usar this.
    }

    // ─── PUNTUACIÓN ──────────────────────────────────────────────────────────

    // ✅ ciudadanoService se recibe como parámetro
    calcularPuntuacion(ciudad, ciudadanoService) {
        const felicidad = this.promedioFelicidadCiudad(ciudad, ciudadanoService);
        const empleados = this.numeroCiudadanosEmpleados(ciudad, ciudadanoService);
        const desempleados = this.numeroCiudadanosDesempleados(ciudad, ciudadanoService);

        let puntuacion =
            ciudad.misCiudadanos.length * 10 +
            ciudad.dinero / 100 +
            ciudad.misEdificios.length * 50 +
            ciudad.electricidad * 2 +
            ciudad.agua * 2 +
            felicidad;

        // Bonus
        if (empleados === ciudad.misCiudadanos.length) puntuacion += 500;
        if (felicidad > 80) puntuacion += 300;
        if (ciudad.electricidad > 0 && ciudad.agua > 0) puntuacion += 200;
        if (ciudad.misCiudadanos.length > 1000) puntuacion += 1000;

        // Penalizaciones
        if (ciudad.dinero < 0) puntuacion -= 500;
        if (ciudad.electricidad < 0) puntuacion -= 300;
        if (ciudad.agua < 0) puntuacion -= 300;
        if (felicidad < 40) puntuacion -= 400;
        puntuacion -= desempleados * 10;

        return puntuacion;
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
            } else { // Granja
                ciudad.alimentoXTurno += edificio.produccionXTurno();
                ciudad.aguaXTurno -= edificio.consumoAgua();
            }
        } else if (edificio instanceof EdificioServicio) {
            ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            if (edificio instanceof Hospital) {
                ciudad.aguaXTurno -= edificio.consumoAgua();
            }
        } else if (edificio instanceof PlantaUtilidad) {
            if (edificio instanceof PlantaElectrica) {
                ciudad.electricidadXTurno += edificio.produccionXTurno();
            } else { // PlantaAgua
                ciudad.aguaXTurno += edificio.produccionXTurno();
                ciudad.electricidadXTurno -= edificio.consumoElectricidad();
            }
        }
        this.actualizarCiudadCompleta(ciudad); // ✅ usar this.
    }
}

export default CiudadService;
import CiudadService from "./CiudadService.js";

import{
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
}from "../modelos/index.js";


class TurnoService {
    constructor(){
        this.intervalo = null;
        this.ciudadService = new CiudadService();
    }

    iniciarTurnos(ciudad){
        if (!this.intervalo){
            this.intervalo = setInterval(() => {
                this.ejecutarTurno(ciudad);
            }, 10000); // Ejecuta cada 15 segundos
        }
    }

    // ejecutarTurno(ciudad){
    //     if(ciudad.dinero <= 0){
    //         console.log("La ciudad ha quebrado. Fin del juego");
    //         this.detenerTurnos();
    //         return;
    //     }

    //     ciudad.turno++;
    //     ciudad.dinero += ciudad.ingresosXTurno;
    //     ciudad.agua += ciudad.aguaXTurno;
    //     ciudad.electricidad += ciudad.electricidadXTurno;
    //     ciudad.alimento += ciudad.alimentoXTurno;
    //     //this.crearCiudadanosXturno();

    //     this.ciudadService.actualizarCiudadCompleta(ciudad);
    //     console.log("Turno:", ciudad.turno, "Dinero:", ciudad.dinero);
    // }

    crearCiudadanosXturno(){
        this.ciudadService.crearCiudadanosAutomaticamente();
        this.ciudadService.agregarCiudadanosATrabajosDisponibles();
        this.ciudadService.agregarCiudadanosAViviendasDisponibles();
    }

    detenerTurnos(){
        clearInterval(this.intervalo);
        this.intervalo = null;
    }

    ejecutarTurno(ciudad){
        if(ciudad.dinero <= 0){
            console.log("La ciudad ha quebrado. Fin del juego :,v");
            this.detenerTurnos();
            return;
        }

        ciudad.turno++;

        this.aplicarEfectosRecursos(ciudad);
        
        const produccion = this.calcularProduccion(ciudad);
        const consumo = this.calcularConsumo(ciudad);

        this.aplicarBalance(ciudad, produccion, consumo);

        const alertas = this.verificarRecursos(ciudad);
        alertas.forEach(alerta => console.log(alerta));

        this.crearCiudadanosXturno();

        this.ciudadService.actualizarCiudadCompleta(ciudad);

        console.log("Turno:", ciudad.turno, "Dinero:", ciudad.dinero);
    }

    calcularProduccion(ciudad){
        let produccion = {
            dinero: 0,
            agua: 0,
            electricidad: 0,
            alimento: 0
        };

        ciudad.misEdificios.forEach(edificio => {
            if(!edificio.activo) return;

            produccion.dinero += edificio.produccionXTurno?.() || 0;
            produccion.agua += edificio.produccionAgua?.() || 0;
            produccion.electricidad += edificio.produccionElectricidad?.() || 0;
            produccion.alimento += edificio.produccionAlimento?.() || 0;
        });

        return produccion;
    }

    calcularConsumo(ciudad){
        let consumo = {
            dinero: 0,
            agua: 0,
            electricidad: 0,
            alimento: 0
        };

        ciudad.misEdificios.forEach(edificio => {
            if(!edificio.activo) return;

            consumo.agua += edificio.consumoAgua?.() || 0;
            consumo.electricidad += edificio.consumoElectricidad?.() || 0;
        });

        return consumo;
    }

    aplicarBalance(ciudad, produccion, consumo){
        ciudad.dinero += produccion.dinero - consumo.dinero;
        ciudad.agua += produccion.agua - consumo.agua;
        ciudad.electricidad += produccion.electricidad - consumo.electricidad;
        ciudad.alimento += produccion.alimento - consumo.alimento;
    }

    verificarRecursos(ciudad){
        const alertas = [];

        if(ciudad.agua <= 0){
            alertas.push("¡Alerta! Te has quedado sin agua.");
        }

        if(ciudad.electricidad <= 0){
            alertas.push("¡Alerta! Te has quedado sin electricidad.");
        }

        return alertas;
    }

    aplicarEfectosRecursos(ciudad){
        ciudad.misEdificios.forEach(edificio => {

            // Reset
            let activo = true;
            
            if(ciudad.electricidad <= 0 && edificio.consumoElectricidad() > 0){
                activo = false;
            }

            if(ciudad.agua <= 0 && edificio.consumoAgua()>0){
                activo = false;
            }

            edificio.activo = activo;
        });
    }

    //window.iniciarTurnos = iniciarTurnos;
    //window.detenerTurnos = detenerTurnos;

};

export default TurnoService;
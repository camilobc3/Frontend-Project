import CiudadService from "./CiudadService.js";
const ciudadService = new CiudadService();

class TurnoService {
    constructor(){
        this.intervalo = null;
    }

    iniciarTurnos(ciudad){
        if (!this.intervalo){
            this.intervalo = setInterval(() => {
                this.ejecutarTurno(ciudad);
            }, 15000); // Ejecuta cada 15 segundos
        }
    }

    ejecutarTurno(ciudad){
        ciudad.turno++;
        ciudad.dinero += ciudad.ingresosXTurno;
        ciudad.agua += ciudad.aguaXTurno;
        ciudad.electricidad += ciudad.electricidadXTurno;
        ciudad.alimento += ciudad.alimentoXTurno;
        this.crearCiudadanosXturno();

        ciudadService.actualizarCiudadCompleta(ciudad);
        console.log("Turno:", ciudad.turno, "Dinero:", ciudad.dinero);
    }

    crearCiudadanosXturno(){
        ciudadService.crearCiudadanosAutomaticamente();
        ciudadService.agregarCiudadanosATrabajosDisponibles();
        ciudadService.agregarCiudadanosAViviendasDisponibles();
    }

    detenerTurnos(){
        clearInterval(this.intervalo);
        this.intervalo = null;
    }

    //window.iniciarTurnos = iniciarTurnos;
    //window.detenerTurnos = detenerTurnos;

};

export default TurnoService;
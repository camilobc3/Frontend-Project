import CiudadService from "./CiudadService.js";


class TurnoService {
    constructor(){
        this.intervalo = null;
        this.ciudadService = new CiudadService();
    }

    iniciarTurnos(ciudad){
        if (!this.intervalo){
            this.intervalo = setInterval(() => {
                this.ejecutarTurno(ciudad);
            }, 15000); // Ejecuta cada 15 segundos
        }
    }

    ejecutarTurno(ciudad){
        if(ciudad.dinero <= 0){
            console.log("La ciudad ha quebrado. Fin del juego");
            this.detenerTurnos();
            return;
        }

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
import StorageCiudad from "../acceso_datos/StorageCiudad.js";
import CiudadService from "./CiudadService.js";



class TurnoService {
    constructor(){
        this.intervalo = null;
        this.ciudadService = new CiudadService();
    }

    iniciarTurnos(ciudad){
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
        this.intervalo = setInterval(() => {
            const lista = StorageCiudad.load();
            const ciudadFresca = lista.find(c => String(c.id) === String(ciudad.id));
            if (!ciudadFresca) return;

                const resultado = this.ejecutarTurno(ciudadFresca);
                if (resultado?.gameOver) {
                this.onGameOver?.(resultado.razon); // ← callback opcional
                }
            }, 10000);
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

    crearCiudadanosXturno(ciudad){
        this.ciudadService.crearCiudadanosAutomaticamente(ciudad);
        this.ciudadService.agregarCiudadanosATrabajosDisponibles(ciudad);
        this.ciudadService.agregarCiudadanosAViviendasDisponibles(ciudad);
    }



    detenerTurnos(){
        clearInterval(this.intervalo);
        this.intervalo = null;
    }

    ejecutarTurno(ciudad){
        const ciudadService = new CiudadService(); // ← instancia para usar métodos de CiudadService
        ciudad.turno++;

        this.aplicarEfectosRecursos(ciudad);
        
        const produccion = this.calcularProduccion(ciudad);
        const consumo = this.calcularConsumo(ciudad);

        this.aplicarBalance(ciudad, produccion, consumo);
        
        if(ciudad.dinero < 0 || ciudad.electricidad < 0 || ciudad.agua < 0){
            this.detenerTurnos();
            return {
                gameOver: true,
                razon: ciudad.dinero < 0 ? "dinero"
                     : ciudad.electricidad < 0 ? "electricidad"
                     : "agua"
            };
        }

        const alertas = this.verificarRecursos(ciudad);
        alertas.forEach(alerta => console.log(alerta));

        this.crearCiudadanosXturno(ciudad);

        ciudadService.actualizarFelicidadCiudadanos(ciudad);
        console.log(ciudad.misCiudadanos.map(c => ({ id: c.id, felicidad: c.nivelFelicidad })));

        this.ciudadService.actualizarCiudadCompleta(ciudad);

        console.log("Turno:", ciudad.turno, "Dinero:", ciudad.dinero);
        
        return { gameOver: false };
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
            
            if(ciudad.electricidad <= 0 && (edificio.consumoElectricidad?.() || 0) > 0){
                activo = false;
            }

            if(ciudad.agua <= 0 && (edificio.consumoAgua?.() || 0) > 0){
                activo = false;
            }

            edificio.activo = activo;
        });
    }

    //window.iniciarTurnos = iniciarTurnos;
    //window.detenerTurnos = detenerTurnos;

};

export default TurnoService;
import StorageCiudad from "../acceso_datos/StorageCiudad.js";
import CiudadService from "./CiudadService.js";



class TurnoService {
    constructor(){
        this.intervalo = null;
        this.ciudadService = new CiudadService();
    }

    iniciarTurnos(ciudad) {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
        this.ciudadActual = ciudad;

        // Convertir segundos a milisegundos
        const duracionMs = (ciudad.duracionTurnoSeg || 300) * 1000;

        this.intervalo = setInterval(() => {
            const lista = StorageCiudad.load();
            const ciudadFresca = lista.find(c => String(c.id) === String(ciudad.id));
            if (!ciudadFresca) return;

            const resultado = this.ejecutarTurno(ciudadFresca);
            if (resultado?.gameOver) {
                this.onGameOver?.(resultado.razon);
            } else {
                this.onTurno?.(resultado);
            }
        }, duracionMs);
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

    async cambiarDuracionTurno(ciudad, segundos) {
        if (segundos <= 0) segundos = 300;
    
        // 🔁 Obtener la versión más actualizada de la ciudad (con recursos, edificios, etc.)
        const lista = StorageCiudad.load();
        const ciudadActualizada = lista.find(c => String(c.id) === String(ciudad.id));
        if (!ciudadActualizada) return;
    
        // Modificar la duración en la ciudad actualizada
        ciudadActualizada.duracionTurnoSeg = segundos;
    
        // Guardar los cambios (incluyendo el progreso actual)
        await this.ciudadService.actualizarCiudadCompleta(ciudadActualizada);
    
        // Si el juego está corriendo, reiniciar turnos con la ciudad actualizada
        if (this.intervalo && this.ciudadActual && this.ciudadActual.id === ciudad.id) {
            this.iniciarTurnos(ciudadActualizada);
        }
    }

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
        const ciudadService = new CiudadService();
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
    
        // Edificios inhabilitados para mostrar en UI
        const edificiosInhabilitados = ciudad.misEdificios
            .filter(e => !e.activo)
            .map(e => e.tipo);
    
        this.crearCiudadanosXturno(ciudad);
        ciudadService.actualizarFelicidadCiudadanos(ciudad);
        this.ciudadService.actualizarCiudadCompleta(ciudad);
        console.log("Turno:", ciudad.turno, "Dinero:", ciudad.dinero);
        
        return { gameOver: false, alertas, edificiosInhabilitados };
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

            consumo.dinero += edificio.consumoDinero?.() || 0;
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
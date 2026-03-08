import { crearCiudadanosAutomaticamente, agregarCiudadanosAViviendasDisponibles,  agregarCiudadanosATrabajosDisponibles } from "./CiudadService.js";
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - AlcaldeService");

    let intervalo;

    function iniciarTurnos(ciudad){
        if (!intervalo){
            intervalo = setInterval(function(){
                ejecutarTurno(ciudad);
            }, 5000); // Ejecuta cada 15 segundos
        }
    }

    function ejecutarTurno(ciudad){
        ciudad.turno++;
        ciudad.dinero += ciudad.ingresosXTurno;
        ciudad.agua += ciudad.aguaXTurno;
        ciudad.electricidad += ciudad.electricidadXTurno;
        ciudad.alimento += ciudad.alimentoXTurno;

        actualizarCiudadCompleta(ciudad);
        console.log("Turno:", ciudad.turno, "Dinero:", ciudad.dinero);
    }

    function crearCiudadanosXturno(){
        crearCiudadanosAutomaticamente();
        agregarCiudadanosATrabajosDisponibles();
        agregarCiudadanosAViviendasDisponibles();
    }

    function detenerTurnos(){
        clearInterval(intervalo);
        intervalo = null;
    }

    window.iniciarTurnos = iniciarTurnos;
    window.detenerTurnos = detenerTurnos;

});
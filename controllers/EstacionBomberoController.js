import EstacionBomberoService from "../negocio/EstacionBomberoService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - EstacionBomberoController");

    // Función para iniciar la construcción de una Estación de Bomberos
    window.iniciarConstruccionEstacionBombero = function() {
        console.log("Modo construcción: EstacionBombero activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "S2";
        alert("Selecciona una celda del mapa para construir una Estación de Bomberos");
    };

    // Agregar listeners a todos los botones de Estación de Bomberos
    const botonesEstacionBombero = [
        document.getElementById("btn-estacionbombero"),
        document.getElementById("btn-estacionbombero-tablet"),
        document.getElementById("btn-estacionbombero-desktop")
    ];

    botonesEstacionBombero.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionEstacionBombero);
        }
    });
});

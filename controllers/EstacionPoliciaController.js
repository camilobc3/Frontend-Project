import EstacionPoliciaService from "../negocio/EstacionPoliciaService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - EstacionPoliciaController");

    // Función para iniciar la construcción de una Estación de Policía
    window.iniciarConstruccionEstacionPolicia = function() {
        console.log("Modo construcción: EstacionPolicia activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "S3";
        alert("Selecciona una celda del mapa para construir una Estación de Policía");
    };

    // Agregar listeners a todos los botones de Estación de Policía
    const botonesEstacionPolicia = [
        document.getElementById("btn-estacionpolicia"),
        document.getElementById("btn-estacionpolicia-tablet"),
        document.getElementById("btn-estacionpolicia-desktop")
    ];

    botonesEstacionPolicia.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionEstacionPolicia);
        }
    });
});

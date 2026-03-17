import CasaService from "../negocio/CasaService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CasaController");

    // Función para iniciar la construcción de una Casa
    window.iniciarConstruccionCasa = function() {
        console.log("Modo construcción: Casa activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "R1";
        alert("Selecciona una celda del mapa para construir una Casa");
    };

    // Agregar listeners a todos los botones de Casa
    const botonesCasa = [
        document.getElementById("btn-casa"),
        document.getElementById("btn-casa-tablet"),
        document.getElementById("btn-casa-desktop")
    ];

    botonesCasa.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionCasa);
        }
    });
});


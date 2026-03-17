import ParqueService from "../negocio/ParqueService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - ParqueController");

    // Función para iniciar la construcción de un Parque
    window.iniciarConstruccionParque = function() {
        console.log("Modo construcción: Parque activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "P1";
        alert("Selecciona una celda del mapa para construir un Parque");
    };

    // Agregar listeners a todos los botones de Parque
    const botonesParque = [
        document.getElementById("btn-parque"),
        document.getElementById("btn-parque-tablet"),
        document.getElementById("btn-parque-desktop")
    ];

    botonesParque.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionParque);
        }
    });
});

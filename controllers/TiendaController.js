import TiendaService from "../negocio/TiendaService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - TiendaController");

    // Función para iniciar la construcción de una Tienda
    window.iniciarConstruccionTienda = function() {
        console.log("Modo construcción: Tienda activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "C1";
        alert("Selecciona una celda del mapa para construir una Tienda");
    };

    // Agregar listeners a todos los botones de Tienda
    const botonesTienda = [
        document.getElementById("btn-tienda"),
        document.getElementById("btn-tienda-tablet"),
        document.getElementById("btn-tienda-desktop")
    ];

    botonesTienda.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionTienda);
        }
    });
});

import ApartamentoService from "../negocio/ApartamentoService.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - ApartamentoController");

    // Función para iniciar la construcción de un Apartamento
    window.iniciarConstruccionApartamento = function() {
        console.log("Modo construcción: Apartamento activado. Selecciona una celda del mapa.");
        window.modoConstruccion = "R2";
        alert("Selecciona una celda del mapa para construir un Apartamento");
    };

    // Agregar listeners a todos los botones de Apartamento
    const botonesApartamento = [
        document.getElementById("btn-apartamento"),
        document.getElementById("btn-apartamento-tablet"),
        document.getElementById("btn-apartamento-desktop")
    ];

    botonesApartamento.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", window.iniciarConstruccionApartamento);
        }
    });
});

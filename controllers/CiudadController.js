import CiudadService from "../negocio/CiudadService.js";
const ciudadService = new CiudadService();
import { obtenerRegiones } from "../api/RegionesApi.js";


obtenerRegiones().then(data => {
    const regionSelect = document.getElementById("region");

    data.forEach(r => {
        const option = document.createElement("option");
        option.value = r.name;
        option.textContent = r.name;
        regionSelect.appendChild(option);
    });
})


document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM cargado - CiudadController");

    

document.getElementById("createCityForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const nickname = document.getElementById("nickname").value;
    const nombreCiudad = document.getElementById("cityName").value;
    const mapSize = document.getElementById("mapSize").value;
    const region = document.getElementById("region").value;

    const id = Date.now(); // id simple
    const turno = 1;

    ciudadService.crearCiudad(id, nombreCiudad, turno, mapSize, region);

  });
});
import CiudadService from "../negocio/CiudadService.js";

const ciudadService = new CiudadService();

document
  .getElementById("createCityForm")
  .addEventListener("submit", function (event) {

    event.preventDefault();

    const nickname = document.getElementById("nickname").value;
    const nombreCiudad = document.getElementById("cityName").value;
    const mapSize = document.getElementById("mapSize").value;
    const region = document.getElementById("region").value;

    const id = Date.now(); // id simple
    const turno = 1;

    ciudadService.crearCiudad(id, nombreCiudad, turno, mapSize, region);

  });
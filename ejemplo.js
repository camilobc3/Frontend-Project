// ejemplo.js
import CiudadService from "./negocio/CiudadService.js";

// Exponer para consola
window.CiudadService = CiudadService;

// Prueba directa
const servicio = new CiudadService();
console.log(servicio.cargarCiudad(1));

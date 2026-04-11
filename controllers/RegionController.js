import { listarRegiones } from "../negocio/RegionService.js"
export async function cargarRegiones() {
  const select = document.getElementById("departamentos");

  const regiones = await listarRegiones();

  regiones.forEach(region => {
    const option = document.createElement("option");
    option.value = region.id;
    option.textContent = region.nombre;

    select.appendChild(option);
  });
}
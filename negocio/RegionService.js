import { obtenerRegiones } from "../api/RegionesApi.js";
import { Region } from "../modelos/Region.js"

export async function listarRegiones() {
  const data = await obtenerRegiones();

  return data.map(item => 
    new Region(item.id, item.name)
  );
}
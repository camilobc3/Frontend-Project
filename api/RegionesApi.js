const API_URL = "https://api-colombia.com/api/v1/Department";

export async function obtenerRegiones() {
  const response = await fetch(API_URL);
  const data = await response.json();

  return data; // crudo
}
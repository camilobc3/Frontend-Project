export async function obtenerRegiones() {
    const response = await fetch("https://api-colombia.com/api/v1/Region");
    return response.json();
}
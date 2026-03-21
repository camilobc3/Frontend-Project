const BASE_URL = "http://127.0.0.1:5000";

export async function calcularRuta(mapa, inicio, fin) {
    const response = await fetch(`${BASE_URL}/api/calculate-route`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            map: mapa,
            start: inicio,
            end: fin
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al calcular la ruta");
    }

    return await response.json(); // { route: [[fila, col], ...] }
}
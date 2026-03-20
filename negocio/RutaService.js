import {calcularRuta} from "../api/RutaApi.js"

class RutaService {
    construirMatriz(matriz){
        return matriz.map(fila =>
            fila.map(celda => celda?.tipo === "R" ? 1 : 0)
        );
    }

    async calcularRuta(matriz, inicio, fin){
        const mapa = this.construirMatriz(matriz);
        return await calcularRuta(mapa, inicio, fin);
    }
}

export default RutaService;
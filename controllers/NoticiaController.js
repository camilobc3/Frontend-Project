// controllers/NoticiasController.js

class NoticiasController {

    /**
     * @param {NoticiaService} noticiaService
     * @param {string} codigoPais  - Ej: "co"
     */
    constructor(noticiaService, codigoPais) {
        this.service     = noticiaService;
        this.codigoPais  = codigoPais;
        this.intervaloId = null;

        // Referencias al DOM
        this.panelContenedor = document.getElementById("noticias-lista");
        this.panelEstado     = document.getElementById("noticias-estado");
    }

    /** Carga noticias y arranca la actualización automática cada 30 min */
    iniciar() {
        this._cargarNoticias();

        // Actualizar cada 30 minutos (30 * 60 * 1000 ms)
        this.intervaloId = setInterval(() => {
            this._cargarNoticias();
        }, 30 * 60 * 1000);
    }

    /** Detiene la actualización automática */
    detener() {
        if (this.intervaloId) {
            clearInterval(this.intervaloId);
            this.intervaloId = null;
        }
    }

    /** Llama al service y delega el renderizado */
    _cargarNoticias() {
        this._mostrarEstado("Cargando noticias...");

        this.service
            .obtenerUltimasNoticias(this.codigoPais)
            .then((noticias) => {
                this._renderizarNoticias(noticias);
                this._mostrarEstado(""); // limpiar mensaje de estado
            })
            .catch((error) => {
                console.error(error);
                this._mostrarEstado("No se pudieron cargar las noticias.");
            });
    }

    /** Genera el HTML de cada tarjeta de noticia */
    _renderizarNoticias(noticias) {
        if (!this.panelContenedor) return;

        if (noticias.length === 0) {
            this.panelContenedor.innerHTML =
                "<p class='text-gray-400 text-sm'>No hay noticias disponibles.</p>";
            return;
        }

        this.panelContenedor.innerHTML = noticias.map(function (n) {

            // Formatear timestamp
            const fecha = new Date(n.fechaPublicacion).toLocaleString("es-CO", {
                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
            });

            // Imagen (si está disponible)
            const imgHtml = n.urlImagen
                ? `<img src="${n.urlImagen}" alt="imagen noticia"
                        onerror="this.style.display='none'"
                        class="noticia-img">`
                : "";

            // Descripción truncada
            const desc = n.descripcion
                ? n.descripcion.substring(0, 120) + "..."
                : "Sin descripción disponible.";

            return `
                <article class="noticia-card">
                    ${imgHtml}
                    <div class="noticia-body">
                        <h4 class="noticia-titulo">${n.titulo}</h4>
                        <p class="noticia-desc">${desc}</p>
                        <div class="noticia-footer">
                            <span class="noticia-tiempo">🕐 ${fecha}</span>
                            <a href="${n.urlNoticia}" target="_blank"
                               rel="noopener noreferrer"
                               class="noticia-link">Leer más →</a>
                        </div>
                    </div>
                </article>`;
        }).join("");
    }

    _mostrarEstado(mensaje) {
        if (this.panelEstado) {
            this.panelEstado.textContent = mensaje;
        }
    }
}
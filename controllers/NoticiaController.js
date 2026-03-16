import { NEWS_API_KEY } from "../config.js";
import NoticiasRepository from "../acceso_datos/noticiasRepository.js";
import NoticiaService from "../negocio/NoticiaService.js";

document.addEventListener("DOMContentLoaded", function () {
    var codigoPais = "us";
    var intervaloMs = 30 * 60 * 1000;

    var panelContenedor = document.getElementById("noticias-lista");
    var panelEstado = document.getElementById("noticias-estado");

    var repo = new NoticiasRepository(NEWS_API_KEY);
    var service = new NoticiaService(repo);

    function mostrarEstado(mensaje) {
        if (panelEstado) panelEstado.textContent = mensaje;
    }

    function formatearFecha(iso) {
        try {
            return new Date(iso).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "2-digit"
            });
        } catch (_) {
            return "";
        }
    }

    function mostrarSkeletons() {
        if (!panelContenedor) return;
        panelContenedor.innerHTML = "";
        for (var i = 0; i < 3; i++) {
            var sk = document.createElement("div");
            sk.className = "nc-skeleton";
            panelContenedor.appendChild(sk);
        }
    }

    function makePlaceholder() {
        var ph = document.createElement("div");
        ph.className = "nc-thumb-placeholder";
        ph.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(16,185,129,0.35)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="12" y2="16"/></svg>';
        return ph;
    }

    function renderizarNoticias(noticias) {
        if (!panelContenedor) return;
        panelContenedor.innerHTML = "";

        if (!noticias || noticias.length === 0) {
            var p = document.createElement("p");
            p.textContent = "No hay noticias disponibles.";
            panelContenedor.appendChild(p);
            return;
        }

        var VISIBLE_DEFAULT = 3;

        noticias.forEach(function (n, idx) {
            var card = document.createElement("div");
            card.className = "nc-card" + (idx >= VISIBLE_DEFAULT ? " nc-hidden-extra" : "");
            if (idx >= VISIBLE_DEFAULT) card.style.display = "none";

            if (n.urlImagen) {
                var img = document.createElement("img");
                img.src = n.urlImagen;
                img.alt = "";
                img.className = "nc-thumb";
                img.loading = "lazy";
                img.onerror = function () { img.replaceWith(makePlaceholder()); };
                card.appendChild(img);
            } else {
                card.appendChild(makePlaceholder());
            }

            var body = document.createElement("div");
            body.className = "nc-body";

            var source = document.createElement("div");
            source.className = "nc-source";
            source.textContent = n.fuente || "Desconocida";

            var titulo = document.createElement("div");
            titulo.className = "nc-title";
            titulo.textContent = n.titulo || "Sin título";

            var footer = document.createElement("div");
            footer.className = "nc-footer";

            var fecha = document.createElement("span");
            fecha.className = "nc-date";
            fecha.textContent = formatearFecha(n.fechaPublicacion);

            var link = document.createElement("a");
            link.href = n.urlNoticia || "#";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.className = "nc-link";
            link.textContent = "Leer →";

            footer.appendChild(fecha);
            footer.appendChild(link);

            body.appendChild(source);
            body.appendChild(titulo);
            body.appendChild(footer);
            card.appendChild(body);

            panelContenedor.appendChild(card);
        });

        if (noticias.length > VISIBLE_DEFAULT) {
            var expandBtn = document.createElement("button");
            expandBtn.className = "nc-expand-btn";
            var expanded = false;
            expandBtn.textContent = "▼ ver " + (noticias.length - VISIBLE_DEFAULT) + " más";

            expandBtn.addEventListener("click", function () {
                expanded = !expanded;
                panelContenedor.querySelectorAll(".nc-hidden-extra").forEach(function (el) {
                    el.style.display = expanded ? "block" : "none";
                });
                expandBtn.textContent = expanded
                    ? "▲ ver menos"
                    : "▼ ver " + (noticias.length - VISIBLE_DEFAULT) + " más";
            });

            panelContenedor.appendChild(expandBtn);
        }
    }

    function cargarNoticias() {
        mostrarEstado("Cargando…");
        mostrarSkeletons();
        service.obtenerUltimasNoticias(codigoPais)
            .then(function (noticias) {
                renderizarNoticias(noticias);
                mostrarEstado("");
            })
            .catch(function (error) {
                console.error(error);
                panelContenedor.innerHTML = "";
                mostrarEstado("Error al cargar noticias.");
            });
    }

    cargarNoticias();
    setInterval(cargarNoticias, intervaloMs);
});
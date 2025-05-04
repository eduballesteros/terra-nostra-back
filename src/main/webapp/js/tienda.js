document.addEventListener("DOMContentLoaded", function () {
    const contenedorProductos = document.getElementById("contenedorProductos");
    const inputBuscador = document.getElementById("buscadorProductos");
    const checkboxDisponibles = document.getElementById("filtroStock");
    const enlacesCategorias = document.querySelectorAll("aside ul li a");
    const loader = document.getElementById("loaderProductos");

    if (!contenedorProductos) {
        console.error("⚠️ Error: No se encontró el contenedor con id 'contenedorProductos'");
        return;
    }

    let categoriaSeleccionada = null;

    function mostrarLoader(visible) {
        if (loader) loader.style.display = visible ? "block" : "none";
        if (contenedorProductos) contenedorProductos.classList.toggle("d-none", visible);
    }

    function cargarTodosLosProductos(filtros = {}) {
        mostrarLoader(true);
        let url = "/productos/listar";
        const query = new URLSearchParams(filtros).toString();
        if (query) url += `?${query}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Error al obtener productos: ${response.statusText}`);
                return response.json();
            })
            .then(productos => mostrarProductos(productos))
            .catch(error => console.error("Error al cargar productos:", error))
            .finally(() => mostrarLoader(false));
    }

    function aplicarFiltros() {
        const filtros = {
            texto: inputBuscador.value.trim(),
            disponibles: checkboxDisponibles.checked,
            categoria: categoriaSeleccionada
        };

        // ✅ Evita enviar categoría vacía al backend
        if (!filtros.categoria) {
            delete filtros.categoria;
        }

        cargarTodosLosProductos(filtros);
    }

    inputBuscador.addEventListener("input", aplicarFiltros);
    checkboxDisponibles.addEventListener("change", aplicarFiltros);

    enlacesCategorias.forEach(enlace => {
        enlace.addEventListener("click", e => {
            e.preventDefault();
            categoriaSeleccionada = enlace.dataset.categoria || null;

            enlacesCategorias.forEach(el => el.classList.remove("active"));
            enlace.classList.add("active");

            aplicarFiltros();
        });
    });

    function mostrarProductos(productos) {
        contenedorProductos.innerHTML = "";

        if (!productos || productos.length === 0) {
            contenedorProductos.innerHTML = '<p class="text-muted">No se encontraron productos.</p>';
            return;
        }

        productos.forEach(producto => {
            const productoHTML = `
                <div class="col">
                    <div class="producto-card d-flex flex-column h-100">
                        ${producto.imagen
                            ? `<img src="data:image/png;base64,${producto.imagen}" class="producto-img" alt="${producto.nombre}">`
                            : '<img src="images/default.png" class="producto-img" alt="Imagen no disponible">'}
                        <div class="producto-titulo">${producto.nombre}</div>
                        <div class="producto-descripcion">${producto.descripcionBreve || ''}</div>
                        <div class="producto-precio">${producto.precio ? producto.precio.toFixed(2) : "N/A"} €</div>
                        <div class="mt-auto d-flex justify-content-between align-items-center gap-2">
                            <a href="/producto?id=${producto.id}" class="btn btn-outline-primary w-100">Ver más</a>
                            <button class="btn btn-success d-flex align-items-center justify-content-center"
                                    onclick="añadirAlCarrito(${producto.id})"
                                    title="Añadir al carrito"
                                    style="width: 40px; height: 40px; border-radius: 50%;">
                                <img src="icons/cart.svg" alt="Añadir al carrito" style="width: 20px; height: 20px;">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            contenedorProductos.innerHTML += productoHTML;
        });
    }

    window.añadirAlCarrito = function (id) {
        console.log(`🛒 Producto con ID ${id} añadido al carrito`);
    };

    cargarTodosLosProductos();
});

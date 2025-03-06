document.addEventListener("DOMContentLoaded", function () {
    const mejoresProductosContainer = document.getElementById("mejoresProductos");

    // Verificar si el contenedor existe
    if (!mejoresProductosContainer) {
        console.error("⚠️ Error: No se encontró el contenedor con id 'mejoresProductos'");
        return;
    }

    /**
     * Obtiene la lista de productos desde el backend y selecciona los tres primeros.
     * Luego, los envía a la función `mostrarMejoresProductos` para mostrarlos en la interfaz.
     *
     * @returns {void}
     */


    function cargarProductos() {
        fetch("/productos/listar")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener productos: ${response.statusText}`);
                }
                return response.json();
            })
            .then(productos => {
                mostrarMejoresProductos(productos.slice(0, 3)); // Tomar solo los primeros 3 productos
            })
            .catch(error => console.error("Error al cargar productos:", error));
    }

    /**
     * Muestra los productos destacados en la sección correspondiente de la interfaz.
     * Genera dinámicamente tarjetas con los datos de los productos y los inserta en el contenedor.
     *
     * @param {Array<Object>} productos - Lista de productos a mostrar.
     * @param {number} productos[].id - ID del producto.
     * @param {string} productos[].nombre - Nombre del producto.
     * @param {string} productos[].descripcion - Descripción del producto.
     * @param {number} productos[].precio - Precio del producto.
     * @param {string} [productos[].imagen] - Imagen del producto en base64 (opcional).
     * @returns {void}
     */


    function mostrarMejoresProductos(productos) {
        mejoresProductosContainer.innerHTML = ""; // Limpiar antes de agregar productos

        productos.forEach(producto => {
            const productoHTML = `
                <div class="col-md-4">
                    <div class="card mb-4 shadow-sm">
                        ${producto.imagen
                            ? `<img src="data:image/png;base64,${producto.imagen}" class="card-img-top" alt="${producto.nombre}">`
                            : '<img src="images/default.png" class="card-img-top" alt="Imagen no disponible">'}
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion}</p>
                            <p class="text-muted">Precio: €${producto.precio ? producto.precio.toFixed(2) : "N/A"}</p>
                            <button class="btn btn-primary">Ver más</button>
                        </div>
                    </div>
                </div>
            `;
            mejoresProductosContainer.innerHTML += productoHTML;
        });
    }

    cargarProductos();
});

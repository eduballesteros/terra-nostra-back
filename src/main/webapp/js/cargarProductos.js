document.addEventListener("DOMContentLoaded", function () {
    const mejoresProductosContainer = document.getElementById("mejoresProductos");

    // Verificar si el contenedor existe
    if (!mejoresProductosContainer) {
        console.error("⚠️ Error: No se encontró el contenedor con id 'mejoresProductos'");
        return;
    }

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

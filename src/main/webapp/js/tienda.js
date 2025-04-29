document.addEventListener("DOMContentLoaded", function () {
    const contenedorProductos = document.getElementById("contenedorProductos");

    if (!contenedorProductos) {
        console.error("⚠️ Error: No se encontró el contenedor con id 'contenedorProductos'");
        return;
    }

    function cargarTodosLosProductos() {
        fetch("/productos/listar")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener productos: ${response.statusText}`);
                }
                return response.json();
            })
            .then(productos => {
                mostrarProductos(productos);
            })
            .catch(error => console.error("Error al cargar productos:", error));
    }

    function mostrarProductos(productos) {
        contenedorProductos.innerHTML = "";

        productos.forEach(producto => {
            const productoHTML = `
                <div class="col-12 col-sm-6 col-md-4 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        ${producto.imagen
                            ? `<img src="data:image/png;base64,${producto.imagen}" class="card-img-top" alt="${producto.nombre}">`
                            : '<img src="images/default.png" class="card-img-top" alt="Imagen no disponible">'}
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text text-muted">${producto.descripcion}</p>
                            <p class="card-text fw-bold mt-2">${producto.precio ? producto.precio.toFixed(2) : "N/A"} €</p>
                            <div class="mt-auto d-flex justify-content-between">
                                <a href="/producto?id=${producto.id}" class="btn btn-outline-primary">Ver más</a>
                                <button class="btn btn-success d-flex align-items-center justify-content-center" onclick="añadirAlCarrito(${producto.id})" title="Añadir al carrito" style="width: 40px; height: 40px; border-radius: 50%;">
                                    <img src="icons/cart.svg" alt="Añadir al carrito" style="width: 20px; height: 20px;">
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            `;
            contenedorProductos.innerHTML += productoHTML;
        });
    }

    window.añadirAlCarrito = function (id) {
        console.log(`🛒 Producto con ID ${id} añadido al carrito`);
        // Aquí más adelante puedes hacer fetch al backend, guardar en localStorage, etc.
    };

    cargarTodosLosProductos();
});

document.addEventListener("DOMContentLoaded", function () {
    const mejoresProductosContainer = document.getElementById("mejoresProductos");

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
                mostrarMejoresProductos(productos.slice(0, 3));
            })
            .catch(error => console.error("❌ Error al cargar productos:", error));
    }

    function mostrarMejoresProductos(productos) {
        mejoresProductosContainer.innerHTML = "";

        productos.forEach(producto => {
            const precioOriginal = producto.precio?.toFixed(2) ?? "N/A";
            const tieneDescuento = producto.descuento && producto.descuento > 0;
            const precioFinal = tieneDescuento
                ? (producto.precio - (producto.precio * producto.descuento / 100)).toFixed(2)
                : precioOriginal;

             const productoHTML = `
                 <div class="col-md-4 d-flex">
                     <div class="card shadow-sm h-100 w-100 d-flex flex-column">
                         ${producto.imagen
                             ? `<img src="data:image/png;base64,${producto.imagen}" class="card-img-top" alt="${producto.nombre}">`
                             : '<img src="images/default.png" class="card-img-top" alt="Imagen no disponible">'}
                         <div class="card-body d-flex flex-column">
                             <div>
                                 <h5 class="card-title">${producto.nombre}</h5>
                                 <p class="card-text">${producto.descripcionBreve}</p>
                                 <p class="text-muted">
                                     Precio:
                                     ${tieneDescuento
                                         ? `<span class="text-decoration-line-through">€${precioOriginal}</span>
                                            <strong class="text-danger">€${precioFinal}</strong>
                                            <span class="badge bg-success">${producto.descuento}% dto</span>`
                                         : `<strong>€${precioOriginal}</strong>`}
                                 </p>
                             </div>
                             <div class="mt-auto">
                                 <a href="#" class="btn btn-success w-100">Ver más</a>
                             </div>
                         </div>
                     </div>
                 </div>
             `;

            mejoresProductosContainer.innerHTML += productoHTML;
        });
    }
    cargarProductos();
});

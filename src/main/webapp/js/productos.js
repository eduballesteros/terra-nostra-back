document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loaderProducto");
    const detalle = document.getElementById("productoDetalle");

    const id = obtenerIdDesdeUrl();
    if (!id) {
        mostrarError("❌ Producto no encontrado.");
        return;
    }

    obtenerProducto(id);

    // === FUNCIONES PRINCIPALES ===

    function obtenerProducto(id) {
        loader.style.display = "flex";
        fetch(`/productos/${id}`, {
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("No encontrado");
                return res.json();
            })
            .then(producto => mostrarProducto(producto))
            .catch(() => mostrarError("❌ No se pudo cargar el producto."))
            .finally(() => loader.style.display = "none");
    }

    function mostrarProducto(producto) {
        // Imagen
        const imagenHtml = producto.imagen
            ? `<img src="data:image/png;base64,${producto.imagen}" class="img-fluid rounded shadow-sm producto-imagen" alt="${producto.nombre}">`
            : `<img src="images/default.png" class="img-fluid rounded shadow-sm producto-imagen" alt="Imagen no disponible">`;
        document.getElementById("imagenProducto").outerHTML = imagenHtml;

        // Info
        document.getElementById("nombreProducto").textContent = producto.nombre;
        document.getElementById("descripcionProducto").textContent = producto.descripcion || "Sin descripción";
        document.getElementById("precioProducto").innerHTML = generarPrecioHTML(producto);
        document.getElementById("stockProducto").textContent = producto.stock > 0 ? "Disponible" : "Sin stock";

        // Botón carrito
        document.getElementById("btnAgregarCarrito").onclick = () => añadirAlCarrito(producto.id);

        // Mostrar contenedor
        detalle.classList.remove("d-none");
        detalle.classList.add("fade-in");
    }

    function añadirAlCarrito(id) {
        console.log(`🛒 Producto con ID ${id} añadido al carrito`);
        alert("Producto añadido al carrito (simulado)");
        // Aquí puedes guardar en localStorage o enviar al backend
    }

    function mostrarError(mensaje) {
        loader.innerHTML = `<p class='text-danger fw-bold text-center'>${mensaje}</p>`;
    }

    // === UTILIDADES ===

    function obtenerIdDesdeUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    function generarPrecioHTML(producto) {
        if (producto.descuento && producto.descuento > 0) {
            const precioFinal = (producto.precio * (1 - producto.descuento / 100)).toFixed(2);
            return `
                <span class="text-decoration-line-through text-muted">${producto.precio.toFixed(2)} €</span>
                <span class="fw-bold text-danger ms-2">${precioFinal} €</span>
                <span class="badge bg-success ms-2">${producto.descuento}% dto</span>
            `;
        }
        return `${producto.precio ? producto.precio.toFixed(2) : "N/A"} €`;
    }
});

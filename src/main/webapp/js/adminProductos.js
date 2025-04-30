document.addEventListener("DOMContentLoaded", () => {
    console.log("📦 Cargando módulo de gestión de productos...");

    let idProductoPendienteEliminar = null;

    // Utilidades
    const getElement = id => document.getElementById(id);
    const mostrarModal = id => new bootstrap.Modal(getElement(id)).show();
    const ocultarModal = id => bootstrap.Modal.getInstance(getElement(id))?.hide();

    function mostrarAlerta(idElemento, mensaje, tipo = "success") {
        const alerta = getElement(idElemento);
        if (!alerta) return;

        alerta.className = `alert alert-${tipo}`;
        alerta.textContent = mensaje;

        setTimeout(() => alerta.classList.add("d-none"), 4000);
    }

    async function cargarProductos() {
        try {
            const res = await fetch("/productos/listar");
            if (!res.ok) throw new Error("Error al obtener productos");
            const productos = await res.json();

            const tbody = getElement("productosTableBody");
            tbody.innerHTML = "";
            productos.forEach(agregarProductoATabla);
        } catch (err) {
            console.error("❌ Error al cargar productos:", err);
        }
    }

    function agregarProductoATabla(producto) {
        const tbody = getElement("productosTableBody");

        const fila = document.createElement("tr");
        fila.dataset.id = producto.id;
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.precio?.toFixed(2) || "N/A"} €</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td>${producto.imagen ? `<img src="data:image/png;base64,${producto.imagen}" width="50">` : 'Sin imagen'}</td>
            <td><button class="btn btn-success btn-sm editar-producto"
                data-id="${producto.id}"
                data-nombre="${encodeURIComponent(producto.nombre)}"
                data-descripcion="${encodeURIComponent(producto.descripcion)}"
                data-precio="${producto.precio}"
                data-stock="${producto.stock}"
                data-categoria="${encodeURIComponent(producto.categoria)}">Editar</button></td>
            <td><button class="btn btn-danger btn-sm eliminar-producto"
                data-id="${producto.id}"
                data-nombre="${producto.nombre}">Eliminar</button></td>
        `;

        fila.querySelector(".eliminar-producto").addEventListener("click", () => {
            idProductoPendienteEliminar = producto.id;
            getElement("nombreProductoAEliminar").textContent = producto.nombre;
            mostrarModal("modalConfirmarEliminarProducto");
        });

        fila.querySelector(".editar-producto").addEventListener("click", e => cargarDatosEdicion(e.currentTarget));

        tbody.appendChild(fila);
    }

    async function eliminarProducto(id) {
        try {
            const res = await fetch(`/productos/eliminar/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error en la eliminación");

            getElement("productosTableBody").querySelector(`tr[data-id="${id}"]`)?.remove();
            mostrarAlerta("alertaProductos", "✅ Producto eliminado correctamente.");
        } catch (err) {
            mostrarAlerta("alertaProductos", "❌ Error al eliminar producto", "danger");
        }
    }

    function cargarDatosEdicion(btn) {
        const id = btn.dataset.id;
        if (!id || isNaN(id) || id <= 0) {
            mostrarAlerta("alertaProductos", "❌ ID no válido para edición", "danger");
            return;
        }

        getElement("editProductoId").value = id;
        getElement("editNombre").value = decodeURIComponent(btn.dataset.nombre);
        getElement("editDescripcion").value = decodeURIComponent(btn.dataset.descripcion);
        getElement("editPrecio").value = btn.dataset.precio;
        getElement("editStock").value = btn.dataset.stock;
        getElement("editCategoria").value = decodeURIComponent(btn.dataset.categoria);

        mostrarModal("editarProductoModal");
    }

    getElement("formProducto")?.addEventListener("submit", async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch("/productos/guardar", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Error al guardar el producto");
            await res.json();
            mostrarAlerta("alertaProductos", "✅ Producto guardado con éxito");
            cargarProductos(); // Recarga toda la tabla y los eventos
            form.reset();
        } catch (err) {
            mostrarAlerta("alertaProductos", "❌ Error al guardar el producto", "danger");
        }
    });

    getElement("editarProductoForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const id = getElement("editProductoId").value;
        if (!id || isNaN(id) || id <= 0) {
            mostrarAlerta("alertaProductos", "❌ ID no válido para edición", "danger");
            return;
        }

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch(`/productos/editar/${id}`, { method: "PUT", body: formData });
            const data = await res.json();
            if (!res.ok) throw data;

            mostrarAlerta("alertaProductos", data.mensaje || "✅ Producto actualizado correctamente.");
            cargarProductos();
            ocultarModal("editarProductoModal");
        } catch (error) {
            mostrarAlerta("alertaProductos", error.mensaje || "❌ Error al actualizar producto", "danger");
        }
    });

    getElement("btnConfirmarEliminarProducto")?.addEventListener("click", () => {
        if (idProductoPendienteEliminar) {
            eliminarProducto(idProductoPendienteEliminar);
            idProductoPendienteEliminar = null;
            ocultarModal("modalConfirmarEliminarProducto");
        }
    });

    cargarProductos();
});

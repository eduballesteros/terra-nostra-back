document.addEventListener("DOMContentLoaded", () => {
    console.log("📦 Cargando módulo de gestión de productos...");

    let idProductoPendienteEliminar = null;

    const getElement = id => document.getElementById(id);
    const mostrarModal = id => new bootstrap.Modal(getElement(id)).show();
    const ocultarModal = id => bootstrap.Modal.getInstance(getElement(id))?.hide();

    function mostrarAlerta(idElemento, mensaje, tipo = "success") {
        const alerta = getElement(idElemento);
        if (!alerta) return;

        alerta.className = `alert alert-${tipo}`;
        alerta.textContent = mensaje;
        alerta.classList.remove("d-none");

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
            <td>${producto.descripcionBreve}</td>
            <td>${producto.precio?.toFixed(2)} €</td>
            <td>${producto.descuento ?? 0}%</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td>${producto.imagen ? `<img src="data:image/png;base64,${producto.imagen}" width="50">` : 'Sin imagen'}</td>
            <td>
                <button class="btn btn-success btn-sm editar-producto"
                    data-id="${producto.id}"
                    data-nombre="${encodeURIComponent(producto.nombre)}"
                    data-descripcion="${encodeURIComponent(producto.descripcion)}"
                    data-descripcionbreve="${encodeURIComponent(producto.descripcionBreve)}"
                    data-precio="${producto.precio}"
                    data-descuento="${producto.descuento}"
                    data-stock="${producto.stock}"
                    data-categoria="${encodeURIComponent(producto.categoria)}">
                    Editar
                </button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm eliminar-producto"
                    data-id="${producto.id}"
                    data-nombre="${producto.nombre}">
                    Eliminar
                </button>
            </td>
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

    async function cargarCategorias() {
        try {
            const res = await fetch("/productos/categorias");
            if (!res.ok) throw new Error("Error al obtener categorías");
            const categorias = await res.json();

            const selects = [getElement("categoria"), getElement("editCategoria")];
            selects.forEach(select => {
                if (!select) return;
                select.innerHTML = '<option value="">Selecciona una categoría</option>';
                categorias.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = cat;
                    option.textContent = cat;
                    select.appendChild(option);
                });
            });
        } catch (err) {
            console.error("❌ Error al cargar categorías:", err);
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
        getElement("editDescripcionBreve").value = decodeURIComponent(btn.dataset.descripcionbreve);
        getElement("editPrecio").value = btn.dataset.precio;
        getElement("editDescuento").value = btn.dataset.descuento || 0;
        getElement("editStock").value = btn.dataset.stock;
        getElement("editCategoria").value = decodeURIComponent(btn.dataset.categoria);

        mostrarModal("editarProductoModal");
    }

    getElement("formProducto")?.addEventListener("submit", async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const nombre = formData.get("nombre")?.trim();
        const descripcion = formData.get("descripcion")?.trim();
        const descripcionBreve = formData.get("descripcionBreve")?.trim();
        const categoria = formData.get("categoria")?.trim();
        const precio = parseFloat(formData.get("precio"));
        const descuento = parseFloat(formData.get("descuento"));
        const stock = parseInt(formData.get("stock"));

        if (!nombre || !descripcion || !descripcionBreve || !categoria) {
            mostrarAlerta("alertaProductos", "❌ Todos los campos de texto son obligatorios", "warning");
            return;
        }
        if (isNaN(precio) || precio <= 0) {
            mostrarAlerta("alertaProductos", "❌ El precio debe ser un número positivo", "warning");
            return;
        }
        if (isNaN(descuento) || descuento < 0) {
            mostrarAlerta("alertaProductos", "❌ El descuento debe ser un número positivo o cero", "warning");
            return;
        }
        if (isNaN(stock) || stock <= 0) {
            mostrarAlerta("alertaProductos", "❌ La cantidad en stock debe ser un número positivo", "warning");
            return;
        }

        try {
            const res = await fetch("/productos/guardar", { method: "POST", body: formData });
            if (!res.ok) throw await res.json();
            await res.json();
            mostrarAlerta("alertaProductos", "✅ Producto guardado con éxito");
            cargarProductos();
            form.reset();
        } catch (err) {
            mostrarAlerta("alertaProductos", err.mensaje || "❌ Error al guardar el producto", "danger");
        }
    });

    getElement("editarProductoForm")?.addEventListener("submit", async e => {
        e.preventDefault();
        const id = getElement("editProductoId").value;
        if (!id || isNaN(id) || id <= 0) {
            mostrarAlerta("alertaProductos", "❌ ID no válido para edición", "danger");
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData(form);

        const nombre = getElement("editNombre").value.trim();
        const descripcionBreve = getElement("editDescripcionBreve").value.trim();
        const descripcion = getElement("editDescripcion").value.trim();
        const precio = parseFloat(getElement("editPrecio").value);
        const descuento = parseFloat(getElement("editDescuento").value);
        const stock = parseInt(getElement("editStock").value);
        const categoria = getElement("editCategoria").value.trim();

        if (!nombre || !descripcionBreve || !descripcion || !categoria) {
            mostrarAlerta("alertaProductos", "❌ Todos los campos de texto son obligatorios", "warning");
            return;
        }
        if (isNaN(precio) || precio <= 0) {
            mostrarAlerta("alertaProductos", "❌ El precio debe ser un número positivo", "warning");
            return;
        }
        if (isNaN(descuento) || descuento < 0) {
            mostrarAlerta("alertaProductos", "❌ El descuento debe ser positivo o cero", "warning");
            return;
        }
        if (isNaN(stock) || stock <= 0) {
            mostrarAlerta("alertaProductos", "❌ La cantidad en stock debe ser un número positivo", "warning");
            return;
        }

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
    cargarCategorias();
});

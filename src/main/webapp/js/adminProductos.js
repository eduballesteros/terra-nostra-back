document.addEventListener("DOMContentLoaded", function () {
    console.log("📦 Cargando módulo de gestión de productos...");

    /** 📢 Función para mostrar mensajes */
    function mostrarMensaje(mensaje, tipo) {
        let mensajeDiv = document.getElementById("mensaje");
        mensajeDiv.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensaje}</div>`;

        setTimeout(() => {
            mensajeDiv.innerHTML = "";
        }, 3000);
    }

    /** 🚀 Cargar lista de productos */
    function cargarProductos() {
        fetch("/productos/listar")
            .then(response => response.ok ? response.json() : Promise.reject("Error al obtener los productos"))
            .then(productos => {
                let tbody = document.getElementById("productosTableBody");
                tbody.innerHTML = "";

                productos.forEach(agregarProductoATabla);
            })
            .catch(error => console.error("❌ Error al cargar productos:", error));
    }

    /** 🚀 Agregar un nuevo producto sin recargar */
    const formProducto = document.getElementById("formProducto");
    if (formProducto) {
        formProducto.addEventListener("submit", function (event) {
            event.preventDefault();

            let formData = new FormData(this);

            fetch("/productos/guardar", {
                method: "POST",
                body: formData
            })
            .then(response => response.ok ? response.json() : Promise.reject("Error al guardar el producto"))
            .then(producto => {
                mostrarMensaje("✅ Producto guardado con éxito", "success");
                agregarProductoATabla(producto);
                this.reset();
            })
            .catch(error => {
                console.error("❌ Error al guardar el producto:", error);
                mostrarMensaje("❌ Error al guardar el producto", "danger");
            });
        });
    }

    /** 🔄 Agregar producto a la tabla con eventos */
    function agregarProductoATabla(producto) {
        let tbody = document.getElementById("productosTableBody");

        let fila = document.createElement("tr");
        fila.setAttribute("data-id", producto.id);
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.precio ? producto.precio.toFixed(2) + " €" : "N/A"}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td>
                ${producto.imagen
                    ? `<img src="data:image/png;base64,${producto.imagen}" width="50">`
                    : 'Sin imagen'}
            </td>
            <td>
                <button class="btn btn-success btn-sm editar-producto"
                    data-id="${producto.id}"
                    data-nombre="${producto.nombre}"
                    data-descripcion="${producto.descripcion}"
                    data-precio="${producto.precio}"
                    data-stock="${producto.stock}"
                    data-categoria="${producto.categoria}">
                    ✏ Editar
                </button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm eliminar-producto" data-id="${producto.id}">
                    🗑 Eliminar
                </button>
            </td>
        `;

        tbody.appendChild(fila);

        // ✅ Asignar eventos solo al nuevo producto agregado
        fila.querySelector(".eliminar-producto").addEventListener("click", function () {
            let id = this.getAttribute("data-id");
            if (confirm("⚠ ¿Seguro que quieres eliminar este producto?")) {
                eliminarProducto(id);
            }
        });

        fila.querySelector(".editar-producto").addEventListener("click", function () {
            cargarDatosEdicion(this);
        });
    }

    /** 🚀 Eliminar producto sin recargar */
    function eliminarProducto(id) {
        fetch(`/productos/eliminar/${id}`, { method: "DELETE" })
            .then(response => response.ok ? response.json() : Promise.reject("Error en la eliminación"))
            .then(() => {
                mostrarMensaje("✅ Producto eliminado correctamente.", "success");
                document.querySelector(`tr[data-id='${id}']`)?.remove();
            })
            .catch(() => mostrarMensaje("❌ Error al eliminar producto.", "danger"));
    }

    /** 🖊️ Evento para abrir el modal de edición */
    function cargarDatosEdicion(btn) {
        let idProducto = btn.getAttribute("data-id");

        if (!idProducto || idProducto === "null" || isNaN(idProducto) || idProducto <= 0) {
            console.error("❌ Error: ID del producto no válido.");
            mostrarMensaje("❌ Error al cargar datos del producto", "danger");
            return;
        }

        let inputId = document.getElementById("editProductoId");
        inputId.value = idProducto;
        inputId.setAttribute("readonly", true);

        document.getElementById("editNombre").value = btn.getAttribute("data-nombre");
        document.getElementById("editDescripcion").value = btn.getAttribute("data-descripcion");
        document.getElementById("editPrecio").value = btn.getAttribute("data-precio");
        document.getElementById("editStock").value = btn.getAttribute("data-stock");
        document.getElementById("editCategoria").value = btn.getAttribute("data-categoria");

        let modal = new bootstrap.Modal(document.getElementById("editarProductoModal"));
        modal.show();
    }

    /** 🚀 Actualizar producto */
    document.getElementById("editarProductoForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let productoId = document.getElementById("editProductoId").value;

        if (!productoId || productoId === "null" || isNaN(productoId) || productoId <= 0) {
            console.error("❌ Error: Intentando actualizar un producto sin ID válido.");
            mostrarMensaje("❌ Error: No se puede actualizar el producto.", "danger");
            return;
        }

        let formData = new FormData(this);

        fetch(`/productos/editar/${productoId}`, {
            method: "PUT",
            body: formData
        })
        .then(response => response.ok ? response.json() : Promise.reject(response.json()))
        .then(data => {
            mostrarMensaje(data.mensaje || "✅ Producto actualizado correctamente.", "success");
            cargarProductos();
            bootstrap.Modal.getInstance(document.getElementById("editarProductoModal")).hide();
        })
        .catch(async err => {
            const error = await err;
            mostrarMensaje(error.mensaje || "❌ Error al actualizar producto", "danger");
        });
    });

    cargarProductos();
});

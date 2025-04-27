document.addEventListener("DOMContentLoaded", function () {
    console.log("📦 Cargando módulo de gestión de productos...");

    let idProductoPendienteEliminar = null;

    function mostrarAlerta(idElemento, mensaje, tipo = "success") {
        const alerta = document.getElementById(idElemento);
        if (!alerta) return;

        alerta.classList.remove("d-none", "alert-success", "alert-danger", "alert-info", "alert-warning");
        alerta.classList.add(`alert-${tipo}`);
        alerta.innerText = mensaje;

        setTimeout(() => {
            alerta.classList.add("d-none");
        }, 4000);
    }

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
                    Editar
                </button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm eliminar-producto" data-id="${producto.id}" data-nombre="${producto.nombre}">
                    Eliminar
                </button>
            </td>
        `;

        tbody.appendChild(fila);

        fila.querySelector(".eliminar-producto").addEventListener("click", function () {
            idProductoPendienteEliminar = this.getAttribute("data-id");
            document.getElementById("nombreProductoAEliminar").textContent = producto.nombre;

            const modal = new bootstrap.Modal(document.getElementById("modalConfirmarEliminarProducto"));
            modal.show();
        });

        fila.querySelector(".editar-producto").addEventListener("click", function () {
            cargarDatosEdicion(this);
        });
    }

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
                    mostrarAlerta("alertaProductos", "✅ Producto guardado con éxito", "success");
                    agregarProductoATabla(producto);
                    this.reset();
                })
                .catch(error => {
                    console.error("❌ Error al guardar el producto:", error);
                    mostrarAlerta("alertaProductos", "❌ Error al guardar el producto", "danger");
                });
        });
    }

    function eliminarProducto(id) {
        fetch(`/productos/eliminar/${id}`, { method: "DELETE" })
            .then(response => response.ok ? response.json() : Promise.reject("Error en la eliminación"))
            .then(() => {
                mostrarAlerta("alertaProductos", "✅ Producto eliminado correctamente.", "success");
                document.querySelector(`tr[data-id='${id}']`)?.remove();
            })
            .catch(() => mostrarAlerta("alertaProductos", "❌ Error al eliminar producto.", "danger"));
    }

    function cargarDatosEdicion(btn) {
        let idProducto = btn.getAttribute("data-id");

        if (!idProducto || idProducto === "null" || isNaN(idProducto) || idProducto <= 0) {
            console.error("❌ Error: ID del producto no válido.");
            mostrarAlerta("alertaProductos", "❌ Error al cargar datos del producto", "danger");
            return;
        }

        document.getElementById("editProductoId").value = idProducto;
        document.getElementById("editNombre").value = btn.getAttribute("data-nombre");
        document.getElementById("editDescripcion").value = btn.getAttribute("data-descripcion");
        document.getElementById("editPrecio").value = btn.getAttribute("data-precio");
        document.getElementById("editStock").value = btn.getAttribute("data-stock");
        document.getElementById("editCategoria").value = btn.getAttribute("data-categoria");

        let modal = new bootstrap.Modal(document.getElementById("editarProductoModal"));
        modal.show();
    }

    document.getElementById("editarProductoForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let productoId = document.getElementById("editProductoId").value;

        if (!productoId || productoId === "null" || isNaN(productoId) || productoId <= 0) {
            console.error("❌ Error: Intentando actualizar un producto sin ID válido.");
            mostrarAlerta("alertaProductos", "❌ Error: No se puede actualizar el producto.", "danger");
            return;
        }

        let formData = new FormData(this);

        fetch(`/productos/editar/${productoId}`, {
            method: "PUT",
            body: formData
        })
            .then(response => response.ok ? response.json() : Promise.reject(response.json()))
            .then(data => {
                mostrarAlerta("alertaProductos", data.mensaje || "✅ Producto actualizado correctamente.", "success");
                cargarProductos();
                bootstrap.Modal.getInstance(document.getElementById("editarProductoModal")).hide();
            })
            .catch(async err => {
                const error = await err;
                mostrarAlerta("alertaProductos", error.mensaje || "❌ Error al actualizar producto", "danger");
            });
    });

    document.getElementById("btnConfirmarEliminarProducto")?.addEventListener("click", () => {
        if (idProductoPendienteEliminar) {
            eliminarProducto(idProductoPendienteEliminar);
            idProductoPendienteEliminar = null;

            const modal = bootstrap.Modal.getInstance(document.getElementById("modalConfirmarEliminarProducto"));
            modal.hide();
        }
    });

    cargarProductos();
});

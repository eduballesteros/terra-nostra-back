document.addEventListener("DOMContentLoaded", function () {
    console.log("📡 Cargando módulo de gestión de usuarios...");

    let emailUsuarioPendienteEliminar = null;

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

    function cargarUsuarios() {
        fetch("/usuario/listar")
            .then(response => {
                if (!response.ok) throw new Error("Error al obtener los usuarios");
                return response.json();
            })
            .then(usuarios => {
                const tbody = document.getElementById("usuariosTableBody");
                tbody.innerHTML = "";

                usuarios.forEach(usuario => {
                    let fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellido}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.telefono || "No disponible"}</td>
                        <td>${usuario.direccion || "No especificada"}</td>
                        <td>${usuario.rol}</td>
                        <td>
                            <button class="btn btn-primary btn-sm editar-usuario"
                                data-email="${usuario.email}"
                                data-nombre="${usuario.nombre}"
                                data-apellido="${usuario.apellido}"
                                data-telefono="${usuario.telefono}"
                                data-direccion="${usuario.direccion}"
                                data-rol="${usuario.rol}">
                                Editar
                            </button>
                            <button class="btn btn-danger btn-sm eliminar-usuario"
                                data-email="${usuario.email}"
                                data-nombre="${usuario.nombre}">
                                Eliminar
                            </button>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });

                agregarEventosUsuarios();
            })
            .catch(error => {
                console.error("❌ Error al cargar usuarios:", error);
                mostrarAlerta("alertaUsuarios", "❌ Error al cargar la lista de usuarios.", "danger");
            });
    }

    function agregarEventosUsuarios() {
        document.querySelectorAll(".eliminar-usuario").forEach(btn => {
            btn.addEventListener("click", function () {
                emailUsuarioPendienteEliminar = this.getAttribute("data-email");
                const nombre = this.getAttribute("data-nombre");
                document.getElementById("nombreUsuarioAEliminar").textContent = nombre;
                document.getElementById("inputConfirmarEmail").value = "";

                const modal = new bootstrap.Modal(document.getElementById("modalConfirmarEliminarUsuario"));
                modal.show();
            });
        });

        document.querySelectorAll(".editar-usuario").forEach(btn => {
            btn.addEventListener("click", function () {
                const modalElement = document.getElementById("editarUsuarioModal");
                document.getElementById("editEmail").value = this.getAttribute("data-email") || "";
                document.getElementById("editNombre").value = this.getAttribute("data-nombre") || "";
                document.getElementById("editApellido").value = this.getAttribute("data-apellido") || "";
                document.getElementById("editTelefono").value = this.getAttribute("data-telefono") || "";
                document.getElementById("editDireccion").value = this.getAttribute("data-direccion") || "";
                document.getElementById("editRol").value = this.getAttribute("data-rol") || "";

                new bootstrap.Modal(modalElement).show();
            });
        });
    }

    document.getElementById("btnConfirmarEliminarUsuario")?.addEventListener("click", () => {
        const inputEmail = document.getElementById("inputConfirmarEmail").value.trim();

        if (inputEmail !== emailUsuarioPendienteEliminar) {
            mostrarAlerta("alertaUsuarios", "❌ El correo no coincide. Eliminación cancelada.", "danger");
            return;
        }

        fetch(`/admin/eliminarUsuario?email=${emailUsuarioPendienteEliminar}`, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        })
            .then(response => {
                if (!response.ok) throw new Error("Error en la eliminación");
                return response.json();
            })
            .then(data => {
                mostrarAlerta("alertaUsuarios", data.mensaje || "✅ Usuario eliminado correctamente.", "success");
                cargarUsuarios();
                emailUsuarioPendienteEliminar = null;
                bootstrap.Modal.getInstance(document.getElementById("modalConfirmarEliminarUsuario")).hide();
            })
            .catch(error => {
                console.error("❌ Error al eliminar usuario:", error);
                mostrarAlerta("alertaUsuarios", "❌ Error al eliminar usuario.", "danger");
            });
    });

    document.getElementById("editarUsuarioForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const email = document.getElementById("editEmail").value;
        const datosUsuario = Object.fromEntries(formData);

        fetch(`/admin/editarUsuario?email=${email}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosUsuario)
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al actualizar usuario");
                return response.json();
            })
            .then(data => {
                mostrarAlerta("alertaUsuarios", data.mensaje || "✅ Usuario actualizado correctamente.", "success");
                cargarUsuarios();
                bootstrap.Modal.getInstance(document.getElementById("editarUsuarioModal")).hide();
            })
            .catch(error => {
                console.error("❌ Error al actualizar usuario:", error);
                mostrarAlerta("alertaUsuarios", "❌ Error al actualizar usuario.", "danger");
            });
    });

    cargarUsuarios();
});

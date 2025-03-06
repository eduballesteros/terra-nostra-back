document.addEventListener("DOMContentLoaded", function () {
    console.log("📡 Cargando módulo de gestión de usuarios...");

    /**
     * Obtiene la lista de usuarios desde el backend y los muestra en la tabla HTML.
     * Realiza una solicitud `fetch` al controlador y, si la respuesta es válida,
     * inserta los usuarios.
     *
     * @returns {void}
     */


    function cargarUsuarios() {
        console.log("🔄 Solicitando lista de usuarios...");

        fetch("/usuario/listar")
            .then(response => {
                if (!response.ok) throw new Error("Error al obtener los usuarios");
                return response.json();
            })
            .then(usuarios => {
                console.log("👥 Usuarios obtenidos:", usuarios);

                let tbody = document.getElementById("usuariosTableBody");
                if (!tbody) {
                    console.error("❌ No se encontró usuariosTableBody en el DOM.");
                    return;
                }

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
                            <button class="btn btn-danger btn-sm eliminar-usuario" data-email="${usuario.email}">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });

                agregarEventosUsuarios();
                console.log("✅ Usuarios cargados correctamente.");
            })
            .catch(error => console.error("❌ Error al cargar usuarios:", error));
    }

    /**
     * Asigna eventos de edición y eliminación a los botones dentro de la tabla de usuarios.
     * Permite editar y eliminar usuarios mediante modales y confirmaciones.
     *
     * @returns {void}
     */


    function agregarEventosUsuarios() {

    /**
     * Maneja el evento de eliminación de un usuario.
     * Solicita confirmación mediante un `prompt` y envía una petición `DELETE` al backend.
     *
     * @param {string} email - Correo del usuario a eliminar.
     * @returns {void}
     */

        document.querySelectorAll(".eliminar-usuario").forEach(btn => {
            btn.addEventListener("click", function () {
                let email = this.getAttribute("data-email");

                let userInput = prompt("Para confirmar la eliminación, escribe el correo del usuario:", "");

                if (!userInput || userInput.trim() !== email) {
                    alert("❌ El correo ingresado no coincide. La eliminación ha sido cancelada.");
                    return;
                }

                fetch(`/admin/eliminarUsuario?email=${email}`, {
                    method: "DELETE",
                    headers: { "Accept": "application/json" }
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Error en la eliminación");
                        return response.json();
                    })
                    .then(data => {
                        alert(data.mensaje || "✅ Usuario eliminado correctamente.");
                        cargarUsuarios();
                    })
                    .catch(error => {
                        console.error("❌ Error al eliminar usuario:", error);
                        alert("❌ Error al eliminar usuario.");
                    });
            });
        });

        /**
         * Maneja el evento de edición de un usuario.
         * Rellena los campos del formulario de edición con los datos del usuario y muestra el modal.
         *
         * @param {HTMLElement} btn - Botón que activó la edición.
         * @returns {void}
         */


        document.querySelectorAll(".editar-usuario").forEach(btn => {
            btn.addEventListener("click", function () {
                let modalElement = document.getElementById("editarUsuarioModal");
                if (!modalElement) {
                    console.error("❌ No se encontró el modal de edición en el DOM.");
                    return;
                }

                document.getElementById("editEmail").value = this.getAttribute("data-email") || "";
                document.getElementById("editNombre").value = this.getAttribute("data-nombre") || "";
                document.getElementById("editApellido").value = this.getAttribute("data-apellido") || "";
                document.getElementById("editTelefono").value = this.getAttribute("data-telefono") || "";
                document.getElementById("editDireccion").value = this.getAttribute("data-direccion") || "";
                document.getElementById("editRol").value = this.getAttribute("data-rol") || "";

                let modal = new bootstrap.Modal(modalElement);
                modal.show();
            });
        });
    }

    /**
     * Envía los datos editados del usuario al backend para su actualización.
     * Captura el evento `submit`, evita la recarga de la página y realiza una petición `PUT`.
     *
     * @returns {void}
     */


    document.getElementById("editarUsuarioForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        let formData = new FormData(this);
        let email = document.getElementById("editEmail").value;
        let datosUsuario = Object.fromEntries(formData);

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
                alert(data.mensaje || "✅ Usuario actualizado correctamente.");
                cargarUsuarios();
            })
            .catch(error => {
                console.error("❌ Error al actualizar usuario:", error);
                alert(error.message);
            });
    });

    cargarUsuarios();
});

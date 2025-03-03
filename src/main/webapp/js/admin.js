document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".eliminar-usuario").forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();

            let email = this.getAttribute("data-email");

            // Pedir al usuario que escriba el email para confirmar la eliminación
            let inputEmail = prompt(`Para eliminar al usuario, escribe su correo:\n\n${email}`);

            if (inputEmail === null) {
                return; // Usuario canceló
            }

            // Validar que el usuario haya escrito el email correctamente
            if (inputEmail.trim().toLowerCase() !== email.toLowerCase()) {
                alert("❌ El correo ingresado no coincide. Cancelando eliminación.");
                return;
            }

            // Si el correo es correcto, proceder con la eliminación
            fetch(`/admin/eliminarUsuario?email=${email}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la eliminación");
                }
                return response.json();
            })
            .then(data => {
                alert(data.mensaje || "✅ Usuario eliminado correctamente.");
                location.reload();
            })
            .catch(error => {
                console.error("❌ Error al eliminar usuario:", error);
                alert("❌ Error al eliminar usuario.");
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Asegurar que el formulario de edición está presente antes de añadir eventos
    const formEditar = document.getElementById("editarUsuarioForm");
    if (!formEditar) {
        console.warn("⚠ No se encontró el formulario de edición.");
        return;
    }

    formEditar.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar recarga de página

        let formData = new FormData(this);
        let email = document.getElementById("editEmail").value;
        let datosUsuario = Object.fromEntries(formData);

        console.log("🔍 JSON enviado:", JSON.stringify(datosUsuario)); // Debug

        fetch(`/admin/editarUsuario?email=${email}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosUsuario)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.mensaje || "Error al actualizar usuario");
                });
            }
            return response.json();
        })
        .then(data => {
            alert(data.mensaje || "✅ Usuario actualizado correctamente.");
            location.reload();
        })
        .catch(error => {
            console.error("❌ Error al actualizar usuario:", error);
            alert(error.message);
        });
    });

    // Habilitar los botones de edición después de asegurarnos que el DOM ha cargado
    document.querySelectorAll(".editar-usuario").forEach(btn => {
        btn.disabled = false; // Habilitar botones en caso de bloqueo
        btn.addEventListener("click", function () {
            let email = this.getAttribute("data-email");

            // Llenar el modal con los datos actuales del usuario
            document.getElementById("editEmail").value = email;
            document.getElementById("editNombre").value = this.getAttribute("data-nombre");
            document.getElementById("editApellido").value = this.getAttribute("data-apellido");
            document.getElementById("editTelefono").value = this.getAttribute("data-telefono");
            document.getElementById("editDireccion").value = this.getAttribute("data-direccion");
            document.getElementById("editRol").value = this.getAttribute("data-rol");

            // Mostrar el modal
            let modal = new bootstrap.Modal(document.getElementById("editarUsuarioModal"));
            modal.show();
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    let nombreActual = "";
    let apellidoActual = "";
    let telefonoActual = "";
    let direccionActual = "";

    // 🔐 Verificar sesión y obtener el email
    fetch("/auth/verificar-sesion", {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(sessionData => {
        if (!sessionData.sesionActiva) {
            console.warn("⚠️ No hay sesión activa.");
            return;
        }

        const emailUsuario = sessionData.emailUsuario;
        console.log("📧 Email del usuario logueado:", emailUsuario);
        document.body.dataset.email = emailUsuario; // ✅ importante para usar luego

        // Obtener detalles del usuario
        fetch(`/usuario/detalle?email=${encodeURIComponent(emailUsuario)}`)
            .then(response => {
                console.log("🔄 Respuesta del backend:", response);
                if (!response.ok) {
                    throw new Error("No se pudo cargar la información del usuario.");
                }
                return response.json();
            })
            .then(data => {
                console.log("📦 Datos del usuario cargados:", data);

                nombreActual = data.nombre || "";
                apellidoActual = data.apellido || "";
                telefonoActual = data.telefono || "";
                direccionActual = data.direccion || "";

                const nombreCompleto = `${nombreActual} ${apellidoActual}`.trim();
                document.getElementById("nombreUsuario").textContent = nombreCompleto;
                document.getElementById("emailUsuario").textContent = data.email || "";
                document.getElementById("telefonoUsuario").textContent = telefonoActual || "No especificado";
                document.getElementById("direccionUsuario").textContent = direccionActual || "No especificada";

                console.log("✅ Usuario renderizado correctamente.");
            })
            .catch(error => {
                console.error("❌ Error al obtener los datos del usuario:", error);
                document.getElementById("infoUsuario").innerHTML = `
                    <div class="alert alert-danger mt-3">
                        ⚠️ Error al cargar tus datos: ${error.message}
                    </div>`;
            });
    })
    .catch(error => {
        console.error("❌ Error al verificar sesión:", error);
    });

    const linkPedidos = document.getElementById("linkPedidos");
    const linkPerfil = document.getElementById("linkPerfil");
    const seccionPedidos = document.getElementById("seccionPedidos");
    const seccionPerfil = document.getElementById("seccionPerfil");

    if (linkPedidos && linkPerfil && seccionPedidos && seccionPerfil) {
        linkPedidos.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("🧾 Cambiando a sección Pedidos");
            seccionPedidos.classList.remove("d-none");
            seccionPerfil.classList.add("d-none");
            linkPedidos.classList.add("active", "fw-bold", "text-primary");
            linkPerfil.classList.remove("active", "fw-bold", "text-primary");
        });

        linkPerfil.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("👤 Cambiando a sección Perfil");
            seccionPerfil.classList.remove("d-none");
            seccionPedidos.classList.add("d-none");
            linkPerfil.classList.add("active", "fw-bold", "text-primary");
            linkPedidos.classList.remove("active", "fw-bold", "text-primary");
        });
    }

    // ✏️ Modal edición
    const btnEditar = document.querySelector("#infoUsuario .btn");
    const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
    const formEditar = document.getElementById("formEditarUsuario");
    const alerta = document.getElementById("alertaModal");

    if (btnEditar && modal && formEditar && alerta) {
        console.log("🛠 Modal de edición inicializado.");

        btnEditar.addEventListener("click", () => {
            console.log("🖋 Abriendo modal con datos:");
            console.log(" - Nombre:", nombreActual);
            console.log(" - Apellido:", apellidoActual);
            console.log(" - Teléfono:", telefonoActual);
            console.log(" - Dirección:", direccionActual);

            document.getElementById("editNombre").value = nombreActual;
            document.getElementById("editApellido").value = apellidoActual;
            document.getElementById("editTelefono").value = telefonoActual;
            document.getElementById("editDireccion").value = direccionActual;
            document.getElementById("editEmail").value = document.getElementById("emailUsuario").textContent || "";

            alerta.classList.add("d-none"); // Ocultar alerta anterior
            modal.show();
        });

        formEditar.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("📤 Enviando datos actualizados...");

            const datos = {
                nombre: document.getElementById("editNombre").value,
                apellido: document.getElementById("editApellido").value,
                telefono: document.getElementById("editTelefono").value,
                direccion: document.getElementById("editDireccion").value,
                email: document.getElementById("editEmail").value
            };

            console.log("📦 Payload enviado:", datos);

            fetch("/usuario/actualizar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(respuesta => {
                console.log("✅ Respuesta del servidor:", respuesta);
                alerta.textContent = respuesta.mensaje;
                alerta.className = "alert alert-success";
                alerta.classList.remove("d-none");

                setTimeout(() => {
                    alerta.classList.add("d-none");
                    modal.hide();
                    location.reload();
                }, 2500);
            })
            .catch(error => {
                console.error("❌ Error al actualizar usuario:", error);
                alerta.textContent = "❌ Error al actualizar tus datos. Intenta de nuevo.";
                alerta.className = "alert alert-danger";
                alerta.classList.remove("d-none");

                setTimeout(() => alerta.classList.add("d-none"), 3000);
            });
        });
    } else {
        console.warn("⚠️ Elementos del modal no encontrados.");
    }

    // 🔐 Cambio de contraseña desde el modal
    const btnEnviarEnlace = document.getElementById("btnEnviarEnlaceCambio");
    const alertaCambio = document.getElementById("alertaCambioContrasenia");

    if (btnEnviarEnlace && alertaCambio) {
        btnEnviarEnlace.addEventListener("click", () => {
            const email = document.body.dataset.email;

            if (!email) {
                alertaCambio.classList.remove("d-none");
                alertaCambio.className = "alert alert-danger";
                alertaCambio.textContent = "❌ No se pudo recuperar el email del usuario.";
                return;
            }

            fetch("/recuperacion/enviar-enlace", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `email=${encodeURIComponent(email)}`
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("No se pudo enviar el correo.");
                }
                return res.text();
            })
            .then(data => {
                alertaCambio.classList.remove("d-none");
                alertaCambio.className = "alert alert-success";
                alertaCambio.textContent = data;
            })
            .catch(err => {
                console.error("❌ Error al enviar enlace:", err);
                alertaCambio.classList.remove("d-none");
                alertaCambio.className = "alert alert-danger";
                alertaCambio.textContent = "❌ Error al enviar el correo. Intenta más tarde.";
            });
        });
    }

});

document.addEventListener("DOMContentLoaded", function () {
    let nombreActual = "";
    let apellidoActual = "";
    let telefonoActual = "";
    let direccionActual = "";

    fetch("/auth/verificar-sesion", {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(sessionData => {
        if (!sessionData.sesionActiva) return;

        const emailUsuario = sessionData.emailUsuario;
        document.body.dataset.email = emailUsuario;

        fetch(`/usuario/detalle?email=${encodeURIComponent(emailUsuario)}`)
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar la información del usuario.");
                return response.json();
            })
            .then(data => {
                nombreActual = data.nombre || "";
                apellidoActual = data.apellido || "";
                telefonoActual = data.telefono || "";
                direccionActual = data.direccion || "";

                const nombreCompleto = `${nombreActual} ${apellidoActual}`.trim();
                document.getElementById("nombreUsuario").textContent = nombreCompleto;
                document.getElementById("emailUsuario").textContent = data.email || "";
                document.getElementById("telefonoUsuario").textContent = telefonoActual || "No especificado";
                document.getElementById("direccionUsuario").textContent = direccionActual || "No especificada";

                // Mostrar aviso de correo no verificado
                if (data.correoVerificado === false) {
                    const bloqueVerificacion = document.getElementById("bloqueVerificacionCorreo");
                    if (bloqueVerificacion) bloqueVerificacion.classList.remove("d-none");

                    const btnSolicitar = document.getElementById("btnSolicitarVerificacion");
                    const mensaje = document.getElementById("mensajeVerificacion");

                    if (btnSolicitar && mensaje) {
                        btnSolicitar.addEventListener("click", () => {
                            fetch("/usuario/reenviar-verificacion", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: `email=${encodeURIComponent(data.email)}`
                            })
                            .then(res => {
                                if (!res.ok) throw new Error();
                                return res.text();
                            })
                            .then(mensajeRespuesta => {
                                mensaje.textContent = mensajeRespuesta;
                                mensaje.className = "alert alert-success d-block";
                            })
                            .catch(() => {
                                mensaje.textContent = "❌ Error al reenviar el correo de verificación.";
                                mensaje.className = "alert alert-danger d-block";
                            });
                        });
                    }
                }
            })
            .catch(() => {
                document.getElementById("infoUsuario").innerHTML = `
                    <div class="alert alert-danger mt-3">
                        ⚠️ Error al cargar tus datos. Intenta nuevamente.
                    </div>`;
            });
    })
    .catch(() => {
        // Error al verificar sesión
    });

    const linkPedidos = document.getElementById("linkPedidos");
    const linkPerfil = document.getElementById("linkPerfil");
    const seccionPedidos = document.getElementById("seccionPedidos");
    const seccionPerfil = document.getElementById("seccionPerfil");

    if (linkPedidos && linkPerfil && seccionPedidos && seccionPerfil) {
        linkPedidos.addEventListener("click", function (e) {
            e.preventDefault();
            seccionPedidos.classList.remove("d-none");
            seccionPerfil.classList.add("d-none");
            linkPedidos.classList.add("active", "fw-bold", "text-primary");
            linkPerfil.classList.remove("active", "fw-bold", "text-primary");
        });

        linkPerfil.addEventListener("click", function (e) {
            e.preventDefault();
            seccionPerfil.classList.remove("d-none");
            seccionPedidos.classList.add("d-none");
            linkPerfil.classList.add("active", "fw-bold", "text-primary");
            linkPedidos.classList.remove("active", "fw-bold", "text-primary");
        });
    }

    const btnEditar = document.querySelector("#infoUsuario .btn");
    const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
    const formEditar = document.getElementById("formEditarUsuario");
    const alerta = document.getElementById("alertaModal");

    if (btnEditar && modal && formEditar && alerta) {
        btnEditar.addEventListener("click", () => {
            document.getElementById("editNombre").value = nombreActual;
            document.getElementById("editApellido").value = apellidoActual;
            document.getElementById("editTelefono").value = telefonoActual;
            document.getElementById("editDireccion").value = direccionActual;
            document.getElementById("editEmail").value = document.getElementById("emailUsuario").textContent || "";

            alerta.classList.add("d-none");
            modal.show();
        });

        formEditar.addEventListener("submit", (e) => {
            e.preventDefault();

            const datos = {
                nombre: document.getElementById("editNombre").value,
                apellido: document.getElementById("editApellido").value,
                telefono: document.getElementById("editTelefono").value,
                direccion: document.getElementById("editDireccion").value,
                email: document.getElementById("editEmail").value
            };

            if (datos.telefono && !/^\d{9}$/.test(datos.telefono)) {
                alerta.textContent = "⚠️ El teléfono debe tener 9 dígitos.";
                alerta.className = "alert alert-warning";
                alerta.classList.remove("d-none");
                return;
            }

            fetch("/usuario/actualizar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(respuesta => {
                alerta.textContent = respuesta.mensaje;
                alerta.className = "alert alert-success";
                alerta.classList.remove("d-none");

                const nombreCompleto = `${datos.nombre} ${datos.apellido}`.trim();
                document.getElementById("nombreUsuario").textContent = nombreCompleto;
                document.getElementById("telefonoUsuario").textContent = datos.telefono || "No especificado";
                document.getElementById("direccionUsuario").textContent = datos.direccion || "No especificada";

                nombreActual = datos.nombre;
                apellidoActual = datos.apellido;
                telefonoActual = datos.telefono;
                direccionActual = datos.direccion;

                setTimeout(() => {
                    alerta.classList.add("d-none");
                    modal.hide();
                }, 2000);
            })
            .catch(() => {
                alerta.textContent = "❌ Error al actualizar tus datos. Intenta de nuevo.";
                alerta.className = "alert alert-danger";
                alerta.classList.remove("d-none");

                setTimeout(() => alerta.classList.add("d-none"), 3000);
            });
        });
    }

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
                if (!res.ok) throw new Error();
                return res.text();
            })
            .then(data => {
                alertaCambio.classList.remove("d-none");
                alertaCambio.className = "alert alert-success";
                alertaCambio.textContent = data;
            })
            .catch(() => {
                alertaCambio.classList.remove("d-none");
                alertaCambio.className = "alert alert-danger";
                alertaCambio.textContent = "❌ Error al enviar el correo. Intenta más tarde.";
            });
        });
    }
});

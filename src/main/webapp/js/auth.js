// ✅ Validar contraseñas en el registro
function validarRegistro() {
    const password = document.getElementById("contrasenia").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");

    if (password !== confirmPassword) {
        passwordError.style.display = "block";
        return false;
    }

    passwordError.style.display = "none";
    return true;
}

// ✅ Verificar si el correo ya existe
function verificarCorreo() {
    var emailInput = document.getElementById("regEmail");
    var emailError = document.getElementById("emailError");

    if (emailInput.value === "existe@correo.com") {
        mostrarNotificacion("Error", "❌ Este correo ya está registrado.", "error");
    } else {
        emailError.style.display = "none";
    }
}

// ✅ Obtener el token desde las cookies
function obtenerTokenDesdeCookies() {
    const match = document.cookie.match(new RegExp('(^| )SESSIONID=([^;]+)'));
    return match ? match[2] : null;
}

// ✅ Mostrar notificaciones con modal de Bootstrap
function mostrarNotificacion(titulo, mensaje, tipo) {
    document.getElementById("notificationModalLabel").innerText = titulo;
    document.getElementById("notificationMessage").innerText = mensaje;

    var modal = new bootstrap.Modal(document.getElementById("notificationModal"));
    modal.show();

    setTimeout(() => {
        modal.hide();
    }, 1500);
}

// ✅ Registrar usuario
document.getElementById("registerForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (!validarRegistro()) return;

    const formData = new FormData(this);

    try {
        const response = await fetch(this.action, {
            method: "POST",
            body: new URLSearchParams(formData)
        });

        const data = await response.json();

        if (response.ok) {
            mostrarNotificacion("Éxito", data.mensaje || "✅ Registro exitoso!", "success");
            setTimeout(() => location.reload(), 1500);
        } else {
            mostrarNotificacion("Error", data.mensaje || "❌ Error en el registro.", "error");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});

// ✅ Iniciar sesión
document.getElementById("loginForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch(this.action, {
            method: "POST",
            body: new URLSearchParams(formData)
        });

        const data = await response.json();

        if (response.ok) {
            mostrarNotificacion("Éxito", data.mensaje || "✅ Inicio de sesión exitoso!", "success");

            setTimeout(() => {
                var loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
                if (loginModal) loginModal.hide();
                location.reload();
            }, 1500);
        } else {
            mostrarNotificacion("Error", data.mensaje || "❌ Credenciales incorrectas.", "error");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});

// ✅ Verificar sesión y actualizar la UI
async function verificarSesion() {
    try {
        const response = await fetch("/auth/verificar-sesion");
        const data = await response.json();

        console.log("🔍 Respuesta del servidor:", data);

        if (data.sesionActiva) {
            console.log("✅ Usuario autenticado:", data);

            localStorage.setItem("usuarioRol", data.rol);
            localStorage.setItem("usuarioNombre", data.nombreUsuario);

            // Mostrar "Mi Cuenta" y actualizar el nombre del usuario
            const userManager = document.getElementById("userManager");
            const userName = document.getElementById("userName");
            const profileLink = document.getElementById("profileLink");

            if (userManager) userManager.style.display = "block";
            if (userName) userName.textContent = data.nombreUsuario;

            // Cambiar el enlace del perfil según el rol
            if (profileLink) {
                profileLink.href = data.rol === "ROLE_ADMIN" ? "/admin" : "/adminUser";
                console.log("🔗 Enlace de perfil actualizado:", profileLink.href);
            } else {
                console.warn("⚠ No se encontró el enlace de perfil en el DOM.");
            }
        } else {
            console.warn("⚠ No hay sesión activa.");
            localStorage.removeItem("usuarioRol");
            localStorage.removeItem("usuarioNombre");
        }
    } catch (error) {
        console.error("❌ Error al verificar sesión:", error);
    }
}

// ✅ Ejecutar verificación cuando cargue la página
document.addEventListener("DOMContentLoaded", verificarSesion);

// ✅ Manejo del modal de inicio de sesión
document.addEventListener("DOMContentLoaded", function () {
    var modalElement = document.getElementById("loginModal");
    var accountIcon = document.querySelector(".account");
    var closeModalButton = document.getElementById("closeModalButton");

    var loginModal = new bootstrap.Modal(modalElement);

    if (accountIcon) {
        accountIcon.addEventListener("click", function(event) {
            event.preventDefault();
            loginModal.show();
            verificarSesion();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", function() {
            loginModal.hide();
        });
    }

    // Botón de cerrar sesión
    var logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            fetch("/auth/logout", {
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                console.log("🔴 Sesión cerrada:", data.mensaje);
                location.reload();
            })
            .catch(error => console.error("❌ Error cerrando sesión:", error));
        });
    } else {
        console.warn("⚠ Botón de cerrar sesión no encontrado en el DOM.");
    }
});

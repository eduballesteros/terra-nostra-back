// authForm.js

// Validar contraseñas
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

// Mostrar notificación
function mostrarNotificacion(titulo, mensaje, tipo) {
    document.getElementById("notificationModalLabel").innerText = titulo;
    document.getElementById("notificationMessage").innerText = mensaje;

    const modal = new bootstrap.Modal(document.getElementById("notificationModal"));
    modal.show();

    setTimeout(() => modal.hide(), 1500);
}

// Enviar formulario de registro
document.getElementById("registerForm")?.addEventListener("submit", async function (event) {
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

// Enviar formulario de login
document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
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
            setTimeout(() => location.reload(), 1500);
        } else {
            mostrarNotificacion("Error", data.mensaje || "❌ Credenciales incorrectas.", "error");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
});

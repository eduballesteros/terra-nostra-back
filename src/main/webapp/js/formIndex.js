// Función para obtener el token desde las cookies
function obtenerTokenDesdeCookies() {
    const match = document.cookie.match(new RegExp('(^| )authToken=([^;]+)'));
    return match ? match[2] : null; // Retorna el token si existe
}

// Función para mostrar una notificación
function mostrarNotificacion(titulo, mensaje, tipo) {
    document.getElementById("notificationModalLabel").innerText = titulo;
    document.getElementById("notificationMessage").innerText = mensaje;

    var modal = new bootstrap.Modal(document.getElementById("notificationModal"));
    modal.show();

    // Ocultar el modal automáticamente después de 3 segundos
    setTimeout(() => {
        modal.hide();
    }, 3000);
}

// Muestra la notificación en caso de éxito o error de registro/inicio de sesión
document.addEventListener("DOMContentLoaded", function () {
    var modalElement = document.getElementById("loginModal");
    var accountIcon = document.querySelector(".account");
    var closeModalButton = document.getElementById("closeModalButton");

    var loginModal = new bootstrap.Modal(modalElement); // ✅ Crear instancia del modal correctamente

    // Abrir modal al hacer clic en el icono de usuario
    accountIcon.addEventListener("click", function(event) {
        event.preventDefault();
        loginModal.show(); // ✅ Abre el modal correctamente
    });

    // Cerrar modal al pulsar el botón de cierre
    closeModalButton.addEventListener("click", function() {
        loginModal.hide(); // ✅ Cierra el modal correctamente
    });

    // Estado para controlar la vista (registro o login)
    var isRegister = false;

    // Función para alternar entre Registro e Inicio de Sesión
    window.toggleForm = function() {
        isRegister = !isRegister;
        if (isRegister) {
            document.getElementById("modalTitle").textContent = "REGISTRO";
            document.getElementById("registerForm").style.display = "block";
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("loginForm").reset(); // Limpiar formulario de login
        } else {
            showLogin();
        }
    };

    function showLogin() {
        isRegister = false;
        document.getElementById("modalTitle").textContent = "INICIO DE SESIÓN";
        document.getElementById("registerForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
        document.getElementById("registerForm").reset(); // Limpiar formulario de registro
    }

    // Manejo del formulario de registro con AJAX
    document.getElementById("registerForm").onsubmit = async function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

        const formData = new FormData(this); // Obtener los datos del formulario

        // Realizar la solicitud AJAX
        const response = await fetch(this.action, {
            method: "POST",
            body: new URLSearchParams(formData) // Enviar los datos del formulario
        });

        const data = await response.json(); // Obtener la respuesta JSON

        if (response.ok) {
            // Almacenar el token JWT en la cookie
            const token = data.token;  // El token estará en la respuesta
            document.cookie = `authToken=${token}; path=/; secure; HttpOnly; SameSite=Strict`;

            mostrarNotificacion("Éxito", data.mensaje || "✅ Registro exitoso. Bienvenido a Terra Nostra!", "success");

            setTimeout(() => {}, 3000); // Recargar la página después del éxito
        } else {
            mostrarNotificacion("Error", data.mensaje || "❌ Error en el registro. Inténtalo nuevamente.", "error");
        }
    };

    // Manejo del formulario de inicio de sesión con AJAX
    document.getElementById("loginForm").onsubmit = async function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        // Realizar la solicitud AJAX al backend para inicio de sesión
        const response = await fetch(this.action, {
            method: "POST",
            body: new URLSearchParams(formData) // Enviar los datos del formulario
        });

        const data = await response.json();

        if (response.ok) {
            mostrarNotificacion("Éxito", data.mensaje || "✅ Inicio de sesión exitoso. Redirigiendo...", "success");

            // 🔥 Cerrar el modal de login después de éxito
            setTimeout(() => {
                loginModal.hide();
            }, 3000);
        } else {
            mostrarNotificacion("Error", data.mensaje || "❌ Credenciales incorrectas. Inténtalo de nuevo.", "error");
        }
    };
});

// Validación para el registro
function validarRegistro() {
    const password = document.getElementById("contrasenia").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");

    // Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
        passwordError.style.display = "block";
        return false; // Evita que se envíe el formulario si no coinciden
    }

    passwordError.style.display = "none";
    return true; // Permite el envío del formulario si las contraseñas coinciden
}

// Función de ejemplo para verificar el correo (simulación)
function verificarCorreo() {
    var emailInput = document.getElementById("email");
    var emailError = document.getElementById("emailError");
    if (emailInput.value === "existe@correo.com") {
        mostrarNotificacion("Error", "❌ Este correo ya está registrado.", "error");
    } else {
        emailError.style.display = "none";
    }
}

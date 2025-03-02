// Manejo del modal
document.addEventListener("DOMContentLoaded", function () {
    var modalElement = document.getElementById("loginModal");
    var accountIcon = document.querySelector(".account");
    var closeModalButton = document.getElementById("closeModalButton");

    var loginModal = new bootstrap.Modal(modalElement);

    accountIcon.addEventListener("click", function(event) {
        event.preventDefault();
        loginModal.show();
        verificarSesion();
    });

    closeModalButton.addEventListener("click", function() {
        loginModal.hide();
    });

    var isRegister = false;

    window.toggleForm = function() {
        isRegister = !isRegister;
        if (isRegister) {
            document.getElementById("modalTitle").textContent = "REGISTRARSE";
            document.getElementById("registerForm").style.display = "block";
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("loginForm").reset();
        } else {
            mostrarLogin();
        }
    };

    function mostrarLogin() {
        isRegister = false;
        document.getElementById("modalTitle").textContent = "INICIAR SESIÓN";
        document.getElementById("registerForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
        document.getElementById("registerForm").reset();
    }

    function verificarSesion() {
        fetch("/auth/verificar-sesion", {
            method: "GET",
            credentials: "include" // Para incluir las cookies en la solicitud
        })
        .then(response => response.json())
        .then(data => {
            console.log("🔍 Respuesta del servidor:", data);

            if (data.sesionActiva) {
                // 🔹 Usuario autenticado: Mostrar "Mi Cuenta" y ocultar formularios
                document.getElementById("userManager").style.display = "block";
                document.getElementById("loginForm").style.display = "none";
                document.getElementById("registerForm").style.display = "none";

                // Actualizar el nombre del usuario en el modal
                document.getElementById("userName").textContent = data.nombreUsuario || "Usuario";
            } else {
                // 🔹 Usuario NO autenticado: Mostrar formularios y ocultar "Mi Cuenta"
                document.getElementById("userManager").style.display = "none";
                document.getElementById("loginForm").style.display = "block";
                document.getElementById("registerForm").style.display = "none";
            }
        })
        .catch(error => console.error("❌ Error verificando sesión:", error));
    }

    function cerrarSesion() {
        fetch("/auth/logout", {
            method: "POST",
            credentials: "include" // Asegura que se envíen las cookies
        })
        .then(response => response.json())
        .then(data => {
            console.log("🔴 Sesión cerrada:", data.mensaje);
            location.reload(); // Recargar la página para reflejar los cambios
        })
        .catch(error => console.error("❌ Error cerrando sesión:", error));
    }

    // Verificar si el botón de cerrar sesión existe antes de agregar el evento
    var logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", cerrarSesion);
    } else {
        console.warn("⚠️ Botón de cerrar sesión no encontrado en el DOM.");
    }

    // Llamar a la verificación de sesión UNA SOLA VEZ
    verificarSesion();
});

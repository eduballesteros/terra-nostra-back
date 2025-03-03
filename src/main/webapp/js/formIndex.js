// Manejo del modal
document.addEventListener("DOMContentLoaded", function () {
    var modalElement = document.getElementById("loginModal");
    var accountIcon = document.querySelector(".account");
    var closeModalButton = document.getElementById("closeModalButton");

    var loginModal = null;

    if (modalElement) {
        loginModal = new bootstrap.Modal(modalElement);
    } else {
        console.warn("⚠ El modal de inicio de sesión no se encontró en el DOM.");
    }

    if (accountIcon) {
        accountIcon.addEventListener("click", function(event) {
            event.preventDefault();
            if (loginModal) {
                loginModal.show();
                verificarSesion();
            }
        });
    } else {
        console.warn("⚠ Icono de cuenta no encontrado.");
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", function() {
            if (loginModal) loginModal.hide();
        });
    }

    var isRegister = false;

    window.toggleForm = function() {
        isRegister = !isRegister;
        var modalTitle = document.getElementById("modalTitle");
        var registerForm = document.getElementById("registerForm");
        var loginForm = document.getElementById("loginForm");

        if (modalTitle && registerForm && loginForm) {
            if (isRegister) {
                modalTitle.textContent = "REGISTRARSE";
                registerForm.style.display = "block";
                loginForm.style.display = "none";
                loginForm.reset();
            } else {
                mostrarLogin();
            }
        } else {
            console.warn("⚠ Elementos del formulario no encontrados.");
        }
    };

    function mostrarLogin() {
        isRegister = false;
        var modalTitle = document.getElementById("modalTitle");
        var registerForm = document.getElementById("registerForm");
        var loginForm = document.getElementById("loginForm");

        if (modalTitle && registerForm && loginForm) {
            modalTitle.textContent = "INICIAR SESIÓN";
            registerForm.style.display = "none";
            loginForm.style.display = "block";
            registerForm.reset();
        } else {
            console.warn("⚠ Elementos del formulario no encontrados.");
        }
    }

    function verificarSesion() {
        fetch("/auth/verificar-sesion", {
            method: "GET",
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            console.log("🔍 Respuesta del servidor:", data);

            var userManager = document.getElementById("userManager");
            var userName = document.getElementById("userName");
            var loginForm = document.getElementById("loginForm");
            var registerForm = document.getElementById("registerForm");

            if (data.sesionActiva) {
                if (userManager) userManager.style.display = "block";
                if (loginForm) loginForm.style.display = "none";
                if (registerForm) registerForm.style.display = "none";
                if (userName) userName.textContent = data.nombreUsuario || "Usuario";
            } else {
                if (userManager) userManager.style.display = "none";
                if (loginForm) loginForm.style.display = "block";
                if (registerForm) registerForm.style.display = "none";
            }
        })
        .catch(error => console.error("❌ Error verificando sesión:", error));
    }

    function cerrarSesion() {
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
    }

    var logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", cerrarSesion);
    } else {
        console.warn("⚠️ Botón de cerrar sesión no encontrado en el DOM.");
    }

    verificarSesion();
});

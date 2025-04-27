// authModal.js
document.addEventListener("DOMContentLoaded", function () {
    const loginModalElement = document.getElementById("loginModal");
    const recuperarPasswordModalElement = document.getElementById("recuperarPasswordModal");

    const accountIcon = document.querySelector(".account");
    const closeModalButton = document.getElementById("closeModalButton");

    const modalTitle = document.getElementById("modalTitle");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const userManager = document.getElementById("userManager");
    const userName = document.getElementById("userName");
    const profileLink = document.getElementById("profileLink");

    let loginModal = null;
    let recuperarPasswordModal = null;
    let isRegister = false;

    if (loginModalElement) {
        loginModal = new bootstrap.Modal(loginModalElement);
    }
    if (recuperarPasswordModalElement) {
        recuperarPasswordModal = new bootstrap.Modal(recuperarPasswordModalElement);
    }

    if (accountIcon) {
        accountIcon.addEventListener("click", function (e) {
            e.preventDefault();
            if (loginModal) loginModal.show();
            verificarSesion();
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", function () {
            if (loginModal) loginModal.hide();
        });
    }

    window.toggleForm = function () {
        isRegister = !isRegister;

        if (isRegister) {
            modalTitle.textContent = "REGISTRARSE";
            registerForm.style.display = "block";
            loginForm.style.display = "none";
            registerForm.reset();
        } else {
            modalTitle.textContent = "INICIAR SESIÓN";
            registerForm.style.display = "none";
            loginForm.style.display = "block";
            loginForm.reset();
        }
    };

    window.abrirRecuperarContrasenia = function () {
        const loginModalElement = document.getElementById("loginModal");
        const loginModal = bootstrap.Modal.getInstance(loginModalElement) || new bootstrap.Modal(loginModalElement);
        loginModal.hide();

        const recuperarModalElement = document.getElementById("recuperarPasswordModal");
        const recuperarModal = bootstrap.Modal.getInstance(recuperarModalElement) || new bootstrap.Modal(recuperarModalElement);
        recuperarModal.show();
    };

    window.cerrarModalRecuperacion = function () {
        const recuperarModalElement = document.getElementById("recuperarPasswordModal");
        const recuperarModal = bootstrap.Modal.getInstance(recuperarModalElement) || new bootstrap.Modal(recuperarModalElement);
        recuperarModal.hide();

        const loginModalElement = document.getElementById("loginModal");
        const loginModal = bootstrap.Modal.getInstance(loginModalElement) || new bootstrap.Modal(loginModalElement);
        loginModal.show();
    };

    function verificarSesion() {
        fetch("/auth/verificar-sesion", {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.sesionActiva) {
                if (userManager) userManager.style.display = "block";
                if (loginForm) loginForm.style.display = "none";
                if (registerForm) registerForm.style.display = "none";
                if (userName) userName.textContent = data.nombreUsuario || "Usuario";
                if (profileLink) {
                    profileLink.href = data.rol === "ROLE_ADMIN" ? "/admin" : "/infoUser";
                }

                const saludoHeader = document.getElementById("saludoHeader");
                if (saludoHeader) {
                    saludoHeader.textContent = `Hola, ${data.nombreUsuario}`;
                }
            } else {
                if (userManager) userManager.style.display = "none";
                if (loginForm) loginForm.style.display = "block";
                if (registerForm) registerForm.style.display = "none";

                const saludoHeader = document.getElementById("saludoHeader");
                if (saludoHeader) {
                    saludoHeader.textContent = "";
                }
            }
        })
        .catch(error => console.error("❌ Error verificando sesión:", error));
    }

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            fetch("/auth/logout", {
                method: "POST",
                credentials: "include"
            })
            .then(res => res.json())
            .then(data => {
                console.log("🔴 Sesión cerrada:", data.mensaje);
                location.reload();
            })
            .catch(error => console.error("❌ Error cerrando sesión:", error));
        });
    }

    verificarSesion();
});

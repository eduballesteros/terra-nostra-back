<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Capturar el mensaje de la URL
    String mensaje = request.getParameter("mensaje");
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terra Nostra - Productos Naturales</title>
<link rel="stylesheet" type="text/css" href="css/index.css">
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
	crossorigin="anonymous">
<link rel="icon" href="images/favicon.ico" type="image/x-icon">

</head>
<body>

    <%
            if ("success".equals(mensaje)) {
        %>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                ✅ ¡Registro exitoso! Bienvenido a Terra Nostra.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <%
            } else if ("error".equals(mensaje)) {
        %>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ❌ Error en el registro. Por favor, intenta nuevamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <%
            }
        %>

	<!-- Header -->
	<header class="header">
		<!-- Logo de la tienda -->
		<div class="logo">
			<img src="images/logo.webp" alt="Logo de la tienda" />
			<h4>Terra Nostra</h4>
		</div>

		<!-- Barra de navegación -->
		<nav class="navigation">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/shop">Productos</a></li>
				<li><a href="/about">Sobre Nosotros</a></li>
				<li><a href="/blog">Blog</a></li>
				<li><a href="/contact">Contacto</a></li>
			</ul>
		</nav>

		<!-- Íconos de la cabecera -->
		<div class="header-icons">
			<a class="account" aria-label="Cuenta de usuario" href="#"> <img
				src="icons/user.svg" alt="Icono de usuario" />
			</a> <a class="cart" aria-label="Carrito de compras" href="#"> <img
				src="icons/cart.svg" alt="Icono del carrito" />
			</a>
		</div>
	</header>

	<!-- Carrusel de imágenes -->
	<div id="carouselExampleDark" class="carousel slide custom-carousel"
		data-bs-ride="carousel">
		<div class="carousel-indicators">
			<button type="button" data-bs-target="#carouselExampleDark"
				data-bs-slide-to="0" class="active" aria-current="true"
				aria-label="Slide 1"></button>
			<button type="button" data-bs-target="#carouselExampleDark"
				data-bs-slide-to="1" aria-label="Slide 2"></button>
			<button type="button" data-bs-target="#carouselExampleDark"
				data-bs-slide-to="2" aria-label="Slide 3"></button>
		</div>
		<div class="carousel-inner">
			<div class="carousel-item active" data-bs-interval="10000">
				<img src="images/magnesio.webp" class="d-block w-100" alt="Magnesio">
			</div>
			<div class="carousel-item" data-bs-interval="2000">
				<img src="images/ashwagandha.webp" class="d-block w-100"
					alt="Ashwagandha">
			</div>
			<div class="carousel-item">
				<img src="images/canela.webp" class="d-block w-100" alt="Canela">
			</div>
		</div>
		<button class="carousel-control-prev" type="button"
			data-bs-target="#carouselExampleDark" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span> <span
				class="visually-hidden">Previous</span>
		</button>
		<button class="carousel-control-next" type="button"
			data-bs-target="#carouselExampleDark" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span> <span
				class="visually-hidden">Next</span>
		</button>
	</div>

	<!-- Sección de mejores productos -->
	<p class="text">Nuestros mejores productos</p>
	<div class="search-box">
		<div class="input-group">
			<input type="text" class="form-control search-input"
				placeholder="¿Qué estás buscando?" aria-describedby="button-search">
		</div>
	</div>

	<!-- Sección de características -->
	<section class="container features-container">
		<div class="features-grid">
			<div class="feature-box">
				<img
					src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-1-rs.png"
					class="img-responsive feature-icon" alt="Envío en 24/48h">
				<div class="feature-content">Envío en 24/48h</div>
				<a href="https://www.biosano.es/envios-y-devoluciones"
					class="feature-link">Saber más</a>
			</div>
			<div class="feature-box">
				<img
					src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-2-rs.png"
					class="img-responsive feature-icon" alt="Devoluciones fáciles">
				<div class="feature-content">Devoluciones fáciles</div>
				<a href="https://www.biosano.es/politica-de-devoluciones"
					class="feature-link">Saber más</a>
			</div>
			<div class="feature-box">
				<img
					src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-3-rs.png"
					class="img-responsive feature-icon" alt="Pago 100% seguro">
				<div class="feature-content">Pago 100% seguro</div>
				<a href="https://www.biosano.es/formas-de-pago" class="feature-link">Saber
					más</a>
			</div>
			<div class="feature-box">
				<img
					src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-4-rs.png"
					class="img-responsive feature-icon" alt="Mejor precio garantizado">
				<div class="feature-content">Mejor precio garantizado</div>
				<a href="https://www.biosano.es/promociones" class="feature-link">Saber
					más</a>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer>
		<div class="container text-center text-md-start">
			<div class="row">
				<div class="col-md-3">
					<h5 class="text-success">Terra Nostra</h5>
					<p>Productos naturales para una vida mejor.</p>
				</div>
				<div class="col-md-3">
					<h5 class="text-success">Enlaces</h5>
					<ul class="list-unstyled">
						<li><a href="#" class="text-light">Sobre Nosotros</a></li>
						<li><a href="#" class="text-light">Términos y Condiciones</a></li>
						<li><a href="#" class="text-light">Política de Privacidad</a></li>
					</ul>
				</div>
				<div class="col-md-3">
					<h5 class="text-success">Síguenos</h5>
					<a href="#" class="text-light me-2"><i class="bi bi-facebook"></i></a>
					<a href="#" class="text-light me-2"><i class="bi bi-instagram"></i></a>
					<a href="#" class="text-light"><i class="bi bi-twitter"></i></a>
				</div>
				<div class="col-md-3">
					<h5 class="text-success">Suscríbete</h5>
					<form>
						<div class="input-group mb-3">
							<input type="email" class="form-control" placeholder="Tu email">
							<button class="btn btn-success" type="submit">Enviar</button>
						</div>
					</form>
				</div>
			</div>
			<div class="text-center mt-3 border-top pt-2">
				<p class="mb-0">&copy; 2025 Terra Nostra. Todos los derechos
					reservados.</p>
			</div>
		</div>
	</footer>

	<!-- Modal de Inicio de Sesión / Registro -->
	<div id="loginModal" class="modal" style="display: none;">
		<div class="modal-content">
			<!-- Botón para cerrar el modal -->
			<button class="close-modal" id="closeModalButton">×</button>
			<div class="container">
				<div class="form_area">
					<p class="modal-title" id="modalTitle">INICIO DE SESIÓN</p>

					<!-- Formulario de Registro -->
					<form action="/usuario/registrar" method="POST" id="registerForm"
						style="display: none;" onsubmit="return validarRegistro();">
						<div class="form_group">
							<label class="sub_title" for="regEmail">Email</label> <input
								placeholder="Ingresa tu email" id="email" name="email"
								class="form_style" type="email" required
								onblur="verificarCorreo()" />
							<p class="error" id="emailError" style="display: none;">Este
								correo ya está registrado</p>
						</div>

						<div class="form_group">
							<label class="sub_title" for="nombre">Nombre</label> <input
								placeholder="Ingresa tu nombre" id="nombre" name="nombre"
								class="form_style" required />
						</div>

						<div class="form_group">
							<label class="sub_title" for="apellido">Apellido</label> <input
								placeholder="Ingresa tu apellido" id="apellido" name="apellido"
								class="form_style" required />
						</div>

						<div class="form_group">
                            <label class="sub_title" for="contrasenia">Contraseña</label>
                            <input
                                placeholder="Crea una contraseña"
                                id="contrasenia"
                                name="contrasenia"
                                class="form_style"
                                type="password"
                                required minlength="6" />

                                <p class="error" id="passwordError" style="display: none; color: red;">
                                        ❌ La contraseña debe tener al menos 6 caracteres.
                                    </p>

                        </div>

						<div class="form_group">
							<label class="sub_title" for="confirmPassword">Confirmar
								Contraseña</label> <input placeholder="Repite tu contraseña"
								id="confirmPassword" name="confirmPassword" class="form_style"
								type="password" required />
							<p class="error" id="passwordError" style="display: none;">Las
								contraseñas no coinciden</p>
						</div>

						<button class="modal-btn" type="submit">REGISTRARSE</button>
						<p class="line">
							¿Ya tienes cuenta? <a class="link" href="javascript:void(0)"
								onclick="toggleForm()">Inicia Sesión</a>
						</p>
					</form>

					<!-- Formulario de Inicio de Sesión -->
					<form action="/auth/login" method="POST" id="loginForm"
						onsubmit="return validarLogin();">
						<div class="form_group">
							<label class="sub_title" for="loginEmail">Email</label> <input
								placeholder="Ingresa tu email" id="loginEmail" name="email"
								class="form_style" type="email" required />
						</div>

						<div class="form_group">
							<label class="sub_title" for="loginPassword">Contraseña</label> <input
								placeholder="Ingresa tu contraseña" id="loginPassword"
								name="password" class="form_style" type="password" required />
						</div>

						<button class="modal-btn" type="submit">INICIA SESIÓN</button>
						<p class="line">
							¿No tienes cuenta? <a class="link" href="javascript:void(0)"
								onclick="toggleForm()">Regístrate!</a>
						</p>
					</form>

				</div>
			</div>
		</div>
	</div>

	<!-- Scripts -->

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>


	<script>
		document
				.addEventListener(
						"DOMContentLoaded",
						function() {
							var modal = document.getElementById("loginModal");
							var accountIcon = document
									.querySelector(".account");
							var closeModalButton = document
									.getElementById("closeModalButton");

							// Estado para controlar la vista (registro o login)
							var isRegister = false;

							// Abrir modal al hacer clic en el icono de usuario
							accountIcon.addEventListener("click", function(
									event) {
								event.preventDefault();
								modal.style.display = "flex";
								showLogin(); // Mostrar inicio de sesión por defecto
							});

							// Cerrar modal al pulsar el botón de cierre
							closeModalButton.addEventListener("click",
									function() {
										modal.style.display = "none";
									});

							// Función para alternar entre Registro e Inicio de Sesión
							window.toggleForm = function() {
								isRegister = !isRegister;
								if (isRegister) {
									document.getElementById("modalTitle").textContent = "REGISTRO";
									document.getElementById("registerForm").style.display = "block";
									document.getElementById("loginForm").style.display = "none";
									document.getElementById("loginForm")
											.reset(); // Limpiar formulario de login
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

							// Validación para el registro (ejemplo)
							document.getElementById("registerForm").onsubmit = function() {
								if (!validarRegistro()) {
									return false; // Evita el envío del formulario
								}
							};

							// Validación para el inicio de sesión (ejemplo)
							document.getElementById("loginForm").onsubmit = function() {
								if (!validarLogin()) {
									return false; // Evita el envío del formulario
								}
							};
						});

		// Ejemplo de validación para el registro
		function validarRegistro() {
            const password = document.getElementById("contrasenia").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const passwordError = document.getElementById("passwordError");

            console.log("Contraseña ingresada:", password); // Verifica si el campo está capturando datos correctamente

            if (password !== confirmPassword) {
                passwordError.style.display = "block";
                return false; // Evita el envío del formulario si no coinciden
            }

            passwordError.style.display = "none";
            return true; // Permite el envío del formulario
        }


		// Ejemplo de validación para el inicio de sesión
		function validarLogin() {
			const loginEmail = document.getElementById("loginEmail").value;
			const loginPassword = document.getElementById("loginPassword").value;

			// Aquí puedes añadir lógica de validación adicional (ej. verificar correo y contraseña)
			if (loginEmail === "" || loginPassword === "") {
				alert("Por favor, complete todos los campos.");
				return false; // Evita el envío del formulario
			}
			return true; // Permite el envío del formulario
		}

		// Función de ejemplo para verificar el correo (simulación)
		function verificarCorreo() {
			var emailInput = document.getElementById("email");
			var emailError = document.getElementById("emailError");
			if (emailInput.value === "existe@correo.com") {
				emailError.style.display = "block";
			} else {
				emailError.style.display = "none";
			}
		}
	</script>


</body>
</html>

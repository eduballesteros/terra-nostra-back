<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
    String mensaje = request.getParameter("mensaje");
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Nostra - Productos Naturales</title>

    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/index.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/header.css">

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossorigin="anonymous">

    <!-- Icono -->
    <link rel="icon" href="${pageContext.request.contextPath}/images/favicon.ico" type="image/x-icon">

    <!-- Google Login -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>

    <!-- Header -->
    <jsp:include page="/includes/header.jsp" />

    <!-- Carrusel de imágenes -->
    <div id="carouselExampleDark" class="carousel slide custom-carousel" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active" data-bs-interval="10000">
                <img src="${pageContext.request.contextPath}/images/magnesio.webp" class="d-block w-100" alt="Magnesio">
            </div>
            <div class="carousel-item" data-bs-interval="2000">
                <img src="${pageContext.request.contextPath}/images/ashwagandha.webp" class="d-block w-100" alt="Ashwagandha">
            </div>
            <div class="carousel-item">
                <img src="${pageContext.request.contextPath}/images/canela.webp" class="d-block w-100" alt="Canela">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
        </button>
    </div>

    <!-- Sección de mejores productos -->
    <p class="text text-center mt-4">Nuestros mejores productos</p>

    <div class="container mt-4">
        <div class="row" id="mejoresProductos">
            <!-- Los productos destacados se insertarán aquí dinámicamente -->
        </div>
    </div>

    <!-- Sección de características -->
    <section class="container features-container mt-5 mb-5">
        <div class="features-grid">
            <div class="feature-box">
                <img src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-1-rs.png" class="img-responsive feature-icon" alt="Envío en 24/48h">
                <div class="feature-content">Envío en 24/48h</div>
                <a href="https://www.biosano.es/envios-y-devoluciones" class="feature-link">Saber más</a>
            </div>
            <div class="feature-box">
                <img src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-2-rs.png" class="img-responsive feature-icon" alt="Devoluciones fáciles">
                <div class="feature-content">Devoluciones fáciles</div>
                <a href="https://www.biosano.es/politica-de-devoluciones" class="feature-link">Saber más</a>
            </div>
            <div class="feature-box">
                <img src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-3-rs.png" class="img-responsive feature-icon" alt="Pago 100% seguro">
                <div class="feature-content">Pago 100% seguro</div>
                <a href="https://www.biosano.es/formas-de-pago" class="feature-link">Saber más</a>
            </div>
            <div class="feature-box">
                <img src="https://www.biosano.es/cdnassets/redesign/icon/icon-home-4-rs.png" class="img-responsive feature-icon" alt="Mejor precio garantizado">
                <div class="feature-content">Mejor precio garantizado</div>
                <a href="https://www.biosano.es/promociones" class="feature-link">Saber más</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-light pt-4">
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
                <p class="mb-0">&copy; 2025 Terra Nostra. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/cargarProductos.js"></script>
</body>
</html>

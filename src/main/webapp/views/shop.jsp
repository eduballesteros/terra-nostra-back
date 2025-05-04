<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda - Terra Nostra</title>

    <!-- Estilos -->
    <link rel="stylesheet" href="css/shop.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
</head>
<body>

    <!-- Header común -->
    <jsp:include page="/includes/header.jsp" />

    <main class="container-fluid mt-4 px-4">
        <!-- Buscador -->
        <div class="row mb-4">
            <div class="col-12 d-flex justify-content-center flex-wrap">
                <input type="text" id="buscadorProductos" class="form-control me-2 mb-2 mb-md-0" placeholder="Buscar productos...">
            </div>
        </div>

        <!-- Zona principal -->
        <div class="row">
            <!-- Panel lateral -->
            <aside class="col-md-3 mb-4">
                <div class="mb-4">
                    <h5 class="fw-bold">Categorías</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-decoration-none d-block py-1 categoria-link active" data-categoria="">Todas las categorías</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1 categoria-link" data-categoria="Suplementos Naturales">Suplementos Naturales</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1 categoria-link" data-categoria="Tés e Infusiones Naturales">Tés e Infusiones Naturales</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1 categoria-link" data-categoria="Superalimentos">Superalimentos</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1 categoria-link" data-categoria="Alimentación Saludable">Alimentación Saludable</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1 categoria-link" data-categoria="Cosmética Natural">Cosmética Natural</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1 categoria-link" data-categoria="Bienestar y Relax">Bienestar y Relax</a></li>
                    </ul>

                </div>

                <div>
                    <h5 class="fw-bold">Filtros</h5>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="filtroStock">
                        <label class="form-check-label" for="filtroStock">Solo disponibles</label>
                    </div>
                </div>
            </aside>

            <!-- Contenido de productos -->
            <section class="col-md-9">
                <h3 class="mb-4">Nuestros Productos</h3>

                <!-- Loader mientras se cargan los productos -->
                <div id="loaderProductos" class="text-center my-5">
                    <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2">Cargando productos...</p>
                </div>

                <!-- Contenedor de productos -->
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 d-none" id="contenedorProductos">
                    <!-- Aquí se cargarán los productos dinámicamente -->
                </div>
            </section>
        </div>
    </main>

    <!-- Scripts -->
    <script src="js/tienda.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</body>
</html>

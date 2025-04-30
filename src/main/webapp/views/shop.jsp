<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Nostra</title>
    <link rel="stylesheet" type="text/css" href="css/shop.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="css/header.css">
</head>
<body>

    <jsp:include page="/includes/header.jsp" />

    <main class="container mt-5">
        <!-- Buscador -->
        <div class="row mb-4">
            <div class="col-12 d-flex justify-content-center">
                <input type="text" id="buscadorProductos" class="form-control w-50 me-2" placeholder="Buscar productos...">
                <button class="btn btn-outline-dark" onclick="buscarProductos()">Buscar</button>
            </div>
        </div>

        <!-- Cuerpo de la tienda -->
        <div class="row">
            <!-- Panel lateral de filtros -->
            <aside class="col-md-3 mb-4">
                <div class="mb-4">
                    <h5 class="fw-bold">Categorías</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-decoration-none d-block py-1">Tés</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1">Vitaminas</a></li>
                        <li><a href="#" class="text-decoration-none d-block py-1">Suplementos</a></li>
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

            <!-- Grid de productos con mayor ancho -->
            <section class="col-md-9">
                <h3 class="mb-4">Nuestros Productos</h3>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 g-4" id="contenedorProductos">
                    <!-- Los productos se cargarán dinámicamente aquí -->
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

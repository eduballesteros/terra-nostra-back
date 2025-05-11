<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Detalle del Producto - Terra Nostra</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Estilos -->
    <link rel="stylesheet" href="css/shop.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/productos.css">

</head>
<body>

    <!-- Header común -->
    <jsp:include page="/includes/header.jsp" />

    <!-- Detalle de producto -->
    <main class="container my-5">
        <!-- Loader -->
        <div id="loaderProducto" class="loader-terra">
            <div class="spinner"></div>
            <p>Cargando producto...</p>
        </div>

        <!-- Detalle del producto -->
        <div id="productoDetalle" class="producto-detalle d-none row align-items-center">
            <!-- Imagen izquierda -->
            <div class="col-md-5 text-center mb-4 mb-md-0">
                <img id="imagenProducto" src="" alt="Imagen del producto" class="producto-imagen">
            </div>

            <!-- Info derecha -->
            <div class="col-md-7">
                <h1 id="nombreProducto" class="producto-nombre"></h1>
                <p id="descripcionProducto" class="producto-descripcion"></p>

                <div class="producto-precio-wrapper mb-2">
                    <span id="precioProducto"></span>
                </div>

                <p class="producto-stock">Disponibilidad: <span id="stockProducto"></span></p>

                <button id="btnAgregarCarrito" class="btn-agregar-carrito mt-4">
                    🛒 Añadir al carrito
                </button>
            </div>
        </div>
    </main>


    <!-- Scripts -->
    <script src="js/productos.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

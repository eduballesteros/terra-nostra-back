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
</head>
<body>
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
               <li><a href="/" >Home</a></li>
               <li><a href="/shop" class="active">Productos</a></li>
               <li><a href="/about">Sobre Nosotros</a></li>
               <li><a href="/blog">Blog</a></li>
               <li><a href="/contact">Contacto</a></li>
           </ul>
       </nav>

       <!-- Íconos de la cabecera -->
       <div class="header-icons">
           <a class="account" aria-label="Cuenta de usuario" href="#">
               <img src="icons/user.svg" alt="Icono de usuario" />
           </a>
           <a class="cart" aria-label="Carrito de compras" href="#">
               <img src="icons/cart.svg" alt="Icono del carrito" />
           </a>
       </div>
   </header>


    <main class="container mt-5">
        <!-- Buscador -->
        <div class="row mb-4">
            <div class="col-12 d-flex justify-content-center">
                <input type="text" id="buscadorProductos" class="form-control w-50 me-2" placeholder="Buscar productos...">
                <button class="btn btn-outline-dark" onclick="buscarProductos()">Buscar</button>
            </div>
        </div>

        <div class="row">
            <!-- Panel lateral -->
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

            <!-- Grid de productos -->
            <section class="col-md-9">
                <h3 class="mb-4">Nuestros Productos</h3>
                <div class="row" id="contenedorProductos">
                    <!-- Los productos se cargarán dinámicamente aquí -->
                </div>
            </section>
        </div>
    </main>


    <!-- Scripts -->
    <script src="js/tienda.js"></script>
</body>
</html>

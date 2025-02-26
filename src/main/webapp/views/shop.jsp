<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Nostra</title>
    <link rel="stylesheet" type="text/css" href="css/index.css">
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

        <!-- Barra de navegacion -->
        <nav class="navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/product">Productos</a></li>
                <li><a href="/about">Sobre Nosotros</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contacto</a></li>
            </ul>
        </nav>

        <!-- iconos de la cabecera -->
        <div class="header-icons">
            <a class="account" aria-label="Cuenta de usuario" href="#">
                <img src="icons/user.svg" alt="Icono de usuario" />
            </a>
            <a class="cart" aria-label="Carrito de compras" href="#">
                <img src="icons/cart.svg" alt="Icono del carrito" />
            </a>
        </div>
    </header>
    </body>
</html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page session="true" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Terra Nostra</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/admin.css">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
</head>
<body>

<!-- Header -->
<header class="header bg-dark text-light py-3">
    <div class="container d-flex justify-content-between align-items-center">
        <div class="logo d-flex align-items-center">
            <img src="images/logo.webp" alt="Logo de la tienda" width="50">
            <h4 class="ms-3">Terra Nostra</h4>
        </div>
        <nav class="navigation">
            <ul class="nav">
                <li class="nav-item"><a class="nav-link text-light" href="/">Home</a></li>
                <li class="nav-item"><a class="nav-link text-light" href="/shop">Productos</a></li>
            </ul>
        </nav>
    </div>
</header>

<!-- Contenedor principal -->
<div class="container mt-5">

    <!-- Notificación Modal -->
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="notificationModalLabel">Notificación</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="notificationMessage"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Gestión de Usuarios -->
    <div class="container mt-4">
        <h2 class="text-center">Gestión de Usuarios</h2>

        <!-- Lista de usuarios -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="usuariosTableBody">
                <!-- Los usuarios se insertarán aquí con AJAX -->
            </tbody>
        </table>
    </div>


    <!-- Añadir Nuevo Producto -->
    <div class="card mb-4">
        <div class="card-header bg-success text-white">
            <h4 class="m-0">Añadir Nuevo Producto</h4>
        </div>
        <div class="card-body">
            <form id="formProducto" enctype="multipart/form-data">
                <div class="mb-3">
                    <label>Nombre:</label>
                    <input type="text" class="form-control" name="nombre" required>
                </div>
                <div class="mb-3">
                    <label>Descripción:</label>
                    <textarea class="form-control" name="descripcion" required></textarea>
                </div>
                <div class="mb-3">
                    <label>Precio:</label>
                    <input type="number" class="form-control" name="precio" step="0.01" required>
                </div>
                <div class="mb-3">
                    <label>Stock:</label>
                    <input type="number" class="form-control" name="stock" required>
                </div>
                <div class="mb-3">
                    <label>Categoría:</label>
                    <input type="text" class="form-control" name="categoria" required>
                </div>
                <div class="mb-3">
                    <label>Imagen:</label>
                    <input type="file" class="form-control" name="imagen">
                </div>
                <button type="submit" class="btn btn-success">Guardar Producto</button>
            </form>

            <!-- Mensaje de éxito/error -->
            <div id="mensaje" style="margin-top: 10px;"></div>
        </div>
    </div>


    <!-- Lista de Productos -->
    <div class="card mb-4">
        <div class="card-header bg-info text-white">
            <h4 class="m-0">Lista de Productos</h4>
        </div>
        <div class="card-body">
            <table class="table table-bordered table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Imagen</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody id="productosTableBody">
                    <!-- Los productos se insertarán aquí con AJAX -->
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- Modal de Edición de Usuario -->
<div class="modal fade" id="editarUsuarioModal" tabindex="-1" aria-labelledby="editarUsuarioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editarUsuarioModalLabel">Editar Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editarUsuarioForm">
                    <div class="mb-3">
                        <label for="editEmail" class="form-label">Correo Electrónico</label>
                        <input type="email" class="form-control" id="editEmail" name="email" readonly>
                    </div>
                    <div class="mb-3">
                        <label for="editNombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editNombre" name="nombre" required>
                    </div>
                    <div class="mb-3">
                        <label for="editApellido" class="form-label">Apellido</label>
                        <input type="text" class="form-control" id="editApellido" name="apellido" required>
                    </div>
                    <div class="mb-3">
                        <label for="editTelefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="editTelefono" name="telefono">
                    </div>
                    <div class="mb-3">
                        <label for="editDireccion" class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="editDireccion" name="direccion">
                    </div>
                    <div class="mb-3">
                        <label for="editRol" class="form-label">Rol</label>
                        <select class="form-select" id="editRol" name="rol">
                            <option value="ROLE_USER">Usuario</option>
                            <option value="ROLE_ADMIN">Administrador</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Edición de Producto -->
<div class="modal fade" id="editarProductoModal" tabindex="-1" aria-labelledby="editarProductoModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editarProductoModalLabel">Editar Producto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editarProductoForm">
                    <input type="hidden" id="editProductoId" name="id">

                    <div class="mb-3">
                        <label for="editNombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editNombre" name="nombre" required>
                    </div>

                    <div class="mb-3">
                        <label for="editDescripcion" class="form-label">Descripción</label>
                        <textarea class="form-control" id="editDescripcion" name="descripcion" required></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="editPrecio" class="form-label">Precio (€)</label>
                        <input type="number" class="form-control" id="editPrecio" name="precio" step="0.01" required>
                    </div>

                    <div class="mb-3">
                        <label for="editStock" class="form-label">Stock</label>
                        <input type="number" class="form-control" id="editStock" name="stock" required>
                    </div>

                    <div class="mb-3">
                        <label for="editCategoria" class="form-label">Categoría</label>
                        <input type="text" class="form-control" id="editCategoria" name="categoria" required>
                    </div>

                    <button type="submit" class="btn btn-success">Guardar Cambios</button>
                </form>
            </div>
        </div>
    </div>
</div>



<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/adminUsuario.js"></script>
<script src="js/adminProductos.js"></script>
<script src="js/auth.js"></script>
<script src="js/formIndex.js"></script>

</body>
</html>

<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page session="true" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Administración - Terra Nostra</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- CSS personalizado -->
    <link rel="stylesheet" href="css/admin.css">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
</head>

<body>

<!-- Header -->
<header class="header d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
    <div class="logo d-flex align-items-center">
        <img src="images/logo.webp" alt="Logo Terra Nostra" width="40">
        <h4 class="ms-2 mb-0">Terra Nostra</h4>
    </div>
    <nav class="navigation d-none d-md-block">
        <ul class="nav">
            <li class="nav-item"><a class="nav-link text-dark" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link text-dark" href="/shop">Productos</a></li>
        </ul>
    </nav>
</header>

<!-- Panel -->
<div class="container-fluid mt-4">
    <div class="row">
        <!-- Menú lateral -->
        <aside class="col-md-3 border-end">
            <h5 class="fw-bold mb-4">Administración</h5>
            <ul class="nav flex-column">
                <li class="nav-item mb-2">
                    <a id="linkUsuarios" class="nav-link active fw-bold text-primary d-flex align-items-center gap-2" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 16 16" fill="none">
                            <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#000000"/>
                            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#000000"/>
                        </svg>
                        Usuarios
                    </a>
                </li>
                <li class="nav-item mb-2">
                    <a id="linkProductos" class="nav-link d-flex align-items-center gap-2" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 7L12 12L21 7M3 17L12 22L21 17" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 12L12 17L21 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Productos
                    </a>
                </li>
            </ul>
        </aside>

        <!-- Sección de Usuarios -->
        <section id="seccionUsuarios" class="col-md-9">
            <h2 class="fw-bold mb-4">Gestión de Usuarios</h2>
            <div id="alertaUsuarios" class="alert d-none" role="alert"></div>
            <div class="table-responsive">
                <table class="table table-striped align-middle">
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
                        <!-- Datos cargados vía JS -->
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Sección de Productos -->
        <section id="seccionProductos" class="col-md-9 d-none">
            <h2 class="fw-bold mb-4">Gestión de Productos</h2>

            <!-- Formulario -->
            <div class="card mb-4">
                <div class="card-header bg-success text-white">Añadir Nuevo Producto</div>
                <div class="card-body">
                    <form id="formProducto" enctype="multipart/form-data">
                        <div class="mb-3"><label>Nombre:</label><input type="text" name="nombre" class="form-control" required></div>
                        <div class="mb-3"><label>Descripción:</label><textarea name="descripcion" class="form-control" required></textarea></div>
                        <div class="mb-3"><label>Precio:</label><input type="number" name="precio" class="form-control" step="0.01" required></div>
                        <div class="mb-3"><label>Stock:</label><input type="number" name="stock" class="form-control" required></div>
                        <div class="mb-3"><label>Categoría:</label><input type="text" name="categoria" class="form-control" required></div>
                        <div class="mb-3"><label>Imagen:</label><input type="file" name="imagen" class="form-control"></div>
                        <button type="submit" class="btn btn-success">Guardar Producto</button>
                        <div id="mensaje" class="mt-3"></div>
                    </form>
                </div>
            </div>

            <!-- Tabla productos -->
            <div class="card">
                <div class="card-header bg-success text-white">Lista de Productos</div>
                <div class="card-body">
                    <div id="alertaProductos" class="alert d-none" role="alert"></div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead class="table-success">
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
                                <!-- Productos cargados vía JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>

<!-- Modal Editar Usuario -->
<div class="modal fade" id="editarUsuarioModal" tabindex="-1" aria-labelledby="editarUsuarioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <form class="modal-content" id="editarUsuarioForm">
            <div class="modal-header">
                <h5 class="modal-title">Editar Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <input type="email" id="editEmail" name="email" class="form-control mb-3" readonly>
                <input type="text" id="editNombre" name="nombre" class="form-control mb-3" required placeholder="Nombre">
                <input type="text" id="editApellido" name="apellido" class="form-control mb-3" required placeholder="Apellido">
                <input type="text" id="editTelefono" name="telefono" class="form-control mb-3" placeholder="Teléfono">
                <input type="text" id="editDireccion" name="direccion" class="form-control mb-3" placeholder="Dirección">
                <select id="editRol" name="rol" class="form-select mb-3">
                    <option value="ROLE_USER">Usuario</option>
                    <option value="ROLE_ADMIN">Administrador</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Editar Producto -->
<div class="modal fade" id="editarProductoModal" tabindex="-1" aria-labelledby="editarProductoModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <form class="modal-content" id="editarProductoForm">
      <div class="modal-header">
        <h5 class="modal-title">Editar Producto</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <input type="hidden" id="editProductoId" name="id">
        <input type="text" id="editNombre" name="nombre" class="form-control mb-3" required placeholder="Nombre">
        <textarea id="editDescripcion" name="descripcion" class="form-control mb-3" required placeholder="Descripción"></textarea>
        <input type="number" id="editPrecio" name="precio" class="form-control mb-3" step="0.01" required placeholder="Precio">
        <input type="number" id="editStock" name="stock" class="form-control mb-3" required placeholder="Stock">
        <input type="text" id="editCategoria" name="categoria" class="form-control mb-3" required placeholder="Categoría">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" class="btn btn-success">Guardar Cambios</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal Confirmar Eliminar Producto -->
<div class="modal fade" id="modalConfirmarEliminarProducto" tabindex="-1" aria-labelledby="modalConfirmarEliminarProductoLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">Confirmar eliminación</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>¿Estás seguro de que deseas eliminar el producto <strong id="nombreProductoAEliminar"></strong>?</p>
      </div>
      <div class="modal-footer justify-content-end">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnConfirmarEliminarProducto" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</div>


<!-- Modal Confirmar Eliminar Usuario -->
<div class="modal fade" id="modalConfirmarEliminarUsuario" tabindex="-1" aria-labelledby="modalConfirmarEliminarUsuarioLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content border-0 shadow">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">Confirmar eliminación</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Para eliminar al usuario <strong id="nombreUsuarioAEliminar"></strong>, escribe su correo electrónico exacto:</p>
        <input type="email" id="inputConfirmarEmail" class="form-control mt-2" placeholder="Correo electrónico">
      </div>
      <div class="modal-footer justify-content-end">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" id="btnConfirmarEliminarUsuario" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</div>



<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/adminUsuario.js"></script>
<script src="js/adminProductos.js"></script>
<script src="js/adminPanel.js"></script>

</body>
</html>

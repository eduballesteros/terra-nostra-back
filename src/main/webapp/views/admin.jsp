<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page session="true" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
    <title>Panel de Administración</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="css/admin.css">
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
                <li><a href="/">Home</a></li>
                <li><a href="/shop">Productos</a></li>
            </ul>
        </nav>
    </header>

    <!-- Modal de Notificación -->
    <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="notificationModalLabel">Notificación</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="notificationMessage">
                        <!-- Aquí se insertará el mensaje -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>

    <!-- Aquí mostramos los usuarios -->
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
            <tbody>
                <!-- Usamos JSTL para iterar sobre la lista de usuarios -->
                <c:forEach var="usuario" items="${usuarios}">
                    <tr>
                          <td>${usuario.nombre}</td>
                                   <td>${usuario.apellido}</td>
                                   <td>${usuario.email}</td>
                                   <td>${empty usuario.telefono ? "No disponible" : usuario.telefono}</td>
                                   <td>${empty usuario.direccion ? "No especificada" : usuario.direccion}</td>
                                   <td>${usuario.rol}</td>
                                   <td>
                                       <button class="btn btn-primary btn-sm editar-usuario"
                                                   data-email="${usuario.email}"
                                                   data-nombre="${usuario.nombre}"
                                                   data-apellido="${usuario.apellido}"
                                                   data-telefono="${usuario.telefono}"
                                                   data-direccion="${usuario.direccion}"
                                                   data-rol="${usuario.rol}">
                                               Editar
                                           </button>
                                       <a href="#" class="btn btn-danger btn-sm eliminar-usuario" data-email="${usuario.email}">Eliminar</a>
                                   </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>

    <!-- Modal para editar usuario -->
    <div class="modal fade" id="editarUsuarioModal" tabindex="-1" aria-labelledby="editarUsuarioModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editarUsuarioModalLabel">Editar Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editarUsuarioForm">
                        <input type="hidden" id="editEmail" name="email"> <!-- Campo oculto con el email -->

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
                            <select class="form-control" id="editRol" name="rol">
                                <option value="ROLE_USER">Usuario</option>
                                <option value="ROLE_ADMIN">Administrador</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-success">Guardar Cambios</button>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/formIndex.js"></script>
    <script src="js/admin.js"></script>
    <script src="js/auth.js"></script>

</body>
</html>

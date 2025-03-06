package com.terra_nostra.service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.terra_nostra.dto.UsuarioDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service

/**
 * Servicio para la gestión de usuarios.
 * Proporciona métodos para registrar, obtener, actualizar y eliminar usuarios a través de una API externa.
 *
 * @author [Tu Nombre]
 * @version 1.0
 */


public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);
    private static final String API_BASE_URL = "http://localhost:8081/api/usuario";

    /**
     * Registra un nuevo usuario en la API.
     *
     * @param nuevoUsuario DTO que contiene los datos del usuario a registrar.
     * @param session Objeto `HttpSession` para almacenar información de la sesión del usuario.
     * @return `"success"` si el usuario se registró correctamente, `"error"` en caso de fallo.
     */


    public String registrarUsuario(UsuarioDto nuevoUsuario, HttpSession session) {
        try {
            HttpClient cliente = HttpClient.newHttpClient();
            ObjectMapper mapeo = new ObjectMapper();
            mapeo.registerModule(new JavaTimeModule());
            mapeo.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            logger.info("📥 Usuario recibido en el backend: {}", nuevoUsuario);
            logger.info("📥 Email recibido: {}", nuevoUsuario.getEmail());

            String requestBody = mapeo.writeValueAsString(nuevoUsuario);
            logger.info("📤 JSON enviado a la API: {}", requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/registro"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());
            logger.info("🔹 Respuesta de la API: {}", response.body());

            if (response.statusCode() == 201) {
                String mensajeRespuesta = response.body();
                logger.info("✅ Registro exitoso: {}", mensajeRespuesta);
                session.setAttribute("mensajeRegistro", mensajeRespuesta);
                return "success";
            } else {
                logger.error("❌ Error en la solicitud a la API: {}", response.body());
                return "error";
            }

        } catch (Exception e) {
            logger.error("❌ Excepción al registrar usuario: ", e);
            return "error";
        }
    }

    /**
     * Obtiene la lista de todos los usuarios registrados en la API.
     *
     * @return Lista de `UsuarioDto` con los usuarios obtenidos,
     *         o una lista vacía si no se encontraron usuarios o hubo un error.
     */


    public List<UsuarioDto> obtenerTodosLosUsuarios() {
        logger.info("📢 Iniciando solicitud para obtener todos los usuarios desde la API...");

        try {
            HttpClient cliente = HttpClient.newHttpClient();
            ObjectMapper mapeo = new ObjectMapper();
            mapeo.registerModule(new JavaTimeModule());
            mapeo.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            logger.info("📤 Enviando solicitud GET a la API: {}", request.uri());

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());
            logger.info("🔹 Respuesta de la API: {}", response.body());

            if (response.statusCode() == 200) {
                List<UsuarioDto> listaUsuarios = mapeo.readValue(response.body(), new TypeReference<List<UsuarioDto>>() {});
                logger.info("✅ Usuarios obtenidos con éxito. Total: {}", listaUsuarios.size());
                return listaUsuarios;
            } else {
                logger.error("❌ Error al obtener los usuarios. Código: {}, Respuesta: {}", response.statusCode(), response.body());
                return Collections.emptyList();
            }

        } catch (Exception e) {
            logger.error("❌ Excepción al obtener la lista de usuarios: ", e);
            return Collections.emptyList();
        }
    }

    /**
     * Elimina un usuario de la API utilizando su dirección de correo electrónico.
     *
     * @param email Correo electrónico del usuario a eliminar.
     * @return `true` si el usuario fue eliminado correctamente, `false` si hubo un error.
     */


    public boolean eliminarUsuarioDesdeAPI(String email) {
        try {
            logger.info("🗑 Enviando solicitud DELETE a la API para eliminar usuario con email: {}", email);

            HttpClient cliente = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/email/" + email))
                    .header("Accept", "application/json")
                    .DELETE()
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());
            logger.info("🔹 Respuesta de la API: {}", response.body());

            if (response.statusCode() == 200) {
                logger.info("✅ Usuario eliminado correctamente en la API.");
                return true;
            } else {
                logger.error("❌ No se pudo eliminar el usuario. Código: {}, Respuesta: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            logger.error("❌ Error al eliminar usuario en la API:", e);
            return false;
        }
    }

    /**
     * Actualiza los datos de un usuario en la API.
     *
     * @param email Correo electrónico del usuario a actualizar.
     * @param userDto DTO con los nuevos datos del usuario.
     * @return `true` si el usuario fue actualizado correctamente, `false` en caso de error.
     */


    public boolean actualizarUsuario(String email, UsuarioDto userDto) {
        try {
            logger.info("✏ Enviando solicitud PUT a la API para actualizar usuario con email: {}", email);

            HttpClient cliente = HttpClient.newHttpClient();
            ObjectMapper mapeo = new ObjectMapper();
            mapeo.registerModule(new JavaTimeModule()); // Para manejar fechas correctamente
            mapeo.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            // Convertimos el DTO a JSON
            String usuarioJson = mapeo.writeValueAsString(userDto);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/email/" + email)) // Ruta correcta
                    .header("Content-Type", "application/json")
                    .PUT(HttpRequest.BodyPublishers.ofString(usuarioJson))
                    .build();

            logger.debug("🔹 Cuerpo de la solicitud: {}", usuarioJson);
            logger.info("📤 Enviando solicitud PUT a la API: {}", request.uri());

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());
            logger.debug("🔹 Respuesta de la API: {}", response.body());

            if (response.statusCode() == 200) {
                logger.info("✅ Usuario actualizado correctamente en la API.");
                return true;
            } else {
                logger.error("❌ No se pudo actualizar el usuario. Código: {}, Respuesta: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            logger.error("❌ Error al actualizar usuario en la API:", e);
            return false;
        }
    }
}



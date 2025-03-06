package com.terra_nostra.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.terra_nostra.dto.LoginDto;
import com.terra_nostra.dto.UsuarioDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * Servicio para la autenticación de usuarios.
 * Envía las credenciales a una API externa para verificar la autenticación del usuario.
 *
 * @author ebp
 * @version 1.0
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    /**
     * Objeto `ObjectMapper` para la conversión de objetos Java a JSON y viceversa.
     */
    @Autowired
    private ObjectMapper objectMapper; // 🔹 Usar el ObjectMapper configurado

    /**
     * Autentica a un usuario enviando sus credenciales a una API externa.
     *
     * @param loginDto DTO que contiene el correo y la contraseña del usuario.
     * @return `UsuarioDto` con la información del usuario autenticado si las credenciales son correctas,
     *         o `null` si la autenticación falla.
     */
    public UsuarioDto autenticarUsuario(LoginDto loginDto) {
        try {
            HttpClient cliente = HttpClient.newHttpClient();

            /**
             * Convierte el objeto `LoginDto` en una cadena JSON para enviarlo en la solicitud HTTP.
             */
            String requestBody = objectMapper.writeValueAsString(loginDto);
            logger.info("📤 JSON enviado a la API: {}", requestBody);

            /**
             * Construye y envía una solicitud `POST` a la API de autenticación.
             */
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("http://localhost:8081/api/auth/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            // Enviar la solicitud y recibir la respuesta.
            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());
            logger.info("🔹 Respuesta de la API: {}", response.body());

            /**
             * Procesa la respuesta de la API.
             * Si el código de estado es `200`, convierte el JSON en un objeto `UsuarioDto`.
             * Si la autenticación falla, devuelve `null`.
             */
            if (response.statusCode() == 200) { // Login exitoso
                UsuarioDto usuarioAutenticado = objectMapper.readValue(response.body(), UsuarioDto.class);
                logger.info("✅ Usuario autenticado: {}", usuarioAutenticado.getEmail());
                return usuarioAutenticado;
            } else {
                logger.warn("❌ Credenciales incorrectas o error en la API.");
                return null; // Usuario no autenticado
            }

        } catch (Exception e) {
            logger.error("⚠️ Error en la autenticación del usuario.", e);
            return null;
        }
    }
}

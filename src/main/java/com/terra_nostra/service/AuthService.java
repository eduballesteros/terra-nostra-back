package com.terra_nostra.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.terra_nostra.dto.LoginDto;
import com.terra_nostra.dto.UsuarioDto;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AuthService {

    @Autowired
    private ObjectMapper objectMapper; // 🔹 Usar el ObjectMapper configurado

    public UsuarioDto autenticarUsuario(LoginDto loginDto) {
        try {
            HttpClient cliente = HttpClient.newHttpClient();

            // Convertir LoginDto a JSON
            String requestBody = objectMapper.writeValueAsString(loginDto);
            System.out.println("📤 JSON enviado a la API: " + requestBody);

            // Solicitud POST
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("http://localhost:8081/api/auth/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            // Enviar la solicitud y recibir la respuesta.
            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("🔹 Código de respuesta de la API: " + response.statusCode());
            System.out.println("🔹 Respuesta de la API: " + response.body());

            if (response.statusCode() == 200) { // Login exitoso
                UsuarioDto usuarioAutenticado = objectMapper.readValue(response.body(), UsuarioDto.class);
                System.out.println("✅ Usuario autenticado: " + usuarioAutenticado.getEmail());
                return usuarioAutenticado;
            } else {
                System.out.println("❌ Credenciales incorrectas o error en la API.");
                return null; // Usuario no autenticado
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("⚠️ Error en la autenticación del usuario.");
            return null;
        }
    }
}

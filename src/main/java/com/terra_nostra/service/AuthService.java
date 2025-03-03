package com.terra_nostra.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.terra_nostra.dto.LoginDto;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AuthService {

    public com.tfg.terranostra.dto.UsuarioDto autenticarUsuario(LoginDto loginDto) {

        try {

            HttpClient cliente = HttpClient.newHttpClient();
            ObjectMapper mapeo = new ObjectMapper();

            //Convertir LoginDto a JSON
            String requestBody = mapeo.writeValueAsString(loginDto);
            System.out.println("📤 JSON enviado a la API: " + requestBody);

            //Solicitud POST
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("http://localhost:8081/api/auth/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            //Enviar la solicitud y recibir la respuesta.
            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("🔹 Código de respuesta de la API: " + response.statusCode());
            System.out.println("🔹 Respuesta de la API: " + response.body());

            if (response.statusCode() == 200) { // Login exitoso
                com.tfg.terranostra.dto.UsuarioDto usuarioAutenticado = mapeo.readValue(response.body(), com.tfg.terranostra.dto.UsuarioDto.class);
                System.out.println("✅ Usuario autenticado: " + usuarioAutenticado.getEmail());
                return usuarioAutenticado;
            } else {
                System.out.println("❌ Credenciales incorrectas o error en la API.");
                return null; // Usuario no autenticado
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

}

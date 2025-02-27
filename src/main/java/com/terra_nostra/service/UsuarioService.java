package com.terra_nostra.service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.terra_nostra.dto.LoginDto;
import com.terra_nostra.dto.UsuarioDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    public String registrarUsuario(UsuarioDto nuevoUsuario, HttpSession session) {
        try {
            HttpClient cliente = HttpClient.newHttpClient();
            ObjectMapper mapeo = new ObjectMapper();

            mapeo.registerModule(new JavaTimeModule());
            mapeo.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            System.out.println("📥 Usuario recibido en el backend: " + nuevoUsuario);
            System.out.println("📥 Email recibido: " + nuevoUsuario.getEmail());


            String requestBody = mapeo.writeValueAsString(nuevoUsuario);
            System.out.println("📤 JSON enviado a la API: " + requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("http://localhost:8081/api/usuario/registro"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("🔹 Código de respuesta de la API: " + response.statusCode());
            System.out.println("🔹 Respuesta de la API: " + response.body());

            if (response.statusCode() == 201) {
                String mensajeRespuesta = response.body(); // ✅ Capturar texto plano
                System.out.println("✅ Registro exitoso: " + mensajeRespuesta);
                session.setAttribute("mensajeRegistro", mensajeRespuesta);
                return "success";
            } else {
                System.out.println("❌ Error en la solicitud a la API: " + response.body());
                return "error";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }


    public UsuarioDto autenticarUsuario(LoginDto loginDto) {

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
                UsuarioDto usuarioAutenticado = mapeo.readValue(response.body(), UsuarioDto.class);
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

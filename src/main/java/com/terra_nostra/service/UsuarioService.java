package com.terra_nostra.service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.terra_nostra.dto.UsuarioDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    public String registrarUsuario(UsuarioDto nuevoUsuario, HttpSession session) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            ObjectMapper mapper = new ObjectMapper();

            mapper.registerModule(new JavaTimeModule());
            mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            String requestBody = mapper.writeValueAsString(nuevoUsuario);
            System.out.println("📤 JSON enviado a la API: " + requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("http://localhost:8081/api/usuario/registro"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

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

}

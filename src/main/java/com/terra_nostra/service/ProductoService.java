package com.terra_nostra.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.terra_nostra.dto.ProductoDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

@Service
public class ProductoService {

    private static final Logger logger = LoggerFactory.getLogger(ProductoService.class);
    private static final String API_BASE_URL = "http://localhost:8081/api/productos"; // URL de la API

    private final HttpClient cliente = HttpClient.newHttpClient();
    private final ObjectMapper mapeo;

    public ProductoService() {
        this.mapeo = new ObjectMapper();
        this.mapeo.registerModule(new JavaTimeModule());
        this.mapeo.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    /**
     * 📌 Guarda un producto en la API.
     */
    public ProductoDto guardarProducto(ProductoDto productoDto, MultipartFile imagen) {
        try {
            if (imagen != null && !imagen.isEmpty()) {
                productoDto.setImagen(imagen.getBytes());
                logger.info("📸 Imagen recibida, tamaño: {} bytes", productoDto.getImagen().length);
            }

            String requestBody = mapeo.writeValueAsString(productoDto);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/guardar"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                // Devuelve el producto guardado desde la API
                return mapeo.readValue(response.body(), ProductoDto.class);
            } else {
                logger.error("❌ Error al guardar producto: {}", response.body());
                return null;
            }
        } catch (Exception e) {
            logger.error("❌ Excepción al enviar producto a la API: ", e);
            return null;
        }
    }


    /**
     * 📌 Obtiene todos los productos de la API.
     */
    public List<ProductoDto> obtenerTodosLosProductos() {
        try {
            logger.info("🔍 Enviando solicitud GET a la API para obtener productos...");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/listar"))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());

            if (response.statusCode() == 200) {
                return mapeo.readValue(response.body(), new TypeReference<List<ProductoDto>>() {});
            } else {
                logger.error("❌ Error al obtener productos: {}", response.body());
                return Collections.emptyList();
            }

        } catch (Exception e) {
            logger.error("❌ Excepción al obtener productos de la API: ", e);
            return Collections.emptyList();
        }
    }

    /**
     * ✏ Edita un producto existente en la API.
     */
    public String editarProducto(Long id, ProductoDto productoDto, MultipartFile imagen) {
        try {
            if (imagen != null && !imagen.isEmpty()) {
                productoDto.setImagen(imagen.getBytes());
                logger.info("📸 Nueva imagen recibida y convertida a byte[]");
            }

            String requestBody = mapeo.writeValueAsString(productoDto);
            logger.info("📤 Enviando JSON a la API para actualizar el producto: {}", requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/editar/" + id))
                    .header("Content-Type", "application/json")
                    .PUT(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());

            if (response.statusCode() == 200) {
                logger.info("✅ Producto actualizado correctamente.");
                return "success";
            } else {
                logger.error("❌ Error al actualizar producto: {}", response.body());
                return "error";
            }

        } catch (Exception e) {
            logger.error("❌ Excepción al actualizar el producto: ", e);
            return "error";
        }
    }

    public ProductoDto obtenerProductoPorId(Long id) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/obtener/" + id))
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return mapeo.readValue(response.body(), ProductoDto.class);
            } else {
                logger.warn("⚠ Producto no encontrado. ID: {}", id);
                return null;
            }

        } catch (Exception e) {
            logger.error("❌ Error al obtener producto de la API: ", e);
            throw new RuntimeException("Producto no encontrado");
        }
    }
    /**
     * 🗑 Elimina un producto por ID en la API.
     */
    public String eliminarProducto(Long id) {
        try {
            logger.info("🗑 Enviando solicitud DELETE para eliminar producto ID: {}", id);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(API_BASE_URL + "/eliminar/" + id))
                    .header("Accept", "application/json")
                    .DELETE()
                    .build();

            HttpResponse<String> response = cliente.send(request, HttpResponse.BodyHandlers.ofString());

            logger.info("🔹 Código de respuesta de la API: {}", response.statusCode());

            if (response.statusCode() == 200) {
                logger.info("✅ Producto eliminado correctamente.");
                return "success";
            } else {
                logger.error("❌ Error al eliminar producto: {}", response.body());
                return "error";
            }

        } catch (Exception e) {
            logger.error("❌ Excepción al eliminar el producto: ", e);
            return "error";
        }
    }
}

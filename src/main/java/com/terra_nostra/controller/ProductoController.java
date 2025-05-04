package com.terra_nostra.controller;

import com.terra_nostra.dto.ProductoDto;
import com.terra_nostra.service.ProductoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    private static final Logger logger = LoggerFactory.getLogger(ProductoController.class);

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarProducto(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("descripcionBreve") String descripcionBreve,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoria") String categoria,
            @RequestParam("descuento") BigDecimal descuento,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        ProductoDto productoDto = construirDto(nombre, descripcion, descripcionBreve, precio, stock, categoria, descuento);

        ProductoDto productoGuardado = productoService.guardarProducto(productoDto, imagen);
        return productoGuardado != null
                ? ResponseEntity.status(HttpStatus.CREATED).body(productoGuardado)
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el producto");
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Map<String, String>> editarProducto(
            @PathVariable Long id,
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("descripcionBreve") String descripcionBreve,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoria") String categoria,
            @RequestParam("descuento") BigDecimal descuento,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        Map<String, String> response = new HashMap<>();
        try {
            ProductoDto productoDto = construirDto(nombre, descripcion, descripcionBreve, precio, stock, categoria, descuento);
            productoService.editarProducto(id, productoDto, imagen);
            response.put("mensaje", "✅ Producto actualizado correctamente.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("mensaje", "❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("mensaje", "❌ Error interno al actualizar producto.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ProductoDto>> listarProductos(
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) Boolean disponibles,
            @RequestParam(required = false) String categoria) {

        try {
            List<ProductoDto> productos;

            boolean hayFiltros = (texto != null && !texto.trim().isEmpty())
                    || disponibles != null
                    || (categoria != null && !categoria.trim().isEmpty());

            if (hayFiltros) {
                productos = productoService.buscarProductosConFiltros(texto, disponibles, categoria);
            } else {
                productos = productoService.obtenerTodosLosProductos();
            }

            logger.info("✅ Productos obtenidos correctamente. Total: {}", productos.size());
            return ResponseEntity.ok(productos);

        } catch (Exception e) {
            logger.error("❌ Error al filtrar productos:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> obtenerProductoPorId(@PathVariable Long id) {
        ProductoDto producto = productoService.obtenerProductoPorId(id);
        return producto != null ? ResponseEntity.ok(producto) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Map<String, String>> eliminarProducto(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            productoService.eliminarProducto(id);
            response.put("mensaje", "✅ Producto eliminado correctamente.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("error", "❌ Error al eliminar el producto: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> obtenerCategorias() {
        try {
            List<String> categorias = productoService.obtenerCategorias();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            logger.error("❌ Error al obtener categorías:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }


    private ProductoDto construirDto(String nombre, String descripcion, String descripcionBreve, BigDecimal precio,
                                     Integer stock, String categoria, BigDecimal descuento) {
        ProductoDto dto = new ProductoDto();
        dto.setNombre(nombre);
        dto.setDescripcion(descripcion);
        dto.setDescripcionBreve(
                (descripcionBreve == null || descripcionBreve.trim().isEmpty())
                        ? "Sin descripción breve"
                        : descripcionBreve);
        dto.setPrecio(precio);
        dto.setStock(stock);
        dto.setCategoria(categoria);
        dto.setDescuento(descuento);
        return dto;
    }
}

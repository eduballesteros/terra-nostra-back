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

/**
 * Controlador para la gestión de productos.
 * Proporciona endpoints para agregar, listar, obtener, editar y eliminar productos.
 *
 * @author ebp
 * @version 1.0
 */

public class ProductoController {

    @Autowired ProductoService productoService;

    private static final Logger logger = LoggerFactory.getLogger(ProductoController.class);

    /**
     * Guarda un nuevo producto en el DTO.
     *
     * @param nombre Nombre del producto.
     * @param descripcion Descripción del producto.
     * @param precio Precio del producto.
     * @param stock Cantidad disponible en stock.
     * @param categoria Categoría del producto.
     * @param imagen Imagen opcional del producto en formato `MultipartFile`.
     * @return `ResponseEntity` con el producto guardado o un mensaje de error.
     */


    @PostMapping("/guardar")
    public ResponseEntity<?> guardarProducto(
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoria") String categoria,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        ProductoDto productoDto = new ProductoDto();
        productoDto.setNombre(nombre);
        productoDto.setDescripcion(descripcion);
        productoDto.setPrecio(precio);
        productoDto.setStock(stock);
        productoDto.setCategoria(categoria);

        ProductoDto productoGuardado = productoService.guardarProducto(productoDto, imagen);

        if (productoGuardado != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(productoGuardado);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el producto");
        }
    }

    /**
     * Obtiene la lista de todos los productos disponibles.*
     * @return `ResponseEntity` con la lista de productos en formato `ProductoDto`.
     */

    @GetMapping("/listar")
    public ResponseEntity<List<ProductoDto>> listarProductos() {
        List<ProductoDto> productos = productoService.obtenerTodosLosProductos();
        return ResponseEntity.ok(productos);
    }

    /**
     * Obtiene un producto por su identificador único.
     *
     * @param id Identificador del producto a buscar.
     * @return `ResponseEntity` con el producto encontrado o un `404 Not Found` si no existe.
     */


    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> obtenerProductoPorId(@PathVariable Long id) {
        ProductoDto producto = productoService.obtenerProductoPorId(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Elimina un producto de la base de datos.
     *
     * @param id Identificador del producto a eliminar.
     * @return `ResponseEntity` con un mensaje de éxito o error.
     */


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

    /**
     * Edita un producto existente.
     *
     * @param id Identificador del producto a actualizar.
     * @param nombre Nuevo nombre del producto.
     * @param descripcion Nueva descripción del producto.
     * @param precio Nuevo precio del producto.
     * @param stock Nueva cantidad en stock.
     * @param categoria Nueva categoría del producto.
     * @param imagen Nueva imagen opcional del producto en formato `MultipartFile`.
     * @return `ResponseEntity` con un mensaje de éxito o error.
     */


    @PutMapping("/editar/{id}")
    public ResponseEntity<Map<String, String>> editarProducto(
            @PathVariable Long id,
            @RequestParam("nombre") String nombre,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("categoria") String categoria,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        Map<String, String> response = new HashMap<>();
        try {
            ProductoDto productoDto = new ProductoDto();
            productoDto.setNombre(nombre);
            productoDto.setDescripcion(descripcion);
            productoDto.setPrecio(precio);
            productoDto.setStock(stock);
            productoDto.setCategoria(categoria);

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

}

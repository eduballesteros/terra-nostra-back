package com.terra_nostra.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.terra_nostra.service.UsuarioService;
import com.terra_nostra.dto.UsuarioDto;

import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/admin")

/**
 * Controlador para la administración de usuarios en la aplicación.
 * Proporciona endpoints para eliminar y editar usuarios.
 *
 * @author ebp
 * @version 1.0
 */

public class AdminController {
    /**
     * Logger para registrar información sobre las operaciones de administración de usuarios.
     */

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);


    @Autowired
    private UsuarioService usuarioService; // Servicio para obtener usuarios

    /**
     * Elimina un usuario del sistema según su correo electrónico.
     *
     * @param email Correo electrónico del usuario a eliminar.
     * @return `ResponseEntity` con un mensaje indicando el resultado de la operación.
     */


    @DeleteMapping("/eliminarUsuario")
    public ResponseEntity<Map<String, String>> eliminarUsuario(@RequestParam String email) {
        logger.info("🗑 Solicitando eliminación del usuario con email: {}", email);

        boolean eliminado = usuarioService.eliminarUsuarioDesdeAPI(email);
        Map<String, String> respuesta = new HashMap<>();

        if (eliminado) {
            logger.info("✅ Usuario eliminado correctamente: {}", email);
            respuesta.put("mensaje", "✅ Usuario eliminado con éxito.");
            return ResponseEntity.ok(respuesta);
        } else {
            logger.error("❌ Error al eliminar usuario con email: {}", email);
            respuesta.put("mensaje", "❌ Error al eliminar usuario.");
            return ResponseEntity.badRequest().body(respuesta);
        }
    }

    /**
     * Actualiza la información de un usuario en el sistema.
     *
     * @param email Correo electrónico del usuario a actualizar.
     * @param usuario Objeto `UsuarioDto` con los nuevos datos del usuario.
     * @return `ResponseEntity` con un mensaje indicando el resultado de la operación.
     */


    @PutMapping("/editarUsuario")
    public ResponseEntity<Map<String, String>> editarUsuario(@RequestParam String email, @RequestBody UsuarioDto usuario) {
        logger.info("✏️ Solicitando actualización del usuario con email: {}", email);
        logger.debug("🔹 Datos recibidos: {}", usuario);

        boolean actualizado = usuarioService.actualizarUsuario(email, usuario);
        Map<String, String> respuesta = new HashMap<>();

        if (actualizado) {
            logger.info("✅ Usuario actualizado correctamente: {}", email);
            respuesta.put("mensaje", "✅ Usuario actualizado con éxito.");
            return ResponseEntity.ok(respuesta);
        } else {
            logger.error("❌ Error al actualizar usuario con email: {}", email);
            respuesta.put("mensaje", "❌ Error al actualizar usuario.");
            return ResponseEntity.badRequest().body(respuesta);
        }
    }

}

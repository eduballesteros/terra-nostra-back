package com.terra_nostra.controller;
import com.terra_nostra.service.AuthService;
import com.terra_nostra.dto.UsuarioDto;
import com.terra_nostra.dto.LoginDto;
import com.terra_nostra.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")

public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(
            @RequestParam("email") String email,
            @RequestParam("contrasenia") String contrasenia,
            HttpServletResponse response) {

        logger.info("📥 Email recibido: {}", email);
        logger.info("📥 Contraseña recibida: [PROTEGIDA]");

        try {
            logger.info("🔍 Autenticando usuario...");
            LoginDto loginDto = new LoginDto();
            loginDto.setEmail(email);
            loginDto.setContrasenia(contrasenia);

            // 📌 Autenticamos al usuario con el servicio
            UsuarioDto usuario = authService.autenticarUsuario(loginDto);

            if (usuario == null) {
                logger.warn("❌ Credenciales incorrectas para el usuario: {}", email);
                return ResponseEntity.status(401).body("{\"mensaje\": \"❌ Credenciales incorrectas\"}");
            }

            // 🔍 Verificamos el rol obtenido antes de generar el token
            String rolReal = usuario.getRol();
            logger.info("🔍 Usuario autenticado correctamente: {}", usuario.getEmail());
            logger.info("🎭 Rol obtenido del usuario autenticado: {}", rolReal);

            // ✅ Generamos un nuevo token con el rol correcto
            String newToken = jwtUtil.generarToken(usuario.getEmail(), rolReal);
            logger.info("✅ Nuevo token generado con rol '{}' para el usuario {}", rolReal, usuario.getEmail());

            // ✅ Crear la cookie con el nuevo token
            Cookie sessionCookie = new Cookie("SESSIONID", newToken);
            sessionCookie.setHttpOnly(true);
            sessionCookie.setSecure(true);
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(60 * 60 * 24); // 1 día

            response.addCookie(sessionCookie);


            return ResponseEntity.ok("{\"mensaje\": \"✅ Inicio de sesión exitoso\"}");

        } catch (Exception e) {
            logger.error("❌ Error en el servidor: ", e);
            return ResponseEntity.status(500).body("{\"mensaje\": \"❌ Error en el servidor\"}");
        }
    }


    @GetMapping("/verificar-sesion")
    public ResponseEntity<Map<String, Object>> verificarSesion(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        String token = null;

        // Buscar el token en las cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("SESSIONID".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // Si no hay token o no es válido, devolver sesionActiva: false
        if (token == null || !jwtUtil.isTokenValido(token)) {
            response.put("sesionActiva", false);
            return ResponseEntity.ok(response);
        }

        // Extraer el email desde el JWT (sin consultar la base de datos)
        String emailUsuario = jwtUtil.obtenerEmailDesdeToken(token);
        String rolUsuario = jwtUtil.obtenerRolDesdeToken(token);

        response.put("sesionActiva", true);
        response.put("nombreUsuario", emailUsuario); // Usamos el email como identificador
        response.put("rol", rolUsuario);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Crear una cookie con el mismo nombre pero sin valor y con tiempo de vida 0
        Cookie cookie = new Cookie("SESSIONID", null);
        cookie.setHttpOnly(true);  // Evita accesos desde JavaScript
        cookie.setSecure(true);    // Solo se envía en HTTPS (si usas HTTPS)
        cookie.setPath("/");       // Aplicable a todo el sitio
        cookie.setMaxAge(0);       // Expira inmediatamente

        // Agregar la cookie al response para que el navegador la elimine
        response.addCookie(cookie);

        // Devolver un mensaje de confirmación
        return ResponseEntity.ok("{\"mensaje\": \"✅ Sesión cerrada correctamente\"}");
    }


}
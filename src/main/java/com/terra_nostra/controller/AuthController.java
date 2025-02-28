package com.terra_nostra.controller;

import com.terra_nostra.dto.LoginDto;
import com.terra_nostra.dto.UsuarioDto;
import com.terra_nostra.service.UsuarioService;
import com.terra_nostra.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(
            @RequestParam("email") String email,
            @RequestParam("contrasenia") String contrasenia,
            HttpServletRequest request,
            HttpServletResponse response) {

        logger.info("📥 Email recibido: {}", email);
        logger.info("📥 Contraseña recibida: [PROTEGIDA]");

        try {
            String token = null;
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("authToken".equals(cookie.getName())) {
                        token = cookie.getValue();
                        logger.info("🔑 Token encontrado en cookies: {}", token);
                        break;
                    }
                }
            }

            if (token != null && jwtUtil.isTokenValido(token)) {
                logger.info("✅ Usuario ya autenticado con un token válido.");
                return ResponseEntity.ok("{\"mensaje\": \"✅ Usuario ya autenticado.\"}");
            } else {
                logger.info("🔍 No se encontró un token válido, autenticando usuario...");
                LoginDto loginDto = new LoginDto();
                loginDto.setEmail(email);
                loginDto.setContrasenia(contrasenia);

                UsuarioDto usuario = usuarioService.autenticarUsuario(loginDto);

                if (usuario != null) {
                    String newToken = jwtUtil.generarToken(email);
                    logger.info("✅ Nuevo token generado para el usuario {}: {}", usuario.getEmail(), newToken);

                    Cookie cookie = new Cookie("authToken", newToken);
                    cookie.setHttpOnly(true);
                    cookie.setSecure(true);
                    cookie.setPath("/");
                    cookie.setMaxAge(60 * 60);

                    response.addCookie(cookie);

                    return ResponseEntity.ok("{\"mensaje\": \"✅ Inicio de sesión exitoso\"}");
                } else {
                    logger.warn("❌ Credenciales incorrectas para el usuario: {}", email);
                    return ResponseEntity.status(401).body("{\"mensaje\": \"❌ Credenciales incorrectas\"}");
                }
            }

        } catch (Exception e) {
            logger.error("❌ Error en el servidor: ", e);
            return ResponseEntity.status(500).body("{\"mensaje\": \"❌ Error en el servidor\"}");
        }
    }
}
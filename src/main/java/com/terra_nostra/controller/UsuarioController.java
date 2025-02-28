package com.terra_nostra.controller;

import com.terra_nostra.service.UsuarioService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import com.terra_nostra.utils.JwtUtil;
import org.springframework.web.bind.annotation.*;
import com.terra_nostra.dto.UsuarioDto;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

	@Autowired
	private JwtUtil jwtUtil;  // Para generar el token

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

	@PostMapping("/registrar")
	public ResponseEntity<?> registroUsuario(
			@RequestParam("nombre") String nombre,
			@RequestParam("apellido") String apellido,
			@RequestParam("email") String email,
			@RequestParam(value = "telefono", required = false) String telefono,
			@RequestParam("contrasenia") String contrasenia,
			HttpSession session, HttpServletResponse response) {

		logger.info("📌 El controlador ha recibido la solicitud de registro.");
		logger.info("📥 Nombre recibido: {}", nombre);
		logger.info("📥 Apellido recibido: {}", apellido);
		logger.info("📥 Email recibido: {}", email);
		logger.info("📥 Teléfono recibido: {}", telefono);
		logger.info("📥 Contraseña recibida: {}", contrasenia);

		try {
			UsuarioDto usuarioNuevo = new UsuarioDto();
			usuarioNuevo.setNombre(nombre);
			usuarioNuevo.setApellido(apellido);
			usuarioNuevo.setEmail(email);
			usuarioNuevo.setTelefono(telefono);
			usuarioNuevo.setFechaRegistro(LocalDateTime.now(ZoneId.of("Europe/Madrid")));

			usuarioNuevo.setContrasenia(passwordEncoder.encode(contrasenia));

			logger.info("📌 Fecha de registro asignada: {}", usuarioNuevo.getFechaRegistro());

			// Registrar el usuario a través del servicio
			String resultado = usuarioService.registrarUsuario(usuarioNuevo, session);
			logger.info("📌 Resultado del registro: {}", resultado);

			if ("success".equals(resultado)) {
				String token = jwtUtil.generarToken(email);
				logger.info("📌 Token generado: {}", token);
				logger.info("✅ Registro exitoso. Bienvenido a Terra Nostra!");

				// Crear la cookie con el token
				Cookie cookie = new Cookie("authToken", token);
				cookie.setHttpOnly(true);
				cookie.setSecure(true);
				cookie.setPath("/");
				cookie.setMaxAge(60 * 60 * 24);

				response.addCookie(cookie); // Agregar la cookie a la respuesta

				// Devolver solo un mensaje de éxito sin el token en el cuerpo de la respuesta
				return ResponseEntity.ok("{\"mensaje\": \"✅ Registro exitoso. Bienvenido a Terra Nostra!\"}");
			} else {
				logger.error("❌ Error en el registro.");
				return ResponseEntity.status(400).body("{\"mensaje\": \"❌ Error en el registro. Intenta nuevamente.\"}");
			}

		} catch (Exception e) {
			logger.error("❌ Error en el servidor: {}", e.getMessage(), e);
			return ResponseEntity.status(500).body("{\"mensaje\": \"❌ Error en el servidor. Intenta nuevamente.\"}");
		}
	}
}

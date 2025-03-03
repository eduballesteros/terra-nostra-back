package com.terra_nostra.controller;

import com.tfg.terranostra.dto.UsuarioDto;
import com.terra_nostra.service.UsuarioService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import com.terra_nostra.utils.JwtUtil;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

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
			UsuarioDto usuarioNuevo = new com.tfg.terranostra.dto.UsuarioDto();
			usuarioNuevo.setNombre(nombre);
			usuarioNuevo.setApellido(apellido);
			usuarioNuevo.setEmail(email);
			usuarioNuevo.setTelefono(telefono);
			usuarioNuevo.setFechaRegistro(LocalDateTime.now(ZoneId.of("Europe/Madrid")));
			usuarioNuevo.setRol("ROLE_USER");
			usuarioNuevo.setContrasenia(passwordEncoder.encode(contrasenia));

			logger.info("📌 Fecha de registro asignada: {}", usuarioNuevo.getFechaRegistro());

			// Registrar el usuario a través del servicio
			String resultado = usuarioService.registrarUsuario(usuarioNuevo, session);
			logger.info("📌 Resultado del registro: {}", resultado);

			if ("success".equals(resultado)) {
				String token = jwtUtil.generarToken(email, usuarioNuevo.getRol());
				logger.info("📌 Token generado: {}", token);
				logger.info("✅ Registro exitoso. Bienvenido a Terra Nostra!");

				// Crear la cookie con el token
				Cookie cookie = new Cookie("SESSIONID", token);
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

	@GetMapping("/listar")
	public ResponseEntity<List<UsuarioDto>> listarUsuarios() {
		logger.info("📢 Solicitando lista de usuarios desde el controlador.");
		List<UsuarioDto> usuarios = usuarioService.obtenerTodosLosUsuarios();

		if (usuarios.isEmpty()) {
			logger.warn("⚠️ No hay usuarios registrados en la base de datos.");
			return ResponseEntity.noContent().build();
		} else {
			logger.info("✅ Usuarios obtenidos correctamente. Total: {}", usuarios.size());
			return ResponseEntity.ok(usuarios);
		}
	}

	@GetMapping("/usuario/perfil")
	public String perfilUsuario(HttpSession session) {
		UsuarioDto usuario = (UsuarioDto) session.getAttribute("usuario");

		if (usuario == null) {
			return "redirect:/login"; // Si no hay sesión, redirigir al login
		}

		if ("ROLE_ADMIN".equals(usuario.getRol())) {
			return "redirect:/admin/panel"; // Si es admin, redirigir al panel de administración
		}

		// Si es usuario normal, ir al perfil del usuario
		return "perfil-usuario"; // Cargar perfil-usuario.jsp
	}


}

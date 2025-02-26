package com.terra_nostra.controller;

import com.terra_nostra.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.terra_nostra.dto.UsuarioDto;
import jakarta.servlet.http.HttpSession;

@Controller // 🔹 Cambiado de @RestController a @Controller
@RequestMapping("/usuario")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/registrar")
	public String registroUsuario(
			@RequestParam("nombre") String nombre,
			@RequestParam("apellido") String apellido,
			@RequestParam("email") String email,
			@RequestParam(value = "telefono", required = false) String telefono,
			@RequestParam("contrasenia") String contrasenia,
			HttpSession session) {

		// 🔹 Verificar qué datos llegan al backend desde el JSP
		System.out.println("📥 Nombre recibido: " + nombre);
		System.out.println("📥 Apellido recibido: " + apellido);
		System.out.println("📥 Email recibido: " + email);
		System.out.println("📥 Teléfono recibido: " + telefono);
		System.out.println("📥 Contraseña recibida: " + contrasenia);

		try {
			UsuarioDto usuarioNuevo = new UsuarioDto();
			usuarioNuevo.setNombre(nombre);
			usuarioNuevo.setApellido(apellido);
			usuarioNuevo.setEmail(email);
			usuarioNuevo.setTelefono(telefono);

			usuarioNuevo.setContrasenia(passwordEncoder.encode(contrasenia));

			// 🔹 Verificar qué datos se están enviando a la API
			System.out.println("📤 Enviando usuario a la API: " + usuarioNuevo);

			String resultado = usuarioService.registrarUsuario(usuarioNuevo, session);

			if ("success".equals(resultado)) {
				session.setAttribute("usuario", usuarioNuevo);
				return "redirect:/?mensaje=success";
			} else {
				return "redirect:/?mensaje=error";
			}

		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/?mensaje=error";
		}
	}

}

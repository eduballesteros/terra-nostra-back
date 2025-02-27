package com.terra_nostra.controller;

import com.terra_nostra.dto.LoginDto;
import com.terra_nostra.dto.UsuarioDto;
import com.terra_nostra.service.UsuarioService;
import com.terra_nostra.utils.JwtUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public String loginUsuario(
            @RequestParam("email")String email,
            @RequestParam("contrasenia")String contrasenia,
            HttpSession session){

        System.out.println("📥 Email recibido: " + email);
        System.out.println("📥 Contraseña recibida: " + contrasenia);

        try{
            LoginDto loginDto = new LoginDto();
            loginDto.setEmail(email);
            loginDto.setContrasenia(contrasenia);

            UsuarioDto usuario = usuarioService.autenticarUsuario(loginDto);
            if(usuario !=null){

                String token = jwtUtil.generarToken(email);
                session.setAttribute("token", token);
                session.setAttribute("usuario",usuario);

                System.out.println("✅ Usuario autenticado: " + usuario.getEmail());
                System.out.println("🔑 Token generado: " + token);

                return "redirect:/index"; // Redirige al dashboard si el login es exitoso

            }else {
                System.out.println("❌ Credenciales incorrectas");
                return "redirect:/index?mensaje=error"; // Redirige al login con un mensaje de error
            }

        } catch (Exception e) {
        e.printStackTrace();
        return "redirect:/index?mensaje=error"; // En caso de error, redirige al login
    }

    }

}

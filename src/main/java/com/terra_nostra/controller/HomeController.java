package com.terra_nostra.controller;

import com.terra_nostra.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
import com.terra_nostra.dto.UsuarioDto;
import com.terra_nostra.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private UsuarioService usuarioService;

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);


    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/terra-nostra")
    public String home() {
        return "index";
    }

    @GetMapping("/shop")
    public ModelAndView mostrarTienda() {
        return new ModelAndView("shop");
    }

    @GetMapping("/admin")
    public ModelAndView panelAdmin(HttpServletRequest request) {
        logger.info("📢 Iniciando carga de la página de administración...");

        ModelAndView mav = new ModelAndView("admin");

        // Verificar el token desde las cookies
        String token = obtenerTokenDesdeCookies(request);

        if (token == null || !jwtUtil.isTokenValido(token)) {
            logger.warn("⚠ Token no válido o inexistente. Redirigiendo a error.");
            mav.setViewName("error");
        } else {
            String usuarioLogueado = jwtUtil.obtenerEmailDesdeToken(token);
            String rolUsuario = jwtUtil.obtenerRolDesdeToken(token);

            if ("ROLE_ADMIN".equals(rolUsuario)) {
                logger.info("✅ Usuario autenticado como ADMIN: {}", usuarioLogueado);
                mav.addObject("usuarioLogueado", usuarioLogueado);

                // 🔥 Obtener la lista de usuarios desde la API
                List<UsuarioDto> usuarios = usuarioService.obtenerTodosLosUsuarios();

                if (usuarios == null || usuarios.isEmpty()) {
                    logger.warn("⚠ No se encontraron usuarios en la API.");
                } else {
                    logger.info("✅ Usuarios obtenidos con éxito: {} registros.", usuarios.size());
                }

                mav.addObject("usuarios", usuarios);
            } else {
                logger.warn("⛔ Acceso denegado para usuario: {} (No es ADMIN)", usuarioLogueado);
                mav.setViewName("redirect:/error");
            }
        }

        return mav;
    }

    @GetMapping("/adminUser")
    public ModelAndView panelUsuario(HttpServletRequest request) {
        ModelAndView mav = new ModelAndView("adminUser");
        String token = obtenerTokenDesdeCookies(request);

        if (token == null || !jwtUtil.isTokenValido(token)) {
            mav.setViewName("error");
        } else {
            String usuarioLogueado = jwtUtil.obtenerEmailDesdeToken(token);
            String rolUsuario = jwtUtil.obtenerRolDesdeToken(token);

            if ("ROLE_USER".equals(rolUsuario)) {
                mav.addObject("usuarioLogueado", usuarioLogueado);
            } else {
                mav.setViewName("redirect:/error");
            }
        }

        return mav;
    }

    @GetMapping("/error")
    public ModelAndView errorPage() {
        return new ModelAndView("error");
    }

    private String obtenerTokenDesdeCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("SESSIONID".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}

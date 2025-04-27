package com.terra_nostra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration

/**
 * Configuración de seguridad de Spring Security.
 * Define una cadena de filtros de seguridad (`SecurityFilterChain`) con reglas de acceso personalizadas.
 *
 * @author ebp
 * @version 1.0
 */


public class SecurityConfig {

    /**
     * Configura la seguridad de la aplicación.
     *
     * - Permite el acceso a todas las rutas sin autenticación (`permitAll()`).
     * - Deshabilita la protección CSRF (`csrf.disable()`), útil en APIs sin sesiones.
     * - Deshabilita el formulario de inicio de sesión (`formLogin.disable()`).
     * - Deshabilita la funcionalidad de logout (`logout.disable()`).
     *
     * @param http Objeto `HttpSecurity` para configurar las reglas de seguridad.
     * @return Una instancia de `SecurityFilterChain` con la configuración definida.
     * @throws Exception Si ocurre algún error en la configuración.
     */


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Permitir acceso a todas las rutas
                )
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF si es necesario
                .formLogin(form -> form.disable()) // Deshabilitar el formulario de login
                .logout(logout -> logout.disable()); // Deshabilitar logout

        return http.build();
    }

}
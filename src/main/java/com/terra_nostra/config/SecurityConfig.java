package com.terra_nostra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

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

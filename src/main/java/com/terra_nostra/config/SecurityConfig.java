package com.terra_nostra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/", "/terra-nostra", "/index.jsp", "/css/**", "/js/**", "/images/**").permitAll()  // Rutas públicas sin autenticación
                                .anyRequest().authenticated()  // Cualquier otra ruta requiere autenticación
                )
                .oauth2Login(oauth2 ->
                        oauth2
                                .defaultSuccessUrl("/terra-nostra", true)  // Redirige a la página principal después de login exitoso
                                .failureUrl("/error")  // Redirige a la página de error si el login falla
                )
                .logout(logout ->
                        logout
                                .logoutSuccessUrl("/index.jsp")  // Redirige a /index.jsp después de cerrar sesión
                                .permitAll()
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}

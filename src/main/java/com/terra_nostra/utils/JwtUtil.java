package com.terra_nostra.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component

/**
 * Utilidad para la generación y validación de tokens JWT.
 * Se usa para autenticar y autorizar usuarios en la aplicación.
 *
 * @author ebp
 * @version 1.0
 */

public class JwtUtil {

    private static final String SECRET_KEY = "TuClaveSuperSecretaParaFirmarJWT1234567890123456";

    /**
     * Genera un token JWT con el email y el rol del usuario.
     *
     * @param email Correo electrónico del usuario.
     * @param rol Rol del usuario en el sistema (ejemplo: "ROLE_USER" o "ROLE_ADMIN").
     * @return Token JWT generado.
     */

    public String generarToken(String email, String rol) {
        byte[] keyBytes = SECRET_KEY.getBytes();
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);

        return Jwts.builder()
                .setSubject(email) // Email como identificador del usuario
                .claim("rol", rol) // Guardar el rol en el token
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrae el rol del usuario desde un token JWT.
     *
     * @param token Token JWT del cual extraer el rol.
     * @return Rol del usuario almacenado en el token.
     */


    public String obtenerRolDesdeToken(String token) {
        byte[] keyBytes = SECRET_KEY.getBytes();
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("rol", String.class); // Extraer el rol del token
    }

    /**
     * Extrae el email del usuario desde un token JWT.
     *
     * @param token Token JWT del cual extraer el email.
     * @return Email del usuario almacenado en el token.
     */

    public String obtenerEmailDesdeToken(String token) {
        return Jwts.parserBuilder() // ✅ Cambio aquí: usar parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())
                .build() // ✅ Ahora sí funciona en jjwt 0.11.5
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Verifica si un token JWT es válido y no ha expirado.
     *
     * @param token Token JWT a validar.
     * @return `true` si el token es válido, `false` si ha expirado o es inválido.
     */

    public boolean isTokenValido(String token) {
        try {
            // Parsear el token para verificar su validez
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .build()
                    .parseClaimsJws(token); // Si el token no es válido, esto lanzará una excepción

            // Verificar si el token ha expirado
            Date expirationDate = claimsJws.getBody().getExpiration();
            return expirationDate.after(new Date()); // Si la fecha de expiración es mayor que la fecha actual, el token es válido
        } catch (JwtException | IllegalArgumentException e) {
            // Si el token no es válido o ha expirado, se captura la excepción
            return false;
        }
    }
}

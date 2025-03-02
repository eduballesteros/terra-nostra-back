package com.terra_nostra.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "TuClaveSuperSecretaParaFirmarJWT1234567890123456";

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

    public String generarTokenII(String email) {
        byte[] keyBytes = SECRET_KEY.getBytes();
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);

        return Jwts.builder()
                .setSubject(email) // Email como identificador del usuario
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

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


    public String obtenerEmailDesdeToken(String token) {
        return Jwts.parserBuilder() // ✅ Cambio aquí: usar parserBuilder()
                .setSigningKey(SECRET_KEY.getBytes())
                .build() // ✅ Ahora sí funciona en jjwt 0.11.5
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

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

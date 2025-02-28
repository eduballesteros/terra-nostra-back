package com.terra_nostra.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "TuClaveSuperSecretaParaFirmarJWT1234567890123456";

    public String generarToken(String email) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

        return Jwts.builder()
                .setSubject(email) // ✅ Uso correcto de setSubject()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
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

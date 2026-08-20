package br.edu.ifspcjo.ads.web2.ifitness.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;

    public TokenService(JwtEncoder encoder, JwtDecoder decoder) {
        this.encoder = encoder;
        this.decoder = decoder;
    }

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        		
        
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS)) // Token expira em 1 hora
                .subject(authentication.getName())
                .claim("authorities", authorities)
                .claim("user_id, )
                .build();
        
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
    
    public String generateRefreshToken(Authentication authentication) {
        Instant now = Instant.now();
        
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(7, ChronoUnit.DAYS)) // Refresh Token expira em 7 dias
                .subject(authentication.getName())
                // IMPORTANTE: Não inclua scopes/authorities no refresh token.
                // Sua única finalidade é obter um novo access token.
                .build();
        
        return this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
    
    /**
     * Valida um token e extrai o 'subject' (nome de usuário).
     * @param token O token JWT a ser validado.
     * @return Um Optional contendo o nome de usuário se o token for válido, ou vazio caso contrário.
]     */
    public Optional<String> validateTokenAndGetSubject(String token) {
        try {
            Jwt jwt = this.decoder.decode(token);
            // Verifica se o token não tem a claim 'scope', confirmando que é um refresh token
            if (jwt.getClaim("scope") != null) {
                return Optional.empty(); // Não é um refresh token
            }
            return Optional.of(jwt.getSubject());
        } catch (JwtException e) {
            // O token é inválido (expirado, malformado, etc.)
            return Optional.empty();
        }
    }
}

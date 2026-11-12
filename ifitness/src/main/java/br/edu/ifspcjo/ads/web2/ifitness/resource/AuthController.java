package br.edu.ifspcjo.ads.web2.ifitness.resource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;

import br.edu.ifspcjo.ads.web2.ifitness.service.TokenService;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

	// A duração do refresh token em segundos (7 dias)
    public static final long REFRESH_TOKEN_DURATION_SEC = 60 * 60 * 24 * 7; 
    
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    
    @Value("${ifitness.cookie.path}")
    private String cookiePath;

    @Value("${ifitness.cookie.secure}")
    private boolean cookieSecure;

    // DTOs para requisição e resposta
    public record LoginRequest(String username, String password) {}
    public record LoginResponse(String accessToken) {} // Agora só retorna o access token

    public AuthController(TokenService tokenService, AuthenticationManager authenticationManager, UserDetailsService userDetailsService) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
        );
        String accessToken = tokenService.generateToken(authentication);
        String refreshToken = tokenService.generateRefreshToken(authentication);

        // Cria o cookie com o refresh token
     // Cria o cookie com o refresh token
        ResponseCookie cookie = refreshTokenCookie(refreshToken, REFRESH_TOKEN_DURATION_SEC);


        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return new LoginResponse(accessToken);
    }
    
    @PostMapping("/refresh")
    public LoginResponse refreshToken(@CookieValue String refreshToken, HttpServletResponse response) {
        return tokenService.validateTokenAndGetSubject(refreshToken)
                .map(subject -> {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(subject);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                    
                    String newAccessToken = tokenService.generateToken(authentication);
                    String newRefreshToken = tokenService.generateRefreshToken(authentication);
                    
                 // Gera e define o novo cookie de refresh token
                    ResponseCookie cookie = refreshTokenCookie(newRefreshToken, REFRESH_TOKEN_DURATION_SEC);
                    
                    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                    return new LoginResponse(newAccessToken);
                })
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Refresh token inválido ou expirado"));
    }
    
    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        // Para fazer logout, criamos um cookie que expira imediatamente
    	// Para fazer logout, criamos um cookie que expira imediatamente
        ResponseCookie cookie = refreshTokenCookie("", 0);
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
    
 // Monta o cookie do refresh token. O caminho e a exigência de HTTPS vêm da configuração.
    private ResponseCookie refreshTokenCookie(String value, long maxAge) {
        return ResponseCookie.from("refreshToken", value)
                .httpOnly(true)       // Impede acesso via JavaScript (XSS protection)
                .secure(cookieSecure) // true = enviar apenas em HTTPS (produção)
                .path(cookiePath)     // Caminho onde o cookie é válido
                .maxAge(maxAge)       // Tempo de vida do cookie (0 = apagar)
                .sameSite("Strict")   // Restringe o envio a requisições do mesmo site (CSRF protection)
                .build();
    }
    
}

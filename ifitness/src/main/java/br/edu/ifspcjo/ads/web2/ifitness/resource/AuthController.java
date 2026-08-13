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
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true) // Impede acesso via JavaScript (XSS protection)
                .secure(false)   // true - Enviar apenas em HTTPS (essencial em produção)
                .path("/auth") // Caminho onde o cookie é válido
                .maxAge(REFRESH_TOKEN_DURATION_SEC) // Tempo de vida do cookie
                .sameSite("Strict") // Restringe o envio do cookie a requisições do mesmo site (CSRF protection)
                .build();

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
                    ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                        .httpOnly(true).secure(false).path("/auth")
                        .maxAge(REFRESH_TOKEN_DURATION_SEC).sameSite("Strict").build();
                    
                    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                    return new LoginResponse(newAccessToken);
                })
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Refresh token inválido ou expirado"));
    }
    
    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {
        // Para fazer logout, criamos um cookie que expira imediatamente
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true).secure(false).path("/auth")
                .maxAge(0) // Expira o cookie
                .sameSite("Strict").build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return "Logout realizado com sucesso.";
    }
    
}

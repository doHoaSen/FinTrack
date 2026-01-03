package doHoaSen.FinTrack.auth.security;

import doHoaSen.FinTrack.auth.dto.CustomUserDetails;
import doHoaSen.FinTrack.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 헤더 추출
        String authHeader = request.getHeader("Authorization");

        // 토큰이 없거나 "Bearer "로 시작하지 않으면 패스 (인증 불필요한 요청)
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        // 실제 토큰 부분 추출
         String token = authHeader.substring(7);

        // JWT 유효성 검사 (만료, 위조, 서명 불일치 등 체크)
        // 인증 실패 시 바로 401 반환하도록 변경
        if (!jwtProvider.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String email = jwtProvider.getEmailFromToken(token);
        // 토큰에서 이메일 추출해
        // DB에서 사용자 조회,
        userRepository.findByEmailAndIsDeletedFalse(email).ifPresent(user -> {
            // 인증 객체 생성하여
            CustomUserDetails customUserDetails =
                    new CustomUserDetails(
                            user.getId(),
                            user.getEmail(),
                            user.getPassword(),
                            List.of()
                    );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            customUserDetails,
                            null,
                            customUserDetails.getAuthorities()
                    );

            // 요청 세부 정보 추가 (IP, 세션ID 등)
            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request
                    )
            );
            // 인증 객체를 SecurityContext에 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
        });

        // 다음 필터로 요청 전달
        filterChain.doFilter(request, response);

        System.out.println("authHeader = " + authHeader);
        System.out.println("token = " + token);
        System.out.println("validateToken = " + jwtProvider.validateToken(token));
        System.out.println("email = " + email);

    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request){
        String path = request.getRequestURI();
        return path.startsWith("/api/auth") || path.startsWith("api/user");
    }
}

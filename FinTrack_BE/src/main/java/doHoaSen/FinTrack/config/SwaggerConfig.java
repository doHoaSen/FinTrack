package doHoaSen.FinTrack.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI fintrackOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FinTrack API Documentation")
                        .description("지출 분석 · 목표 관리 · 대시보드 API 문서. " +
                                "인증은 httpOnly 쿠키(access_token) 기반이므로 " +
                                "/api/auth/login 호출 후 같은 브라우저 세션에서 바로 다른 API를 테스트할 수 있습니다.")
                        .version("v1.0"));
    }
}

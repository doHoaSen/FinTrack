//package doHoaSen.FinTrack.config;
//
//import io.swagger.v3.oas.models.Components;
//import io.swagger.v3.oas.models.OpenAPI;
//import io.swagger.v3.oas.models.info.Info;
//import io.swagger.v3.oas.models.security.SecurityRequirement;
//import io.swagger.v3.oas.models.security.SecurityScheme;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class SwaggerConfig {
//    @Bean
//    public OpenAPI fintrackOpenAPI(){
//        return new OpenAPI()
//                .info(new Info()
//                        .title("FinTrack API Documentation")
//                        .description("지출 분석 · 목표 관리 · 대시보드 API 문서")
//                        .version("v1.0"));
//    }
//
//    @Bean
//    public OpenAPI customizeOpenAPI() {
//        return new OpenAPI()
//                .components(new Components().addSecuritySchemes("BearerAuth",
//                        new SecurityScheme()
//                                .type(SecurityScheme.Type.HTTP)
//                                .scheme("bearer")
//                                .bearerFormat("JWT")
//                ))
//                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
//                .info(new Info().title("FinTrack API").version("v1"));
//    }
//
//}

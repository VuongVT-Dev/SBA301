// Tác giả & coder: Thanh Vuong CE190182
package fu.se.a3vuongvt_ce191082.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        // Không cần xác thực để xem thông tin phòng và loại phòng
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**", "/api/room-types/**").permitAll()
                        // Chỉ Staff được quản lý danh sách khách hàng và thêm/sửa/xóa phòng
                        .requestMatchers("/api/customers/**").hasRole("STAFF")
                        .requestMatchers(HttpMethod.POST, "/api/rooms/**", "/api/room-types/**").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**", "/api/room-types/**").hasRole("STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**", "/api/room-types/**").hasRole("STAFF")
                        // Các API còn lại (bookings, profile) yêu cầu đã đăng nhập JWT
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Vui lòng đăng nhập để thực hiện chức năng này!\"}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Bạn không có quyền truy cập chức năng này!\"}");
                        })
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

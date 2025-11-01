package backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Primary;
import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class securityConfig {

  @Bean(name = "graphqlCorsSource")
  @Primary
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowCredentials(true);
    cfg.setAllowedOrigins(Arrays.asList(
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "https://graphqlproject-lake.vercel.app"
    ));
    cfg.addAllowedHeader("Content-Type");
    cfg.addAllowedHeader("Authorization");
    cfg.addAllowedMethod("POST");
    cfg.addAllowedMethod("OPTIONS");

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/graphql", cfg);
    return source;
  }

  @Bean
  public SecurityFilterChain filterChain(
      HttpSecurity http,
      @Qualifier("graphqlCorsSource") CorsConfigurationSource corsSource
  ) throws Exception {

    http
      .cors(cors -> cors.configurationSource(corsSource))
      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/graphql").permitAll()
        .requestMatchers("/graphql").permitAll()
        .anyRequest().permitAll()
      );
    return http.build();
  }
}

package com.jobportal.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtFilter filter) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(
                        List.of("http://localhost:5173")
                );

                config.setAllowedMethods(
                        List.of("*")
                );

                config.setAllowedHeaders(
                        List.of("*")
                );

                return config;
            }))

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth ->
                    auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/jobs",
                                "/api/jobs/search"
                        )
                        .permitAll()

                        .anyRequest()
                        .authenticated()
            )

            .addFilterBefore(
                    filter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
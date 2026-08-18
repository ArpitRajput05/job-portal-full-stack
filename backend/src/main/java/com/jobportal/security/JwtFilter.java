package com.jobportal.security;

import com.jobportal.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwt; private final UserRepository users;
    public JwtFilter(JwtService jwt,UserRepository users){this.jwt=jwt;this.users=users;}
    protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
        String h=req.getHeader("Authorization");
        if(h!=null && h.startsWith("Bearer ")){
            String token=h.substring(7);
            try{
                String email=jwt.extractEmail(token);
                var u=users.findByEmail(email).orElse(null);
                if(u!=null && jwt.valid(token)){
                    var auth=new UsernamePasswordAuthenticationToken(email,null,List.of(new SimpleGrantedAuthority("ROLE_"+u.getRole())));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }catch(Exception ignored){}
        }
        chain.doFilter(req,res);
    }
}

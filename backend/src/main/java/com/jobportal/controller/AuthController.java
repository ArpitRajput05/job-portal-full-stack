package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtService;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(UserRepository u,PasswordEncoder e,JwtService j){users=u;encoder=e;jwt=j;}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> b){
        if(users.findByEmail(b.get("email")).isPresent()) return ResponseEntity.badRequest().body("Email already exists");
        Role role=Role.valueOf(b.getOrDefault("role","CANDIDATE").toUpperCase());
        User u=new User(b.get("name"),b.get("email"),encoder.encode(b.get("password")),role);
        users.save(u); return ResponseEntity.ok(Map.of("message","Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> b){
        User u=users.findByEmail(b.get("email")).orElse(null);
        if(u==null || !encoder.matches(b.get("password"),u.getPassword())) return ResponseEntity.status(401).body("Invalid email or password");
        return ResponseEntity.ok(Map.of("token",jwt.generate(u.getEmail()),"role",u.getRole().name(),"name",u.getName()));
    }
}

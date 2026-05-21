package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.AuthUser;
import com.cinjudesco.biblioteca.repository.AuthUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthUserRepository repo;

    public AuthController(AuthUserRepository repo) {
        this.repo = repo;
    }

    // CREAR USUARIO
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthUser user) {

        AuthUser existe = repo.findByCorreo(user.getCorreo());

        if (existe != null) {
            return ResponseEntity.badRequest()
                    .body("El correo ya existe");
        }

        return ResponseEntity.ok(repo.save(user));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthUser loginData) {

        AuthUser user = repo.findByCorreo(loginData.getCorreo());

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Usuario no encontrado");
        }

        if (!user.getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.status(401)
                    .body("Contraseña incorrecta");
        }

        return ResponseEntity.ok(user);
    }
}
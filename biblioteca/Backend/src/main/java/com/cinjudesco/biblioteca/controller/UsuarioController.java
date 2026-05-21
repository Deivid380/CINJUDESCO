package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Usuario;
import com.cinjudesco.biblioteca.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repo;

    public UsuarioController(UsuarioRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Usuario guardar(@RequestBody Usuario u) {
        return repo.save(u);
    }

    @GetMapping
    public Object listar() {
        return repo.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginData) {

        System.out.println("CORREO RECIBIDO: " + loginData.getCorreo());
        System.out.println("PASSWORD RECIBIDA: " + loginData.getContrasena());

        Optional<Usuario> optionalUsuario =
                repo.findByCorreoIgnoreCase(loginData.getCorreo().trim());

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Usuario usuario = optionalUsuario.get();

        String passwordDB = usuario.getContrasena().trim();
        String passwordRequest = loginData.getContrasena().trim();

        System.out.println("PASSWORD DB: " + passwordDB);
        System.out.println("PASSWORD REQUEST: " + passwordRequest);

        if (!passwordDB.equals(passwordRequest)) {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("id", usuario.getId());
        respuesta.put("nombre", usuario.getNombre());
        respuesta.put("correo", usuario.getCorreo());

        return ResponseEntity.ok(respuesta);
    }
}
package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Usuario;
import com.cinjudesco.biblioteca.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repo;

    public UsuarioController(UsuarioRepository repo) {
        this.repo = repo;
    }

    // Registrar usuario
    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return repo.save(usuario);
    }

    // Listar usuarios
    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }

    // Buscar por correo
    @GetMapping("/correo/{correo}")
    public Usuario buscarPorCorreo(@PathVariable String correo) {
        return repo.findByCorreo(correo);
    }
}
package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Usuario;
import com.cinjudesco.biblioteca.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
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
    public List<Usuario> listar() {
        return repo.findAll();
    }
}
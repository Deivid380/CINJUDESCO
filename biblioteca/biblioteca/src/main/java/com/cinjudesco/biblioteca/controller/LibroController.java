package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Libro;
import com.cinjudesco.biblioteca.repository.LibroRepository;
import com.cinjudesco.biblioteca.service.GoogleSheetsService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/libros")
@CrossOrigin
public class LibroController {

    private final LibroRepository repo;

    public LibroController(LibroRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/google")
    public List<Libro> obtenerDesdeGoogle() {
        return GoogleSheetsService.obtenerLibros();
    }

    @PostMapping
    public Libro guardar(@RequestBody Libro libro) {
        return repo.save(libro);
    }

    @PutMapping("/{id}/prestar")
    public Libro prestar(@PathVariable Long id) {
        Libro libro = repo.findById(id).orElseThrow();
        libro.setDisponible(false);
        return repo.save(libro);
    }

    @PutMapping("/{id}/devolver")
    public Libro devolver(@PathVariable Long id) {
        Libro libro = repo.findById(id).orElseThrow();
        libro.setDisponible(true);
        return repo.save(libro);
    }
}
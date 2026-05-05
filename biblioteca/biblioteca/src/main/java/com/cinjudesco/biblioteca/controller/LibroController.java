package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Libro;
import com.cinjudesco.biblioteca.repository.LibroRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/libros")
@CrossOrigin(origins = "*")
public class LibroController {

    private final LibroRepository repo;

    public LibroController(LibroRepository repo) {
        this.repo = repo;
    }

    // 📚 Obtener todos los libros
    @GetMapping
    public List<Libro> listar() {
        return repo.findAll();
    }

    // ➕ Crear libro
    @PostMapping
    public Libro crear(@RequestBody Libro libro) {
        libro.setDisponible(true); // por defecto disponible
        return repo.save(libro);
    }

@PutMapping("/{isbn}/prestar")
public Libro prestar(@PathVariable String isbn) {
    Libro libro = repo.findById(isbn).orElseThrow();
    libro.setDisponible(false);
    return repo.save(libro);
}

@PutMapping("/{isbn}/devolver")
public Libro devolver(@PathVariable String isbn) {
    Libro libro = repo.findById(isbn).orElseThrow();
    libro.setDisponible(true);
    return repo.save(libro);
}

@DeleteMapping("/{isbn}")
public void eliminar(@PathVariable String isbn) {
    repo.deleteById(isbn);
}
}
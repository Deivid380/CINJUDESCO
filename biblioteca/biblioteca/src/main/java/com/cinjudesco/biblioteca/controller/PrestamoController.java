package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.*;
import com.cinjudesco.biblioteca.repository.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/prestamos")
@CrossOrigin
public class PrestamoController {

    private final PrestamoRepository repo;
    private final LibroRepository libroRepo;

    public PrestamoController(PrestamoRepository repo, LibroRepository libroRepo) {
        this.repo = repo;
        this.libroRepo = libroRepo;
    }

    @PostMapping
    public Prestamo prestar(@RequestBody Prestamo prestamo) {

        prestamo.setFechaPrestamo(LocalDateTime.now());

        // marcar libro como no disponible
        Libro libro = libroRepo.findById(prestamo.getIsbnLibro()).orElseThrow();
        libro.setDisponible(false);
        libroRepo.save(libro);

        return repo.save(prestamo);
    }

    @PutMapping("/devolver/{isbn}")
    public Prestamo devolver(@PathVariable String isbn) {

        Prestamo prestamo = repo
            .findByIsbnLibroAndFechaDevolucionIsNull(isbn)
            .orElseThrow();

        prestamo.setFechaDevolucion(LocalDateTime.now());

        Libro libro = libroRepo.findById(isbn).orElseThrow();
        libro.setDisponible(true);
        libroRepo.save(libro);

        return repo.save(prestamo);
    }
}

package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Libro;
import com.cinjudesco.biblioteca.model.Prestamo;
import com.cinjudesco.biblioteca.repository.LibroRepository;
import com.cinjudesco.biblioteca.repository.PrestamoRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/prestamos")
@CrossOrigin(origins = "*")
public class PrestamoController {

    private final PrestamoRepository repo;
    private final LibroRepository libroRepo;

    public PrestamoController(
            PrestamoRepository repo,
            LibroRepository libroRepo
    ) {
        this.repo = repo;
        this.libroRepo = libroRepo;
    }

    // =========================
    // REGISTRAR PRESTAMO
    // =========================

    @PostMapping
    public Prestamo prestar(@RequestBody Prestamo prestamo) {

        prestamo.setFechaPrestamo(LocalDate.now());

        // marcar libro como no disponible
        Libro libro = libroRepo.findById(prestamo.getIsbn())
                .orElseThrow();

        libro.setDisponible(false);

        libroRepo.save(libro);

        return repo.save(prestamo);
    }

    // =========================
    // LISTAR PRESTAMOS ACTIVOS
    // =========================

    @GetMapping
    public List<Prestamo> listarActivos() {

        return repo.findByFechaDevolucionIsNull();
    }

    // =========================
    // DEVOLVER LIBRO
    // =========================

    @PutMapping("/devolver/{isbn}")
    public Prestamo devolver(@PathVariable String isbn) {

        Prestamo prestamo = repo
                .findByIsbnAndFechaDevolucionIsNull(isbn)
                .orElseThrow();

        prestamo.setFechaDevolucion(LocalDate.now());

        Libro libro = libroRepo.findById(isbn)
                .orElseThrow();

        libro.setDisponible(true);

        libroRepo.save(libro);

        return repo.save(prestamo);
    }
}
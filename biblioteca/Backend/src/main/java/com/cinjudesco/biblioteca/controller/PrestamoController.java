package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.*;
import com.cinjudesco.biblioteca.repository.*;

import main.java.com.cinjudesco.biblioteca.model.Carnet;
import main.java.com.cinjudesco.biblioteca.repository.CarnetRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cinjudesco.biblioteca.dto.PrestamoRequest;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/prestamos")
@CrossOrigin(origins = "*")
public class PrestamoController {

    private final PrestamoRepository prestamoRepo;
    private final CarnetRepository carnetRepo;

    public PrestamoController(
            PrestamoRepository prestamoRepo,
            CarnetRepository carnetRepo) {
        this.prestamoRepo = prestamoRepo;
        this.carnetRepo = carnetRepo;
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody PrestamoRequest request) {

        Carnet carnet = carnetRepo.findByNumeroCarnet(request.getNumeroCarnet());

        if (carnet == null) {
            return ResponseEntity.badRequest()
                    .body("Carnet no encontrado");
        }

        Prestamo prestamo = new Prestamo();

        prestamo.setIsbn(request.getIsbn());
        prestamo.setTituloLibro(request.getTituloLibro());
        prestamo.setCarnet(carnet);

        return ResponseEntity.ok(
                prestamoRepo.save(prestamo));
    }

    @GetMapping
    public List<Prestamo> listar() {
        return prestamoRepo.findByDevueltoFalse();
    }

    @PutMapping("/devolver/{id}")
    public ResponseEntity<?> devolver(@PathVariable Long id) {

        Prestamo prestamo = prestamoRepo.findById(id)
                .orElseThrow();

        prestamo.setDevuelto(true);
        prestamo.setFechaDevolucion(LocalDate.now());

        return ResponseEntity.ok(
                prestamoRepo.save(prestamo));
    }
}
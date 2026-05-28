package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Carnet;
import com.cinjudesco.biblioteca.repository.CarnetRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carnets")
@CrossOrigin(origins = "*")
public class CarnetController {

    private final CarnetRepository repo;

    public CarnetController(CarnetRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Carnet> listar() {
        return repo.findAll();
    }

    @GetMapping("/{numeroCarnet}")
    public ResponseEntity<?> buscar(@PathVariable String numeroCarnet) {

        Carnet carnet = repo.findByNumeroCarnet(numeroCarnet);

        if (carnet == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(carnet);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Carnet carnet) {

        if (repo.findByNumeroCarnet(carnet.getNumeroCarnet()) != null) {
            return ResponseEntity.badRequest()
                    .body("El carnet ya existe");
        }

        return ResponseEntity.ok(repo.save(carnet));
    }
}
package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Nino;
import com.cinjudesco.biblioteca.repository.NinoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ninos")
@CrossOrigin
public class NinoController {

    private final NinoRepository repo;

    public NinoController(NinoRepository repo) {
        this.repo = repo;
    }

    // 📥 Registrar niño
    @PostMapping
    public Nino guardar(@RequestBody Nino nino) {
        return repo.save(nino);
    }

    // 📋 Listar niños
    @GetMapping
    public List<Nino> listar() {
        return repo.findAll();
    }
}
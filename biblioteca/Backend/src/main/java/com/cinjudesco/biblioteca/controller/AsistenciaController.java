package com.cinjudesco.biblioteca.controller;

import com.cinjudesco.biblioteca.model.Asistencia;
import com.cinjudesco.biblioteca.repository.AsistenciaRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/asistencias")
@CrossOrigin(origins = "*")
public class AsistenciaController {

    private final AsistenciaRepository repository;

    public AsistenciaController(AsistenciaRepository repository) {
        this.repository = repository;
    }

    // Guardar asistencia
    @PostMapping
    public Asistencia guardar(@RequestBody Asistencia asistencia) {

        asistencia.setFecha(LocalDate.now());

        if (asistencia.getEstudiantes() != null) {
            asistencia.setCantidadAsistentes(
                    asistencia.getEstudiantes().size()
            );
        }

        return repository.save(asistencia);
    }

    // Obtener historial
    @GetMapping
    public List<Asistencia> listar() {
        return repository.findAll();
    }

    // Eliminar asistencia
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
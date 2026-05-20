package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clase;

    private LocalDate fecha;

    @Column(length = 1000)
    private String comentario;

    private int cantidadAsistentes;

    @ManyToMany
    @JoinTable(
            name = "asistencia_ninos",
            joinColumns = @JoinColumn(name = "asistencia_id"),
            inverseJoinColumns = @JoinColumn(name = "nino_id")
    )
    private List<Nino> estudiantes;
}
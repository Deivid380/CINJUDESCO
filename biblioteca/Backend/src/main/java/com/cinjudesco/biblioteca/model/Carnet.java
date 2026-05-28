package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "carnets")
public class Carnet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroCarnet;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String numeroIdentidad;

    @Column(nullable = false)
    private String telefono;

    private LocalDate fechaNacimiento;

    private String direccion;

    private LocalDate fechaCreacion;

    @PrePersist
    public void prePersist() {
        fechaCreacion = LocalDate.now();
    }
}
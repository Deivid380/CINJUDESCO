package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "prestamos")
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String isbn;

    private String tituloLibro;

    private LocalDate fechaPrestamo;

    private LocalDate fechaDevolucion;

    private boolean devuelto = false;

    // =========================
    // DATOS DEL CARNET
    // =========================

    private String numeroCarnet;

    private String nombrePrestatario;

    private String numeroIdentidad;

    private String telefono;
}
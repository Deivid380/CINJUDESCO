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

    @ManyToOne
    @JoinColumn(name = "carnet_id")
    private Carnet carnet;

    private LocalDate fechaPrestamo;

    private LocalDate fechaDevolucion;

    private Boolean devuelto;

    @PrePersist
    public void prePersist() {
        fechaPrestamo = LocalDate.now();
        devuelto = false;
    }
}
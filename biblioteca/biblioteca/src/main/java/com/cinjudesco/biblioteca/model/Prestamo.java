package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Libro libro;

    @ManyToOne
    private Usuario usuario;

    private String fecha;
}
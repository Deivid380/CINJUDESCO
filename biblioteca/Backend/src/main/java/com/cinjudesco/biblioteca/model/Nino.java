package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Nino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;

    private int edad;

    private String telefono;

    private String direccion;

    private String acudiente;

    private LocalDate fechaRegistro;

    private String tipoDocumento;

    private String numeroDocumento;
}
package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreCompleto;
    private int edad;
    private String direccion;

    private String tipoDocumento;
    private String numeroDocumento;

    private String acudiente;
    private String telefonoAcudiente;

    private String rol;
}
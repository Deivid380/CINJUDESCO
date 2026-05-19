package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Nino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombreCompleto;
    private int edad;
    private String direccion;

    private String acudiente;
    private String telefonoAcudiente;

    private String tipoDocumento; // TI o CC
    private String numeroDocumento;
}
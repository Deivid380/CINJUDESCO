package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String isbnLibro;

    private String nombrePersona;
    private String documentoPersona;

    private LocalDateTime fechaPrestamo;
    private LocalDateTime fechaDevolucion;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getIsbnLibro() {
        return isbnLibro;
    }
    public void setIsbnLibro(String isbnLibro) {
        this.isbnLibro = isbnLibro;
    }
    public String getNombrePersona() {
        return nombrePersona;
    }
    public void setNombrePersona(String nombrePersona) {
        this.nombrePersona = nombrePersona;
    }
    public String getDocumentoPersona() {
        return documentoPersona;
    }
    public void setDocumentoPersona(String documentoPersona) {
        this.documentoPersona = documentoPersona;
    }
    public LocalDateTime getFechaPrestamo() {
        return fechaPrestamo;
    }
    public void setFechaPrestamo(LocalDateTime fechaPrestamo) {
        this.fechaPrestamo = fechaPrestamo;
    }
    public LocalDateTime getFechaDevolucion() {
        return fechaDevolucion;
    }
    public void setFechaDevolucion(LocalDateTime fechaDevolucion) {
        this.fechaDevolucion = fechaDevolucion;
    }

 
}
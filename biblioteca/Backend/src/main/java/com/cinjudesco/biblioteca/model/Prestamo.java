package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prestamos")
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String isbn;

    private String tituloLibro;

    private String nombrePrestatario;

    private String documentoPrestatario;

    private String telefonoPrestatario;

    private LocalDate fechaPrestamo;

    private LocalDate fechaDevolucion;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getTituloLibro() {
        return tituloLibro;
    }

    public void setTituloLibro(String tituloLibro) {
        this.tituloLibro = tituloLibro;
    }

    public String getNombrePrestatario() {
        return nombrePrestatario;
    }

    public void setNombrePrestatario(String nombrePrestatario) {
        this.nombrePrestatario = nombrePrestatario;
    }

    public String getDocumentoPrestatario() {
        return documentoPrestatario;
    }

    public void setDocumentoPrestatario(String documentoPrestatario) {
        this.documentoPrestatario = documentoPrestatario;
    }

    public String getTelefonoPrestatario() {
        return telefonoPrestatario;
    }

    public void setTelefonoPrestatario(String telefonoPrestatario) {
        this.telefonoPrestatario = telefonoPrestatario;
    }

    public LocalDate getFechaPrestamo() {
        return fechaPrestamo;
    }

    public void setFechaPrestamo(LocalDate fechaPrestamo) {
        this.fechaPrestamo = fechaPrestamo;
    }

    public LocalDate getFechaDevolucion() {
        return fechaDevolucion;
    }

    public void setFechaDevolucion(LocalDate fechaDevolucion) {
        this.fechaDevolucion = fechaDevolucion;
    }
}
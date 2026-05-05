package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;

@Entity
@Table(name = "libros")
public class Libro {

    @Id
    private String isbn; // 🔥 ahora es el ID

    private String titulo;
    private String autor;

    @Column(length = 2000)
    private String resumen;

    private Boolean disponible;
    private String ubicacion;
    private String portadaUrl;
    private String categoria;

    public Libro() {}

    public Libro(String isbn, String titulo, String autor, String resumen,
                 Boolean disponible, String ubicacion, String portadaUrl, String categoria) {
        this.isbn = isbn;
        this.titulo = titulo;
        this.autor = autor;
        this.resumen = resumen;
        this.disponible = disponible;
        this.ubicacion = ubicacion;
        this.portadaUrl = portadaUrl;
        this.categoria = categoria;
    }

    // GETTERS Y SETTERS

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getResumen() { return resumen; }
    public void setResumen(String resumen) { this.resumen = resumen; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public String getPortadaUrl() { return portadaUrl; }
    public void setPortadaUrl(String portadaUrl) { this.portadaUrl = portadaUrl; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}
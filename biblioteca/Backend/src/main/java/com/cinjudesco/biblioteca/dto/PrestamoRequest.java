package com.cinjudesco.biblioteca.dto;

import lombok.Data;

@Data
public class PrestamoRequest {

    private String isbn;

    private String tituloLibro;

    private String numeroCarnet;
}
package com.cinjudesco.biblioteca.service;

import com.cinjudesco.biblioteca.model.Libro;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleSheetsService {

    private final static String URL_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQL7bpMJk8zVb1Z9QtiTkhbJGdZmDa12z1K2DPqWfnHp9bPw0-YtIijDl_Hp15Xwg/pubhtml";

    public static List<Libro> obtenerLibros() {
        List<Libro> libros = new ArrayList<>();

        try {
            URL url = new URL(URL_SHEET);
            BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()));

            String linea;
            br.readLine(); // saltar encabezado

            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split(",");

                Libro libro = new Libro();
                libro.setTitulo(datos[0]);
                libro.setResumen(datos[1]);
                libro.setDisponible(true);

                libros.add(libro);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return libros;
    }
}
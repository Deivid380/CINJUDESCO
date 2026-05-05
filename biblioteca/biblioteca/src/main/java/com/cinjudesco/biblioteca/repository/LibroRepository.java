package com.cinjudesco.biblioteca.repository;

import com.cinjudesco.biblioteca.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibroRepository extends JpaRepository<Libro, String> {
}
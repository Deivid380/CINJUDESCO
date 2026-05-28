package com.cinjudesco.biblioteca.repository;

import com.cinjudesco.biblioteca.model.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    List<Prestamo> findByDevueltoFalse();

}
package com.cinjudesco.biblioteca.repository;

import com.cinjudesco.biblioteca.model.Nino;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NinoRepository extends JpaRepository<Nino, Long> {
}
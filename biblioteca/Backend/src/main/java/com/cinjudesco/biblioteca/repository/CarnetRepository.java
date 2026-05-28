package com.cinjudesco.biblioteca.repository;

import com.cinjudesco.biblioteca.model.Carnet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarnetRepository extends JpaRepository<Carnet, Long> {

    Carnet findByNumeroCarnet(String numeroCarnet);

}
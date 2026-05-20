package main.java.com.cinjudesco.biblioteca.repository;

import com.cinjudesco.biblioteca.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
}
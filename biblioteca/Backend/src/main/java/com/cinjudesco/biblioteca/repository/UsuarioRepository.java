package com.cinjudesco.biblioteca.repository;

import com.cinjudesco.biblioteca.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByNumeroDocumento(String numeroDocumento);

}
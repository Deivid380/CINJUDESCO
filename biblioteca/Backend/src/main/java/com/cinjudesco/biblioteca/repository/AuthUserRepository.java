package com.cinjudesco.biblioteca.repository;

import com.cinjudesco.biblioteca.model.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> {

    AuthUser findByCorreo(String correo);

}
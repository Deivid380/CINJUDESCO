package com.cinjudesco.biblioteca.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "auth_users")
public class AuthUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(unique = true, nullable = false)
    private String correo;

    @Column(nullable = false)
    private String password;
}
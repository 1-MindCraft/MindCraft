package com.mindcraft.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // OAuth를 사용하면 email이 null?
    @Column(unique = true)
    private String email;

    // OAuth를 사용하면 비밀번호가 null
    private String password;

    // 이메일 회원이면 null
    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private Provider provider = Provider.LOCAL;

    // 이메일 회원이면 null
    @Column(name = "provider_id")
    private String providerId;

    // 최초 1회 생성 후 수정되면 안됨
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

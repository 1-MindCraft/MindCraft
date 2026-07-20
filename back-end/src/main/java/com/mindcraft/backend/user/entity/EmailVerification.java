package com.mindcraft.backend.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verification")
@Getter
@NoArgsConstructor
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 6)
    private String code;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    public EmailVerification(User user, String code) {
        this.user = user;
        this.code = code;
        this.createdAt = LocalDateTime.now();
    }

    public void renew(String newCode) {
        this.code = newCode;
        this.createdAt = LocalDateTime.now();
    }

    public boolean isExpired() {
        return this.createdAt.isBefore(LocalDateTime.now().minusMinutes(5));
    }
}

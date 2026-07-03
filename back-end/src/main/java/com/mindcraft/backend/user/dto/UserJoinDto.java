package com.mindcraft.backend.user.dto;

import com.mindcraft.backend.user.entity.Provider;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinDto {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String password;

    @NotBlank
    private Provider provider;

    private String providerId;
}

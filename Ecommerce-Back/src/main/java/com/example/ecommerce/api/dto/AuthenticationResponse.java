package com.example.ecommerce.api.dto;

import com.example.ecommerce.domain.Enums.UserRol;
import lombok.Data;

@Data
public class AuthenticationResponse {
    private String jwt;

    private UserRol userRole;

    private Long userId;
}

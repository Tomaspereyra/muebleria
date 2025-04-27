package com.example.ecommerce.services;

import com.example.ecommerce.api.dto.SingupRequest;
import com.example.ecommerce.api.dto.UserDto;

public interface IAuthServices {
    UserDto createUser(SingupRequest singupRequest);

    void resetPassword(String email);
}

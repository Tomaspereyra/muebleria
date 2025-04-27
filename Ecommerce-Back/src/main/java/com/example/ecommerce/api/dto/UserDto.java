package com.example.ecommerce.api.dto;

import com.example.ecommerce.domain.Enums.UserRol;
import com.example.ecommerce.domain.models.Address;
import com.example.ecommerce.domain.models.Order;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateCreated;
    private int documentNumber;
    private int phone;
    private UserRol rol;
    private List<Order> orders;
    private List<Address> addresses;
}

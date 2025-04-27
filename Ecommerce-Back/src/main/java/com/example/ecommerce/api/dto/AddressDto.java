package com.example.ecommerce.api.dto;

import lombok.Data;

@Data
public class AddressDto {
    private Long id;
    private String street;
    private int number;
    private int zipCode;
    private String city;
    private String state;
}

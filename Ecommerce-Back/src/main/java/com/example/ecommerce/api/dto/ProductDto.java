package com.example.ecommerce.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private int quantity;
    private double price;
    private String mainImage;
    private List<String> images;
}

package com.example.ecommerce.api.dto;

import com.example.ecommerce.domain.Enums.OrderStatus;
import com.example.ecommerce.domain.models.Address;
import com.example.ecommerce.domain.models.Product;
import com.example.ecommerce.domain.models.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {

    private Long id;
    private double amount;
    private Address address;
    private List<ProductDto> products;
    private OrderStatus status;
    private LocalDateTime dateCreated;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private User user;
    private String comprobanteUrl;
    private Boolean pickup;
}

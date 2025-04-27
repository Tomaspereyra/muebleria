package com.example.ecommerce.domain.exceptions;

public class OrderNotFoundException extends RuntimeException{

    public OrderNotFoundException (String message){
        super(message);
    }
}

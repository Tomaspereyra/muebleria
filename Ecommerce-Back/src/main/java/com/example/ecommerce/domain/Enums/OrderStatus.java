package com.example.ecommerce.domain.Enums;

public enum OrderStatus {
    CREATED,     //sin pagar
    IN_REVIEW,       //El usuario informo el pago, pero aun no el admin no confirma
    PAID,        //El administrador confirmo el pago
    FINISHED,
}

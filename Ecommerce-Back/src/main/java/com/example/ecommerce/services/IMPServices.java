package com.example.ecommerce.services;

import com.example.ecommerce.api.dto.OrderDto;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.Product;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;

import java.util.List;

public interface IMPServices {
    Preference createPreference(OrderDto order) throws MPApiException, MPException;
}

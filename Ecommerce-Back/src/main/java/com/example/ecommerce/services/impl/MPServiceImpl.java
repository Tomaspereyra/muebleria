package com.example.ecommerce.services.impl;

import com.example.ecommerce.api.dto.OrderDto;
import com.example.ecommerce.api.dto.ProductDto;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.Product;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.example.ecommerce.services.IMPServices;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
class MPServiceImpl implements IMPServices {

    @Override
    public Preference createPreference(OrderDto order) throws MPApiException, MPException {
        // Crear una lista de items basados en los productos del carrito
        List<PreferenceItemRequest> items = new ArrayList<>();

        for (ProductDto product : order.getProducts()) {
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(product.getId())) // ID del producto
                    .title(product.getName()) // Nombre del producto
                    .description(product.getDescription()) // Descripción
                    .quantity(product.getQuantity()) // Cantidad del producto
                    .currencyId("ARS") // Moneda: pesos argentinos
                    .unitPrice(new BigDecimal(product.getPrice())) // Precio unitario en ARS
                    .build();

            items.add(itemRequest);
        }

        // Definir las URLs de redirección, incluyendo el ID de la orden
       // String callbackUrl = "http://localhost:3000/order/" + order.getId();
       // String callbackUrl = "http://vps-4482586-x.dattaweb.com/orders";
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://vps-4482586-x.dattaweb.com/orders")
                .failure("http://vps-4482586-x.dattaweb.com/cart")
                .pending("http://vps-4482586-x.dattaweb.com/cart")
                .build();

        // Crear un objeto de tipo PreferenceRequest con los items
        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                .build();

        // Crear un cliente de preferencias y enviar la solicitud para crear la preferencia
        PreferenceClient client = new PreferenceClient();
        return client.create(preferenceRequest);
    }
}

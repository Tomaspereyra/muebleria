package com.example.ecommerce.api.controllers;

import com.example.ecommerce.api.dto.OrderDto;
import com.example.ecommerce.domain.models.Order;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.example.ecommerce.domain.models.Product;
import com.example.ecommerce.services.IMPServices;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/mercadopago")
public class MPController {

    @Autowired
    private IMPServices mpServices;

    @PostMapping("/create_preference")
    public ResponseEntity<String> createPreference(@RequestBody OrderDto order) throws MPApiException, MPException {
        // Llama al servicio con el objeto Order
        Preference preference = mpServices.createPreference(order);

        // Retornar solo el ID de la preferencia
        return ResponseEntity.ok(preference.getId());
    }
}

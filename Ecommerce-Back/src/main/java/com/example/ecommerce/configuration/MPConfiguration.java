package com.example.ecommerce.configuration;

import com.mercadopago.MercadoPagoConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MPConfiguration {
    public MPConfiguration() {
        String accessToken = "APP_USR-8908858336743431-120422-6c98f2068c84c5940b8135614d3a86cc-2139075074"; // Reemplaza con tu access token de producción
        MercadoPagoConfig.setAccessToken(accessToken);
    }

}


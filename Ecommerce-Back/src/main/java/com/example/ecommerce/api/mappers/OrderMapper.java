package com.example.ecommerce.api.mappers;

import com.example.ecommerce.api.dto.OrderDto;
import com.example.ecommerce.api.dto.ProductDto;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.OrderProduct;
import com.example.ecommerce.domain.models.Product;
import lombok.experimental.UtilityClass;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class OrderMapper {

    public OrderDto toOrderDTO(Order order) {
        OrderDto orderDTO = new OrderDto();
        orderDTO.setId(order.getId());
        orderDTO.setAmount(order.getAmount());
        orderDTO.setAddress(order.getAddress());

        List<ProductDto> productDtos = order.getOrderProducts().stream()
                .map(orderProduct -> {
                    Product product = orderProduct.getProduct();
                    ProductDto productDto = new ProductDto();
                    productDto.setId(product.getId());
                    productDto.setName(product.getName());
                    productDto.setDescription(product.getDescription());
                    productDto.setPrice(product.getPrice());
                    productDto.setMainImage(product.getMainImage());
                    productDto.setImages(product.getImages());
                    productDto.setQuantity(orderProduct.getQuantity());
                    return productDto;
                })
                .collect(Collectors.toList());
        orderDTO.setProducts(productDtos);

        orderDTO.setStatus(order.getStatus());
        orderDTO.setDateCreated(order.getDateCreated());
       // orderDTO.setUser(order.getUser());
        orderDTO.setComprobanteUrl(order.getComprobanteUrl());
        orderDTO.setPickup(order.getPickup());
        return orderDTO;
    }

    public Order toOrder(OrderDto orderDTO) {
        Order order = new Order();
        order.setId(orderDTO.getId());
        order.setAmount(orderDTO.getAmount());
        order.setAddress(orderDTO.getAddress());
        order.setOrderProducts(orderDTO.getProducts().stream()
                .map(productDto -> {
                            Product product = ProductMapper.dtoToProduct(productDto);
                            OrderProduct orderProduct = new OrderProduct();
                            orderProduct.setProduct(product);
                            return orderProduct;
                        })
                .collect(Collectors.toList()));
        order.setStatus(orderDTO.getStatus());
        order.setDateCreated(LocalDateTime.now());
        order.setUser(orderDTO.getUser());
        order.setPickup(orderDTO.getPickup());
        return order;
    }
}

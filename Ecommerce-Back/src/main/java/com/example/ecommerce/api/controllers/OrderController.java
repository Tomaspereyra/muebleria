package com.example.ecommerce.api.controllers;

import com.example.ecommerce.api.dto.OrderDto;
import com.example.ecommerce.domain.Enums.OrderStatus;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.services.IOrderServices;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "/api")
public class OrderController {
    @Autowired
    private IOrderServices orderService;

    @PostMapping(value = "/orders")
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto, Authentication authentication) throws MessagingException {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        OrderDto createdOrder = orderService.createOrder(orderDto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/orders/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping(value = "/orders/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        String result = orderService.deleteOrder(id);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/orders/date-range")
    public ResponseEntity<List<OrderDto>> getOrdersByDateRange(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        List<OrderDto> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/orders/status")
    public ResponseEntity<List<OrderDto>> getOrdersByStatus(@RequestParam OrderStatus status) {
        List<OrderDto> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping(value = "/user/orders")
    public ResponseEntity<List<OrderDto>> getUserOrders(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<OrderDto> userOrders = orderService.getOrdersByUserEmail(userDetails.getUsername());
        return ResponseEntity.ok(userOrders);
    }

   // @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(value = "/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) throws MessagingException {
        OrderDto updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping(value = "/orders/comprobante-url")
    public ResponseEntity<OrderDto> updateComprobanteUrl(@RequestParam String comprobanteUrl, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        OrderDto updatedOrder = orderService.updateComprobanteUrl(userDetails.getUsername(),comprobanteUrl);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping(value = "/orders/{id}/comprobante-url")
    public ResponseEntity<OrderDto> updateComprobanteUrlById(@PathVariable Long id, @RequestParam String comprobanteUrl){
        OrderDto updatedOrder = orderService.updateComprobanteUrlById(id,comprobanteUrl);
        return ResponseEntity.ok(updatedOrder);
    }
}

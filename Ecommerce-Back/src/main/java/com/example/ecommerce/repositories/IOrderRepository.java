package com.example.ecommerce.repositories;

import com.example.ecommerce.domain.Enums.OrderStatus;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IOrderRepository {

    Order save(Order order);

    Optional<Order> findById(Long id);

    List<Order> findAll();

    void deleteById(Long id);

    boolean existsById(Long id);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByDateCreatedBetween(LocalDate startDate, LocalDate endDate);

    List<Order> findByUser(User user);

    Optional<Order> findTopByUserEmailOrderByDateCreatedDesc(String userEmail);

    List<Order> findAllCreatedInTheLastHours(LocalDateTime hoursBefore);
}

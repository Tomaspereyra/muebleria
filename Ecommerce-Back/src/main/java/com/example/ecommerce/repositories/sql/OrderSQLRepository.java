package com.example.ecommerce.repositories.sql;

import com.example.ecommerce.domain.Enums.OrderStatus;
import com.example.ecommerce.domain.exceptions.OrderNotFoundException;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.repositories.IOrderRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderSQLRepository implements IOrderRepository {

    private final IOrderSQLRepository iOrderSQLRepository;

    public OrderSQLRepository(IOrderSQLRepository iOrderSQLRepository) {
        this.iOrderSQLRepository = iOrderSQLRepository;
    }

    @Override
    public Order save(Order order) {
        return iOrderSQLRepository.save(order);
    }

    @Override
    public Optional<Order> findById(Long id) {
        return iOrderSQLRepository.findById(id);
    }

    @Override
    public List<Order> findAll() {
        return iOrderSQLRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        iOrderSQLRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return iOrderSQLRepository.existsById(id);
    }

    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return iOrderSQLRepository.findByStatus(status);
    }


    @Override
    public List<Order> findByDateCreatedBetween(LocalDate startDate, LocalDate endDate) {
        return iOrderSQLRepository.findByDateCreatedBetween(startDate,endDate);
    }

    @Override
    public List<Order> findByUser(User user) {
        return iOrderSQLRepository.findByUser(user);
    }

    @Override
    public Optional<Order> findTopByUserEmailOrderByDateCreatedDesc(String userEmail) {
        return iOrderSQLRepository.findTopByUserEmailOrderByDateCreatedDesc(userEmail);
    }

    @Override
    public List<Order> findAllCreatedInTheLastHours(LocalDateTime hoursBefore) {
        return iOrderSQLRepository.findAllCreatedInTheLastHours(hoursBefore);
    }


}

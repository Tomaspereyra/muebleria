package com.example.ecommerce.services;

import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.Product;
import com.example.ecommerce.domain.models.User;
import jakarta.mail.MessagingException;
import org.aspectj.weaver.ast.Or;

import java.util.Map;

public interface IEmailService {
    void sendOrderConfirmationEmail(User user, Order order) throws MessagingException;
    void sendOrderStatusUpdateEmail(Order order) throws MessagingException;
    void sendNewOrderNotificationToAdmin(User admin, Order order) throws MessagingException;
    void sendPasswordResetEmail(User user, String newPassword) throws MessagingException;
    void sendOutOfStockNotificationToAdmin(User admin, Product product) throws MessagingException;
    void sendComprobanteUpdateNotificationToAdmin(User admin, Order order) throws MessagingException;
}

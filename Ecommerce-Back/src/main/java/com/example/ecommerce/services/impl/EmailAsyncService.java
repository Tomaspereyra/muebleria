package com.example.ecommerce.services.impl;


import com.example.ecommerce.domain.Enums.UserRol;
import com.example.ecommerce.domain.exceptions.UserNotFoundException;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.Product;
import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.repositories.IUserRepository;
import com.example.ecommerce.services.IEmailService;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailAsyncService {
    private final IEmailService iEmailService;
    private final IUserRepository iUserRepository;
    private static final Logger log = LoggerFactory.getLogger(EmailAsyncService.class);
    public EmailAsyncService(IEmailService iEmailService, IUserRepository iUserRepository) {
        this.iEmailService = iEmailService;
        this.iUserRepository = iUserRepository;
    }

    /*@Scheduled(cron = "0 0/4 * * * *")
    public void SearchOrdersAndSendEmails(){
        log.info("Ejecutando envio de mails");
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);
        List<Order> latestOrders = iOrderServices.findAllOrderCreated(sixHoursAgo);

        latestOrders.forEach(order -> {
            this.sendConfirmationMailToClient(order.getUser(), order, new HashMap<>() );
            this.sendNewOrderCreatedToAdmin(order);
        });
    }*/

    @Async
    public void SendConfirmationMailToClient(User user, Order order){
        try {
            iEmailService.sendOrderConfirmationEmail(user, order);
        }catch (MessagingException e){
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
    }
    @Async
    public void SendNewOrderCreatedToAdmin(Order order){
        try {
            // Enviar email de notificación al admin
            User admin = iUserRepository.findFirstByRole(UserRol.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin user not found"));
            iEmailService.sendNewOrderNotificationToAdmin(admin, order);
        }catch (MessagingException e){
            System.err.println("Failed to send new order notification to admin: " + e.getMessage());
        }
    }

    @Async
    public void SendOrderUpdatedToClient(Order order){
        try {
            iEmailService.sendOrderStatusUpdateEmail(order);
        }catch (MessagingException e){
            System.err.println("Failed to send order status update email: " + e.getMessage());
        }
    }

    @Async
    public void SendNewPassword(User user, String newPassword){
        try {
            iEmailService.sendPasswordResetEmail(user, newPassword);
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending email: " + e.getMessage(), e);
        }
    }

    @Async
    public void SendLowProductStock(User admin, Product product){
        try {
            iEmailService.sendOutOfStockNotificationToAdmin(admin, product);
        } catch (MessagingException e) {
            System.err.println("Failed to send out-of-stock notification email: " + e.getMessage());
        }
    }

    @Async
    public void SendNewTransferReceipt(Order updatedOrder){
        try {
            User admin = iUserRepository.findFirstByRole(UserRol.ADMIN)
                    .orElseThrow(() -> new UserNotFoundException("Admin user not found"));
            iEmailService.sendComprobanteUpdateNotificationToAdmin(admin, updatedOrder);
        } catch (MessagingException e) {
            System.err.println("Failed to send comprobante update notification to admin: " + e.getMessage());
        }
    }
}

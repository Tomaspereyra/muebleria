package com.example.ecommerce.services.impl;

import com.example.ecommerce.api.dto.OrderDto;
import com.example.ecommerce.api.mappers.OrderMapper;
import com.example.ecommerce.domain.Enums.OrderStatus;
import com.example.ecommerce.domain.Enums.UserRol;
import com.example.ecommerce.domain.exceptions.OrderNotFoundException;
import com.example.ecommerce.domain.exceptions.ProductNotFoundException;
import com.example.ecommerce.domain.exceptions.UserNotFoundException;
import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.OrderProduct;
import com.example.ecommerce.domain.models.Product;
import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.repositories.IOrderRepository;
import com.example.ecommerce.repositories.IProductRepository;
import com.example.ecommerce.repositories.IUserRepository;
import com.example.ecommerce.services.IEmailService;
import com.example.ecommerce.services.IOrderServices;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements IOrderServices {

    private final IOrderRepository iOrderRepository;
    private final IUserRepository iUserRepository;
    private final IProductRepository iProductRepository;
    private final IEmailService iEmailService;
    private final EmailAsyncService emailAsyncService;

    public OrderServiceImpl(IOrderRepository iOrderRepository, IUserRepository iUserRepository, IProductRepository iProductRepository, IEmailService iEmailService, EmailAsyncService emailAsyncService) {
        this.iOrderRepository = iOrderRepository;
        this.iUserRepository = iUserRepository;
        this.iProductRepository = iProductRepository;
        this.iEmailService = iEmailService;
        this.emailAsyncService = emailAsyncService;
    }

    @Override
    public OrderDto createOrder(OrderDto orderDto,String userEmail) throws MessagingException {
        Order order = OrderMapper.toOrder(orderDto);

        // Carga el usuario desde la base de datos
        User user = iUserRepository.findFirstByEmail(userEmail)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        order.setUser(user);

        // Map para almacenar la cantidad comprada de cada producto
        Map<Long, Integer> purchasedQuantities = new HashMap<>();

        List<OrderProduct> orderProducts = updateStockProduct(orderDto, order);

        order.setOrderProducts(orderProducts);

        // Calcular el total de la orden
        double totalAmount = orderProducts.stream()
                .mapToDouble(op -> op.getPriceAtPurchase() * op.getQuantity())
                .sum();

        order.setAmount(totalAmount);
        order.setStatus(OrderStatus.CREATED);
        order.setAddress(orderDto.getAddress());

        Order savedOrder = iOrderRepository.save(order);

        emailAsyncService.SendConfirmationMailToClient(user,savedOrder);
        emailAsyncService.SendNewOrderCreatedToAdmin(order);
/*
        try {
            iEmailService.sendOrderConfirmationEmail(user, savedOrder, purchasedQuantities);
        }catch (MessagingException e){
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
        try {
            // Enviar email de notificación al admin
            User admin = iUserRepository.findFirstByRole(UserRol.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin user not found"));
            iEmailService.sendNewOrderNotificationToAdmin(admin, savedOrder);
        }catch (MessagingException e){
            System.err.println("Failed to send new order notification to admin: " + e.getMessage());
        }*/
        return OrderMapper.toOrderDTO(savedOrder);
    }

    private List<OrderProduct> updateStockProduct(OrderDto orderDto, Order order){
        return orderDto.getProducts().stream().map(orderProductDto -> {
            Product product = iProductRepository.findById(orderProductDto.getId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found"));

            // Verificar stock suficiente
            if (product.getQuantity() < orderProductDto.getQuantity()) {
                throw new OrderNotFoundException("Insufficient stock for product: " + product.getName());
            }

            // Descontar la cantidad comprada del stock
            product.setQuantity(product.getQuantity() - orderProductDto.getQuantity());
            iProductRepository.save(product);

            // Notificar al admin si el stock está bajo
            if (product.getQuantity() <= 3) {
                User admin = iUserRepository.findFirstByRole(UserRol.ADMIN)
                        .orElseThrow(() -> new UserNotFoundException("Admin user not found"));
                emailAsyncService.SendLowProductStock(admin,product);
            }


            // Crear una nueva instancia de OrderProduct
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setProduct(product);
            orderProduct.setQuantity(orderProductDto.getQuantity());
            orderProduct.setPriceAtPurchase(product.getPrice());
            // Asocio el OrderProduct con la orden actual
            orderProduct.setOrder(order);

            return orderProduct;
        }).collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getAllOrders() {
        List<Order> orderList = iOrderRepository.findAll();
        return orderList.stream()
                .map(order -> {
                    OrderDto orderDto = OrderMapper.toOrderDTO(order);

                    // Calculo el total de amount sumando los productos
                    int totalAmount = order.getOrderProducts().stream()
                            .mapToInt(op -> op.getQuantity() * op.getPriceAtPurchase().intValue())
                            .sum();

                    orderDto.setAmount(totalAmount);
                    return orderDto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderById(Long id) {
        Order order = iOrderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));
        OrderDto orderDto = OrderMapper.toOrderDTO(order);

        // Calculo el total de amount sumando los productos
        int totalAmount = order.getOrderProducts().stream()
                .mapToInt(op -> op.getQuantity() * op.getPriceAtPurchase().intValue())
                .sum();

        orderDto.setAmount(totalAmount);
        return orderDto;
    }

    @Override
    public OrderDto updateOrder(Long id, OrderDto orderDto) {
        return null;
    }

    @Override
    public String deleteOrder(Long id) {
        if (iOrderRepository.existsById(id)){
            iOrderRepository.deleteById(id);
            return "The Order has been successfully deleted";
        }else {
            return "The Order not found with id: " + id;
        }

    }

    @Override
    public List<OrderDto> getOrdersByStatus(OrderStatus status) {
        return iOrderRepository.findByStatus(status)
                .stream()
                .map(OrderMapper::toOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Order> orders = iOrderRepository.findByDateCreatedBetween(startDate, endDate);
        return orders.stream()
                .map(OrderMapper::toOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getOrdersByUserEmail(String email) {
        Optional<User> userOptional = iUserRepository.findFirstByEmail(email);
        if (userOptional.isPresent()){
            User user = userOptional.get();
            List<Order> orders = iOrderRepository.findByUser(user);
            return orders.stream().map(OrderMapper::toOrderDTO).collect(Collectors.toList());
        }else{
            return new ArrayList<>();
        }
    }

    @Override
    public OrderDto updateOrderStatus(Long id, OrderStatus status) throws MessagingException {
        Order order = iOrderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found"));

        order.setStatus(status);
        Order savedOrder = iOrderRepository.save(order);

        emailAsyncService.SendOrderUpdatedToClient(order);

        return OrderMapper.toOrderDTO(savedOrder);
    }

    @Override
    public OrderDto updateComprobanteUrl(String userEmail, String comprobanteUrl) {
        Order order = iOrderRepository.findTopByUserEmailOrderByDateCreatedDesc(userEmail)
                .orElseThrow(() -> new OrderNotFoundException("Order not found for user: " + userEmail));

        order.setComprobanteUrl(comprobanteUrl);
        order.setStatus(OrderStatus.IN_REVIEW);
        Order updatedOrder = iOrderRepository.save(order);

        // Notificar al administrador sobre la actualización del comprobante
        emailAsyncService.SendNewTransferReceipt(updatedOrder);

        return OrderMapper.toOrderDTO(updatedOrder);
    }

    @Override
    public List<Order> findAllOrderCreated(LocalDateTime hoursBefore) {
        return iOrderRepository.findAllCreatedInTheLastHours(hoursBefore);
    }

    @Override
    public OrderDto updateComprobanteUrlById(Long id, String comprobanteUrl) {
        Optional<Order> optionalOrder = iOrderRepository.findById(id);
        if (optionalOrder.isEmpty()) {
            throw new OrderNotFoundException("Order not found with id: " + id);
        }
        Order order = optionalOrder.get();
        order.setComprobanteUrl(comprobanteUrl);
        order.setStatus(OrderStatus.IN_REVIEW);
        Order updatedOrder = iOrderRepository.save(order);
        emailAsyncService.SendNewTransferReceipt(updatedOrder);
        return OrderMapper.toOrderDTO(updatedOrder);
    }
}

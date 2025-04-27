package com.example.ecommerce.services.impl;

import com.example.ecommerce.domain.models.Order;
import com.example.ecommerce.domain.models.OrderProduct;
import com.example.ecommerce.domain.models.Product;
import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.services.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.UrlResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.MalformedURLException;
import java.util.Map;

@Service
public class EmailServiceImpl implements IEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOrderConfirmationEmail(User user, Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(user.getEmail());
            helper.setSubject("Confirmación de Pedido");
            helper.setText(buildEmailContent(user, order), true);

            UrlResource headerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/CASAS.png");
            helper.addInline("header", headerImage);

            // Añadir la imagen del pie de página
            UrlResource footerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/FOOTER.png");
            helper.addInline("footer", footerImage);

            // Añadir imágenes de productos
            for (OrderProduct orderProduct : order.getOrderProducts()) {
                Product product = orderProduct.getProduct();
                if (product.getImages() != null && !product.getImages().isEmpty()) {
                    String imageUrl = product.getImages().get(0); // Usa la primera imagen de la lista
                    UrlResource productImage = new UrlResource(imageUrl);
                    helper.addInline("product-" + product.getId(), productImage);
                }
            }

                mailSender.send(message);
        } catch (MessagingException | MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendOrderStatusUpdateEmail(Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Actualización de Estado de Orden");
            helper.setText(buildStatusUpdateEmailContent(order), true);
            UrlResource headerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/CASAS.png");
            helper.addInline("header", headerImage);
            UrlResource footerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/FOOTER.png");
            helper.addInline("footer", footerImage);
            mailSender.send(message);
        } catch (MessagingException | MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendNewOrderNotificationToAdmin(User admin, Order order) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(admin.getEmail());
            helper.setSubject("Nueva Orden Recibida");
            helper.setText(buildNewOrderEmailContent(admin, order), true);
            UrlResource headerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/CASAS.png");
            helper.addInline("header", headerImage);
            UrlResource footerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/FOOTER.png");
            helper.addInline("footer", footerImage);
            mailSender.send(message);
        } catch (MessagingException | MalformedURLException e) {
            e.printStackTrace();
            throw new MessagingException("Failed to send email to admin", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(User user, String newPassword) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(user.getEmail());
            helper.setSubject("Restablecimiento de Contraseña");
            helper.setText(buildPasswordResetEmailContent(user, newPassword), true);

            // Añadir imágenes en línea, si es necesario
            UrlResource headerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/CASAS.png");
            helper.addInline("header", headerImage);

            UrlResource footerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/FOOTER.png");
            helper.addInline("footer", footerImage);

            mailSender.send(message);
        } catch (MessagingException | MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendOutOfStockNotificationToAdmin(User admin, Product product) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(admin.getEmail());
            helper.setSubject("¡Atención! Producto a punto de agotarse: " + product.getName());

            // Construye el contenido del correo
            String content = buildOutOfStockEmailContent(admin, product);
            content += "<p><strong>Advertencia:</strong> El stock de este producto está a punto de agotarse. Por favor, revise el inventario.</p>";
            helper.setText(content, true);

            // Agrega una imagen del producto si está disponible
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                String imageUrl = product.getImages().get(0); // Usa la primera imagen de la lista
                UrlResource productImage = new UrlResource(imageUrl);
                helper.addInline("product-image", productImage);
            }

            mailSender.send(message);
        } catch (MessagingException | MalformedURLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendComprobanteUpdateNotificationToAdmin(User admin, Order order) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(admin.getEmail());
            helper.setSubject("Actualización de comprobante de orden: " + order.getId());

            // Construye el contenido del correo
            String content = buildComprobanteUpdateEmailContent(admin, order);
            helper.setText(content, true);

            // Agrega imágenes de encabezado y pie de página en línea
            UrlResource headerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/CASAS.png");
            helper.addInline("header", headerImage);

            UrlResource footerImage = new UrlResource("http://vps-4482586-x.dattaweb.com:9000/webapp/FOOTER.png");
            helper.addInline("footer", footerImage);

            // Agrega la imagen del comprobante si está disponible
            if (order.getComprobanteUrl() != null && !order.getComprobanteUrl().isEmpty()) {
                try {
                    UrlResource comprobanteImage = new UrlResource(order.getComprobanteUrl());
                    helper.addInline("comprobante-image", comprobanteImage);
                } catch (MalformedURLException e) {
                    System.err.println("Failed to load comprobante image: " + e.getMessage());
                }
            }

            mailSender.send(message);
        } catch (MessagingException | MalformedURLException e) {
            System.err.println("Failed to send comprobante update notification to admin: " + e.getMessage());
        }
    }

    private String buildEmailContent(User user, Order order) {
        StringBuilder content = new StringBuilder();
        content.append("<html><head>");
        content.append("<link href='https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap' rel='stylesheet'>");
        content.append("<style>");
        content.append("body { font-family: 'Poppins'; font-weight: 600; }");
        content.append("ul { list-style-position: inside; padding-left: 0; text-align: center; }");
        content.append("li { display: block; text-align: center; margin: 10px 0; }");
        content.append("li img { display: block; margin: 0 auto; }");
        content.append("</style>");
        content.append("</head><body style='font-family:\"Poppins\",font-weight: 600;'>");
        content.append("<div style='background-color:#f7f7f7;padding:20px;'>");
        content.append("<div style='max-width:600px;margin:auto;background-color:rgba(255,255,255,0.8);border:1px solid #ddd;border-radius:10px;padding:20px;'>");
        content.append("<div style='text-align:center;'>");
        content.append("<img src='cid:header' alt='Encabezado' style='width:200px;height:auto;'><br><br>");
        content.append("</div>");
        content.append("<div style='padding:15px;background-color:white;border:1px solid #ddd;border-radius:10px;text-align:center;'>");
        content.append("<h2 style='color:#333;'>Hola ").append(user.getFirstName()).append(",</h2>");
        content.append("<p>¡Gracias por tu pedido!</p>");
        content.append("<p><strong>Número de orden:</strong> ").append(order.getId()).append("</p>");
        content.append("<p><strong>Importe:</strong> $").append(order.getAmount()).append("</p>");
        content.append("<p>Tu pedido esta siendo procesado.</p>");
        content.append("<p>Detalles de los productos:</p>");
        content.append("<ul>");
        for (OrderProduct orderProduct : order.getOrderProducts()) {
            Product product = orderProduct.getProduct();
            String imageUrl = product.getImages() != null && !product.getImages().isEmpty() ? product.getImages().get(0) : "default-image-url.jpg";
            content.append("<li><img src='cid:product-").append(product.getId()).append("' alt='").append(product.getName()).append("' style='width:200px;height:auto;'><br>");
            content.append("<strong>").append(product.getName()).append("</strong>: ").append(product.getDescription()).append(" (Cantidad: ").append(orderProduct.getQuantity()).append(")</li>");
        }
        content.append("</ul>");
        content.append("<p>Saludos cordiales,<br>Casas Frio - Calor</p>");
        content.append("</div>");
        content.append("<div style='text-align:center;margin-top:20px;'>");
        content.append("<img src='cid:footer' alt='Pie de Página' style='width:100%;height:auto;max-height:200px;'><br><br>");
        content.append("</div>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }


    private String buildStatusUpdateEmailContent(Order order) {
        StringBuilder content = new StringBuilder();
        content.append("<html><head>");
        content.append("<link href='https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap' rel='stylesheet'>");
        content.append("<style>");
        content.append("body { font-family: 'Poppins'; font-weight: 600; }");
        content.append("</style>");
        content.append("</head><body style='font-family:\"Poppins\",font-weight: 600;'>");
        content.append("<div style='background-color:#f7f7f7;padding:20px;'>");
        content.append("<div style='max-width:600px;margin:auto;background-color:rgba(255,255,255,0.8);border:1px solid #ddd;border-radius:10px;padding:20px;'>");
        content.append("<div style='text-align:center;'>");
        content.append("<img src='cid:header' alt='Encabezado' style='width:200px;height:auto;'><br><br>");
        content.append("</div>");
        content.append("<div style='padding:15px;background-color:white;border:1px solid #ddd;border-radius:10px;text-align:center;'>");
        content.append("<h2 style='color:#333;'>Hola ").append(order.getUser().getFirstName()).append(",</h2>");
        content.append("<p>Estamos procesando su pago.");
        content.append("<p>Saludos cordiales,<br>Casas Frio - Calor</p>");
        content.append("</div>");
        content.append("<div style='text-align:center;margin-top:20px;'>");
        content.append("<img src='cid:footer' alt='Pie de Página' style='width:100%;height:auto;max-height:200px;'><br><br>");
        content.append("</div>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }

    private String buildNewOrderEmailContent(User admin, Order order) {
        StringBuilder content = new StringBuilder();
        content.append("<!DOCTYPE html>");
        content.append("<html><head>");
        content.append("<link href='https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap' rel='stylesheet'>");
        content.append("<style>");
        content.append("body { font-family: 'Poppins', sans-serif; font-weight: 600; }");
        content.append(".content { background-color: #f7f7f7; padding: 20px; }");
        content.append(".container { max-width: 600px; margin: auto; background-color: rgba(255,255,255,0.8); border: 1px solid #ddd; border-radius: 10px; padding: 20px; }");
        content.append(".header, .footer { text-align: center; }");
        content.append(".main { padding: 15px; background-color: white; border: 1px solid #ddd; border-radius: 10px; text-align: center; }");
        content.append("</style>");
        content.append("</head><body>");
        content.append("<div class='content'>");
        content.append("<div class='container'>");
        content.append("<div class='header'>");
        content.append("<img src='cid:header' alt='Encabezado' style='width: 200px; height: auto;'><br><br>");
        content.append("</div>");
        content.append("<div class='main'>");
        content.append("<h2 style='color: #333;'>Hola Admin,</h2>");
        content.append("<p>Se ha recibido la orden numero: <strong>").append(order.getId()).append("</strong>.</p>");
        content.append("<p>Por favor, revisa los detalles en el sistema de gestión.</p>");
        content.append("<p>Saludos cordiales,<br>Casas Frio - Calor</p>");
        content.append("</div>");
        content.append("<div class='footer'>");
        content.append("<img src='cid:footer' alt='Pie de Página' style='width: 100%; height: auto; max-height: 200px;'><br><br>");
        content.append("</div>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }

    private String buildPasswordResetEmailContent(User user, String newPassword) {
        StringBuilder content = new StringBuilder();
        content.append("<html><head>");
        content.append("<link href='https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap' rel='stylesheet'>");
        content.append("<style>");
        content.append("body { font-family: 'Poppins'; font-weight: 600; }");
        content.append("</style>");
        content.append("</head><body style='font-family:\"Poppins\",font-weight: 600;'>");
        content.append("<div style='background-color:#f7f7f7;padding:20px;'>");
        content.append("<div style='max-width:600px;margin:auto;background-color:rgba(255,255,255,0.8);border:1px solid #ddd;border-radius:10px;padding:20px;'>");
        content.append("<div style='text-align:center;'>");
        content.append("<img src='cid:header' alt='Encabezado' style='width:200px;height:auto;'><br><br>");
        content.append("</div>");
        content.append("<div style='padding:15px;background-color:white;border:1px solid #ddd;border-radius:10px;text-align:center;'>");
        content.append("<h2 style='color:#333;'>Hola ").append(user.getFirstName()).append(",</h2>");
        content.append("<p>Hemos recibido una solicitud para restablecer tu contraseña.</p>");
        content.append("<p><strong>Tu nueva contraseña es:</strong> ").append(newPassword).append("</p>");
        content.append("<p>Te recomendamos cambiarla después de iniciar sesión.</p>");
        content.append("<p>Saludos cordiales,<br>Casas Frio - Calor</p>");
        content.append("</div>");
        content.append("<div style='text-align:center;margin-top:20px;'>");
        content.append("<img src='cid:footer' alt='Pie de Página' style='width:100%;height:auto;max-height:200px;'><br><br>");
        content.append("</div>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }


    private String buildOutOfStockEmailContent(User admin, Product product) {
        StringBuilder content = new StringBuilder();
        content.append("<html><head>");
        content.append("<link href='https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap' rel='stylesheet'>");
        content.append("<style>");
        content.append("body { font-family: 'Poppins', sans-serif; font-weight: 600; }");
        content.append("</style>");
        content.append("</head><body>");
        content.append("<div style='background-color:#f7f7f7;padding:20px;'>");
        content.append("<div style='max-width:600px;margin:auto;background-color:rgba(255,255,255,0.9);border:1px solid #ddd;border-radius:10px;padding:20px;'>");
        content.append("<div style='text-align:center;'>");
        content.append("<h2 style='color:#e67e22;'>Aviso de bajo stock</h2>");
        content.append("</div>");
        content.append("<p>Estimado ").append(admin.getFirstName()).append(",</p>");
        content.append("<p>El siguiente producto está próximo a agotarse con un stock actual de <strong>")
                .append(product.getQuantity()).append("</strong> unidades:</p>");
        content.append("<ul>");
        content.append("<li><strong>Nombre:</strong> ").append(product.getName()).append("</li>");
        content.append("<li><strong>Descripción:</strong> ").append(product.getDescription()).append("</li>");
        content.append("<li><strong>Precio:</strong> $").append(product.getPrice()).append("</li>");
        content.append("</ul>");

        // Inserta imagen si existe
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            content.append("<div style='text-align:center;'>");
            content.append("<img src='cid:product-image' alt='").append(product.getName()).append("' style='width:200px;height:auto;'>");
            content.append("</div>");
        }

        content.append("<p>Por favor, considere actualizar el stock o gestionar la disponibilidad del producto en la tienda.</p>");
        content.append("<p>Saludos,<br>Equipo de Ventas</p>");
        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");

        return content.toString();
    }

    private String buildComprobanteUpdateEmailContent(User admin, Order order) {
        StringBuilder content = new StringBuilder();
        content.append("<html><head>");
        content.append("<link href='https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap' rel='stylesheet'>");
        content.append("<style>");
        content.append("body { font-family: 'Poppins', sans-serif; font-weight: 600; }");
        content.append("ul { list-style-position: inside; padding-left: 0; text-align: center; }");
        content.append("li { display: block; text-align: center; margin: 10px 0; }");
        content.append("li img { display: block; margin: 0 auto; }");
        content.append("</style>");
        content.append("</head><body style='font-family:\"Poppins\", sans-serif; font-weight: 600;'>");
        content.append("<div style='background-color:#f7f7f7;padding:20px;'>");
        content.append("<div style='max-width:600px;margin:auto;background-color:rgba(255,255,255,0.8);border:1px solid #ddd;border-radius:10px;padding:20px;'>");


        content.append("<div style='text-align:center;'>");
        content.append("<img src='cid:header' alt='Encabezado' style='width:200px;height:auto;'><br><br>");
        content.append("</div>");


        content.append("<div style='padding:15px;background-color:white;border:1px solid #ddd;border-radius:10px;text-align:center;'>");
        content.append("<h2 style='color:#333;'>Actualización de Comprobante de Pago</h2>");
        content.append("<p>Estimado ").append(admin.getFirstName()).append(",</p>");
        content.append("<p>La orden con ID <strong>").append(order.getId()).append("</strong> ha sido actualizada con un nuevo comprobante de pago.</p>");
        content.append("<ul>");
        content.append("<li><strong>Usuario:</strong> ").append(order.getUser().getEmail()).append("</li>");
        content.append("<li><strong>Fecha de la Orden:</strong> ").append(order.getDateCreated()).append("</li>");
        content.append("<li><strong>URL del Comprobante:</strong> <a href='").append(order.getComprobanteUrl()).append("'>Ver Comprobante</a></li>");
        content.append("</ul>");


        if (order.getComprobanteUrl() != null && !order.getComprobanteUrl().isEmpty()) {
            content.append("<div style='text-align:center;'>");
            content.append("<img src='cid:comprobante-image' alt='Comprobante' style='width:200px;height:auto;'>");
            content.append("</div>");
        }

        content.append("<p>Saludos cordiales,<br>Casas Frio - Calor</p>");
        content.append("</div>");


        content.append("<div style='text-align:center;margin-top:20px;'>");
        content.append("<img src='cid:footer' alt='Pie de Página' style='width:100%;height:auto;max-height:200px;'><br><br>");
        content.append("</div>");

        content.append("</div>");
        content.append("</div>");
        content.append("</body></html>");
        return content.toString();
    }
}

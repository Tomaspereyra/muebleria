package com.example.ecommerce.services.impl;

import com.example.ecommerce.api.dto.SingupRequest;
import com.example.ecommerce.api.dto.UserDto;
import com.example.ecommerce.domain.Enums.UserRol;
import com.example.ecommerce.domain.exceptions.EmailAlreadyExistsException;
import com.example.ecommerce.domain.exceptions.UserNotFoundException;
import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.repositories.sql.IUserSQLRepository;
import com.example.ecommerce.services.IAuthServices;
import com.example.ecommerce.services.IEmailService;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthServiceImpl implements IAuthServices {

    private final IUserSQLRepository userSQLRepository;
    private final IEmailService emailService;
    private final EmailAsyncService emailAsyncService;

    public AuthServiceImpl(IUserSQLRepository userSQLRepository, IEmailService emailService, EmailAsyncService emailAsyncService) {
        this.userSQLRepository = userSQLRepository;
        this.emailService = emailService;
        this.emailAsyncService = emailAsyncService;
    }


    @PostConstruct
    public void createAdminAccount(){
        User user = new User();
        user.setFirstName("admin");
        user.setEmail("matias.cimino98@gmail.com");
        user.setPassword(new BCryptPasswordEncoder().encode("Electrosha948!"));
        user.setRol(UserRol.ADMIN);
        userSQLRepository.save(user);

    }

    @Override
    public UserDto createUser(SingupRequest singupRequest) {
        boolean emailExists = userSQLRepository.findFirstByEmail(singupRequest.getEmail()).isPresent();
        if (emailExists) {
            throw new EmailAlreadyExistsException("Error: El email ya se encuentra registrado.");
        }
        User user = new User();
        user.setFirstName(singupRequest.getName());
        user.setLastName(singupRequest.getLastName());
        user.setEmail(singupRequest.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(singupRequest.getPassword()));
        user.setDocumentNumber(singupRequest.getDocumentNumber());
        user.setAddresses(Collections.singletonList(singupRequest.getAddress()));
        user.setPhone(singupRequest.getPhone());
        user.setDateCreated(LocalDateTime.now());
        user.setRol(UserRol.CUSTOMER);
        User created = userSQLRepository.save(user);
        UserDto dto = new UserDto();
        dto.setId(created.getId());
        dto.setFirstName(created.getFirstName());
        dto.setLastName(created.getLastName());
        dto.setEmail(created.getEmail());
        dto.setDocumentNumber(created.getDocumentNumber());
        dto.setAddresses(created.getAddresses());
        dto.setPhone(created.getPhone());
        dto.setDateCreated(created.getDateCreated());
        dto.setRol(created.getRol());
        // UserMapper.userToDto(userSQLRepository.save(UserMapper.dtoToUser(singupRequest)));
        return dto;
    }

    @Override
    public void resetPassword(String email) {
        Optional<User> optionalUser = userSQLRepository.findFirstByEmail(email);
        if (!optionalUser.isPresent()) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        User user = optionalUser.get();
        String newPassword = generateRandomPassword();

        // Cifrado de la nueva contraseña
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(newPassword)); // Cifrado
        userSQLRepository.save(user); // Guarda el usuario actualizado
        emailAsyncService.SendNewPassword(user,newPassword);
    }

    private String generateRandomPassword() {
        int length = 10; // Longitud de la nueva contraseña
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        StringBuilder password = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }
        return password.toString();
    }
}

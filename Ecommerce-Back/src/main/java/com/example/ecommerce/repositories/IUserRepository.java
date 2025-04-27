package com.example.ecommerce.repositories;

import com.example.ecommerce.domain.Enums.UserRol;
import com.example.ecommerce.domain.models.User;
import java.util.List;
import java.util.Optional;

public interface IUserRepository {

    User save(User user);

    Optional<User> findById(Long id);

    List<User> findAll();

    void deleteById(Long id);

    List<User> findByNameContainingIgnoreCase(String name);

    boolean existsById(Long id);

    Optional<User> findFirstByEmail(String email);

    Optional<User> findFirstByRole(UserRol admin);
}
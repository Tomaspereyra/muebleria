package com.example.ecommerce.repositories.sql;

import com.example.ecommerce.domain.Enums.UserRol;
import com.example.ecommerce.domain.exceptions.UserNotFoundException;
import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.repositories.IUserRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserSQLRepository implements IUserRepository {

    private final IUserSQLRepository repository;

    public UserSQLRepository(IUserSQLRepository repository) {
        this.repository = repository;
    }

    @Override
    public User save(User user) {
        return repository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<User> findByNameContainingIgnoreCase(String name) {
        return List.of();
    }

    @Override
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    @Override
    public Optional<User> findFirstByEmail(String email) {
        return repository.findFirstByEmail(email);
    }

    @Override
    public Optional<User> findFirstByRole(UserRol admin) {
        return repository.findFirstByRol(admin);
    }

}

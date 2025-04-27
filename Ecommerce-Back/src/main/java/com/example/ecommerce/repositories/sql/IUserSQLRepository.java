package com.example.ecommerce.repositories.sql;

import com.example.ecommerce.domain.Enums.UserRol;
import com.example.ecommerce.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserSQLRepository extends JpaRepository<User, Long> {

    Optional<User> findFirstByEmail(String email);

    User findByRol(UserRol admin);

    Optional<User> findFirstByRol(UserRol rol);


}

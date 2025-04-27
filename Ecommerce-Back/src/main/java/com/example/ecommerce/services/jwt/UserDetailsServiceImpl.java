package com.example.ecommerce.services.jwt;

import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.repositories.sql.IUserSQLRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final IUserSQLRepository repository;

    public UserDetailsServiceImpl(IUserSQLRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> optionalUser = repository.findFirstByEmail(email);
        if (optionalUser.isEmpty())throw new UsernameNotFoundException("User not found", null);
        return new org.springframework.security.core.userdetails.User(optionalUser.get().getEmail(),optionalUser.get().getPassword(),new ArrayList<>());
    }
}

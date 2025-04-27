package com.example.ecommerce.api.controllers;

import com.example.ecommerce.api.dto.AuthenticationRequest;
import com.example.ecommerce.api.dto.AuthenticationResponse;
import com.example.ecommerce.api.dto.SingupRequest;
import com.example.ecommerce.api.dto.UserDto;
import com.example.ecommerce.domain.exceptions.UserNotFoundException;
import com.example.ecommerce.domain.models.User;
import com.example.ecommerce.repositories.sql.IUserSQLRepository;
import com.example.ecommerce.services.IAuthServices;
import com.example.ecommerce.services.jwt.UserDetailsServiceImpl;
import com.example.ecommerce.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/auth")
public class AuthController {

    private final IAuthServices iAuthServices;
    private final AuthenticationManager authenticationManager;

    private final UserDetailsServiceImpl userDetailsService;

    private final IUserSQLRepository userSQLRepository;

    private final JwtUtil jwtUtil;

    public AuthController(IAuthServices iAuthServices, AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService, IUserSQLRepository userSQLRepository, JwtUtil jwtUtil) {
        this.iAuthServices = iAuthServices;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userSQLRepository = userSQLRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(value = "/signup")
    public ResponseEntity<?> signUpUser(@RequestBody SingupRequest singupRequest){
        UserDto createdDto = iAuthServices.createUser(singupRequest);

        if(createdDto == null){
            return new ResponseEntity<>("User not created. Come again later",HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
    }

    @PostMapping(value = "/login")
    public AuthenticationResponse createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest, HttpServletResponse response) throws IOException, IOException {
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(),authenticationRequest.getPassword()));
        }catch (BadCredentialsException e){
            throw new BadCredentialsException(("Incorrect username or password"));
        }catch (DisabledException disabledException){
            response.sendError(HttpServletResponse.SC_NOT_FOUND,"User not active");
            return null;
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());

        final String jwt = jwtUtil.generateToken(userDetails);
        Optional<User> optionalUser = userSQLRepository.findFirstByEmail(userDetails.getUsername());
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        if(optionalUser.isPresent()){
            authenticationResponse.setJwt(jwt);
            authenticationResponse.setUserRole(optionalUser.get().getRol());
            authenticationResponse.setUserId(optionalUser.get().getId());
        }
        return authenticationResponse;
    }

    @PostMapping(value = "/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email) {
        try {
            iAuthServices.resetPassword(email);
            return new ResponseEntity<>("Password reset successfully. Please check your email.", HttpStatus.OK);
        } catch (UserNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Failed to send reset password email.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

package com.example.ecommerce.api.mappers;

import com.example.ecommerce.api.dto.UserDto;
import com.example.ecommerce.domain.models.User;

public class UserMapper {

    public static User dtoToUser(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setDateCreated(userDto.getDateCreated());
        user.setDocumentNumber(userDto.getDocumentNumber());
        user.setPhone(userDto.getPhone());
        user.setRol(userDto.getRol());
        user.setOrders(userDto.getOrders());
        user.setAddresses(userDto.getAddresses());
        return user;
    }

    public static UserDto userToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        userDto.setDateCreated(user.getDateCreated());
        userDto.setDocumentNumber(user.getDocumentNumber());
        userDto.setPhone(user.getPhone());
        userDto.setRol(user.getRol());
        userDto.setOrders(user.getOrders());
        userDto.setAddresses(user.getAddresses());
        return userDto;
    }
}
package com.example.ecommerce.api.mappers;

import com.example.ecommerce.api.dto.AddressDto;
import com.example.ecommerce.domain.models.Address;
import lombok.experimental.UtilityClass;

@UtilityClass
public class AddressMapper {

    public static Address dtoToAddress(AddressDto addressDto) {
        Address address = new Address();
        address.setId(addressDto.getId());
        address.setStreet(addressDto.getStreet());
        address.setNumber(addressDto.getNumber());
        address.setZipCode(addressDto.getZipCode());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        return address;
    }

    public static AddressDto addressToDto(Address address) {
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setStreet(address.getStreet());
        addressDto.setNumber(address.getNumber());
        addressDto.setZipCode(address.getZipCode());
        addressDto.setCity(address.getCity());
        addressDto.setState(address.getState());
        return addressDto;
    }
}

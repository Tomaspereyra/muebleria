package com.example.ecommerce.api.mappers;

import com.example.ecommerce.api.dto.ProductDto;
import com.example.ecommerce.domain.models.Product;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ProductMapper {

    public static Product dtoToProduct(ProductDto dto){
        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setDescription(dto.getDescription());
        product.setImages(dto.getImages());
        product.setMainImage(dto.getMainImage());

        return product;
    }

    public static ProductDto productToDto(Product product){
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setDescription(product.getDescription());
        dto.setImages(product.getImages());
        dto.setMainImage(product.getMainImage());
        return dto;
    }
}

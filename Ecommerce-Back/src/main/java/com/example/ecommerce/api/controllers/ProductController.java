package com.example.ecommerce.api.controllers;

import com.example.ecommerce.api.dto.ProductDto;
import com.example.ecommerce.services.IProductServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
public class ProductController {


    private final IProductServices iProductServices;

    public ProductController(IProductServices iProductServices) {
        this.iProductServices = iProductServices;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value = "/product")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto dto){
        ProductDto createdProduct = iProductServices.createProduct(dto);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping(value = "/product")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = iProductServices.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping(value = "/product/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        ProductDto product = iProductServices.getProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(value = "/product")
    public ResponseEntity<ProductDto> updateProduct(@RequestBody ProductDto productDto){
        return ResponseEntity.status(HttpStatus.OK).body(iProductServices.updateProduct(productDto));
    }

    @DeleteMapping(value = "/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        String result = iProductServices.deleteProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/product/search")
    public ResponseEntity<List<ProductDto>> searchProductsByName(@RequestParam String name) {
        List<ProductDto> products = iProductServices.findProductsByName(name);
        return ResponseEntity.ok(products);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/product/filter")
    public ResponseEntity<List<ProductDto>> filterProductsByPrice(@RequestParam Double minPrice, @RequestParam Double maxPrice) {
        List<ProductDto> products = iProductServices.findProductsByPrinceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
}

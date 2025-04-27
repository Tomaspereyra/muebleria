package com.example.ecommerce.repositories.sql;

import com.example.ecommerce.domain.exceptions.ProductNotFoundException;
import com.example.ecommerce.domain.models.Product;
import com.example.ecommerce.repositories.IProductRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductSQLRepository implements IProductRepository {

    private final IProductSQLRepository repository;

    public ProductSQLRepository(IProductSQLRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product save(Product product) {
        return repository.save(product);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Product> findAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Product> findByNameContainingIgnoreCase(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> findByPriceBetween(Double minPrice, Double maxPrice) {
        return repository.findByPriceBetween(minPrice,maxPrice);
    }

    @Override
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }
}

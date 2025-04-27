package com.example.ecommerce.repositories.sql;

import com.example.ecommerce.domain.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductSQLRepository extends JpaRepository<Product, Long> {

    // Nueva consulta para buscar productos por nombre o parte del nombre
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("name") String name);

    // Nueva consulta para filtrar productos por rango de precios
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}

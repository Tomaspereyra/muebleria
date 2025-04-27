package com.example.ecommerce.services;

import org.springframework.web.multipart.MultipartFile;

public interface IImageService {
    String uploadImage(MultipartFile file) throws Exception;
}

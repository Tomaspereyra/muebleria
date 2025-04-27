package com.example.ecommerce.services.impl;

import com.example.ecommerce.services.IImageService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URI;
import java.util.UUID;

@Service
public class ImageServiceImpl implements IImageService {

    private final MinioClient minioClient;


    @Value("${minio.bucketName}")
    private String bucketName;

    public ImageServiceImpl(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public String uploadImage(MultipartFile file) throws Exception{
        String objectName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        }
       String url =  minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .method(Method.GET)
                        .build());

        return transformUrl(url);
       //return removeQueryParams(url);
    }
    private String transformUrl(String originalUrl) {
        try {
            // Parsear la URL original para extraer las partes
            URI originalUri = new URI(originalUrl);

            // Crear una nueva URI con el dominio deseado
            String newHost = "electrosha20.com.ar";
            URI transformedUri = new URI(
                    "https",                     // Esquema (https)
                    originalUri.getUserInfo(),   // Información del usuario (normalmente null)
                    newHost,                     // Nuevo host
                    -1,                          // Puerto (usar puerto predeterminado para https)
                    originalUri.getPath(),       // Mantener el path original
                    null,                        // Sin query (si quieres mantenerla, usa originalUri.getQuery())
                    null                         // Sin fragmento
            );

            return transformedUri.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error transformando la URL", e);
        }
    }
/* 
    private String transformUrl(String originalUrl) {
        try {
            // Parsear la URL original para extraer las partes
            URI originalUri = new URI(originalUrl);

            // Crear una nueva URI con el dominio deseado
            String newHost = "localhost:8080";
            URI transformedUri = new URI(
                    "http",                     // Esquema (https)
                    originalUri.getUserInfo(),   // Información del usuario (normalmente null)
                    newHost,                     // Nuevo host
                    -1,                          // Puerto (usar puerto predeterminado para https)
                    originalUri.getPath(),       // Mantener el path original
                    null,                        // Sin query (si quieres mantenerla, usa originalUri.getQuery())
                    null                         // Sin fragmento
            );

            return transformedUri.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error transformando la URL", e);
        }
    }
    */
    public static String removeQueryParams(String url) {
        try {
            URI uri = new URI(url);
            return new URI(uri.getScheme(), uri.getAuthority(), uri.getPath(), null, uri.getFragment()).toString();
        } catch (Exception e) {
            e.printStackTrace();
            return url; // En caso de error, devuelve la URL original
        }
    }
}



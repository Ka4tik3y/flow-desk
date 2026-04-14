package org.pm.flowdesk.service;

import org.pm.flowdesk.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class StorageService {
    private final Path root;

    public StorageService(@Value("${app.storage.path:uploads}") String storagePath) {
        this.root = Paths.get(storagePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new IllegalStateException("Could not initialize storage", e);
        }
    }

    public String storePdf(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            throw new BadRequestException("Only PDF files are allowed");
        }

        String originalName = file.getOriginalFilename() == null ? "document.pdf" : file.getOriginalFilename();
        if (!originalName.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF files are allowed");
        }

        String storageName = UUID.randomUUID() + ".pdf";
        Path target = root.resolve(storageName).normalize();

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to save file", e);
        }

        return storageName;
    }

    public Resource load(String storageName) {
        try {
            Path file = root.resolve(storageName).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists()) {
                throw new BadRequestException("Document file not found");
            }
            return resource;
        } catch (Exception e) {
            throw new BadRequestException("Document file not found");
        }
    }

    public void delete(String storageName) {
        try {
            Files.deleteIfExists(root.resolve(storageName).normalize());
        } catch (IOException ignored) {
    
        }
    }
}

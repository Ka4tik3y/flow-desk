package org.pm.flowdesk.dto;

public class TaskDocumentResponse {
    private Long id;
    private String originalFilename;
    private String contentType;
    private Long size;
    private String downloadUrl;

    public TaskDocumentResponse(Long id, String originalFilename, String contentType, Long size, String downloadUrl) {
        this.id = id;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.size = size;
        this.downloadUrl = downloadUrl;
    }

    public Long getId() {
        return id;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public Long getSize() {
        return size;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }
}

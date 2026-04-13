package org.pm.flowdesk.dto;

import org.pm.flowdesk.model.TaskPriority;
import org.pm.flowdesk.model.TaskStatus;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private UserResponse assignedTo;
    private UserResponse createdBy;
    private List<TaskDocumentResponse> documents;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public TaskResponse(Long id, String title, String description, TaskStatus status, TaskPriority priority, LocalDate dueDate,
                        UserResponse assignedTo, UserResponse createdBy, List<TaskDocumentResponse> documents,
                        OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.documents = documents;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public UserResponse getAssignedTo() {
        return assignedTo;
    }

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public List<TaskDocumentResponse> getDocuments() {
        return documents;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}

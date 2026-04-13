package org.pm.flowdesk.dto;

import org.pm.flowdesk.model.Task;
import org.pm.flowdesk.model.TaskDocument;
import org.pm.flowdesk.model.User;

import java.util.List;

public final class ResponseMapper {
    private ResponseMapper() {
    }

    public static UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public static TaskDocumentResponse toDocumentResponse(TaskDocument document) {
        return new TaskDocumentResponse(
                document.getId(),
                document.getOriginalFilename(),
                document.getContentType(),
                document.getSize(),
                "/api/tasks/documents/" + document.getId()
        );
    }

    public static TaskResponse toTaskResponse(Task task) {
        List<TaskDocumentResponse> docs = task.getDocuments().stream().map(ResponseMapper::toDocumentResponse).toList();
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                toUserResponse(task.getAssignedTo()),
                toUserResponse(task.getCreatedBy()),
                docs,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}

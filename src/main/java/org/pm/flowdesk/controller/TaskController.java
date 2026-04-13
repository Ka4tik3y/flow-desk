package org.pm.flowdesk.controller;

import org.pm.flowdesk.dto.ResponseMapper;
import org.pm.flowdesk.dto.TaskRequest;
import org.pm.flowdesk.dto.TaskResponse;
import org.pm.flowdesk.model.Task;
import org.pm.flowdesk.model.TaskDocument;
import org.pm.flowdesk.model.TaskPriority;
import org.pm.flowdesk.model.TaskStatus;
import org.pm.flowdesk.model.User;
import org.pm.flowdesk.service.CurrentUserService;
import org.pm.flowdesk.service.StorageService;
import org.pm.flowdesk.service.TaskService;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/tasks")
@Validated
public class TaskController {
    private final TaskService taskService;
    private final CurrentUserService currentUserService;
    private final StorageService storageService;

    public TaskController(TaskService taskService, CurrentUserService currentUserService, StorageService storageService) {
        this.taskService = taskService;
        this.currentUserService = currentUserService;
        this.storageService = storageService;
    }

    @GetMapping
    public Page<TaskResponse> listTasks(@RequestParam(required = false) TaskStatus status,
                                        @RequestParam(required = false) TaskPriority priority,
                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDateFrom,
                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDateTo,
                                        @RequestParam(required = false) Long assignedToId,
                                        Pageable pageable) {
        User current = currentUserService.requireCurrentUser();
        return taskService.list(status, priority, dueDateFrom, dueDateTo, assignedToId, current, pageable)
                .map(ResponseMapper::toTaskResponse);
    }

    @GetMapping("/{id}")
    public TaskResponse getTask(@PathVariable Long id) {
        User current = currentUserService.requireCurrentUser();
        return ResponseMapper.toTaskResponse(taskService.getById(id, current));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TaskResponse createTask(@Valid @ModelAttribute TaskRequest request,
                                   @RequestParam(value = "files", required = false) MultipartFile[] files) {
        User current = currentUserService.requireCurrentUser();
        Task task = taskService.create(request, files, current);
        return ResponseMapper.toTaskResponse(task);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TaskResponse updateTask(@PathVariable Long id,
                                   @Valid @ModelAttribute TaskRequest request,
                                   @RequestParam(value = "files", required = false) MultipartFile[] files) {
        User current = currentUserService.requireCurrentUser();
        return ResponseMapper.toTaskResponse(taskService.update(id, request, files, current));
    }

    @PostMapping(value = "/{id}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TaskResponse addDocuments(@PathVariable Long id,
                                     @RequestParam("files") MultipartFile[] files) {
        User current = currentUserService.requireCurrentUser();
        return ResponseMapper.toTaskResponse(taskService.addDocuments(id, files, current));
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        User current = currentUserService.requireCurrentUser();
        taskService.delete(id, current);
    }

    @DeleteMapping("/{taskId}/documents/{documentId}")
    public void deleteDocument(@PathVariable Long taskId, @PathVariable Long documentId) {
        User current = currentUserService.requireCurrentUser();
        taskService.deleteDocument(taskId, documentId, current);
    }

    @GetMapping("/documents/{documentId}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        User current = currentUserService.requireCurrentUser();
        TaskDocument document = taskService.getDocument(documentId, current);
        Resource resource = storageService.load(document.getStorageFilename());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + document.getOriginalFilename() + "\"")
                .body(resource);
    }
}

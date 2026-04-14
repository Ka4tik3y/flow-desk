package org.pm.flowdesk.service;

import jakarta.persistence.criteria.Predicate;
import org.pm.flowdesk.dto.TaskRequest;
import org.pm.flowdesk.exception.BadRequestException;
import org.pm.flowdesk.exception.ForbiddenException;
import org.pm.flowdesk.exception.NotFoundException;
import org.pm.flowdesk.model.Role;
import org.pm.flowdesk.model.Task;
import org.pm.flowdesk.model.TaskDocument;
import org.pm.flowdesk.model.TaskPriority;
import org.pm.flowdesk.model.TaskStatus;
import org.pm.flowdesk.model.User;
import org.pm.flowdesk.repository.TaskDocumentRepository;
import org.pm.flowdesk.repository.TaskRepository;
import org.pm.flowdesk.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private static final int MAX_DOCS_PER_TASK = 3;

    private final TaskRepository taskRepository;
    private final TaskDocumentRepository taskDocumentRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    public TaskService(TaskRepository taskRepository,
                       TaskDocumentRepository taskDocumentRepository,
                       UserRepository userRepository,
                       StorageService storageService) {
        this.taskRepository = taskRepository;
        this.taskDocumentRepository = taskDocumentRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    public Page<Task> list(TaskStatus status,
                           TaskPriority priority,
                           LocalDate dueDateFrom,
                           LocalDate dueDateTo,
                           Long assignedToId,
                           User currentUser,
                           Pageable pageable) {
        Specification<Task> spec = (root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }
            if (dueDateFrom != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dueDate"), dueDateFrom));
            }
            if (dueDateTo != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dueDate"), dueDateTo));
            }
            if (assignedToId != null) {
                predicates.add(cb.equal(root.get("assignedTo").get("id"), assignedToId));
            }

            if (currentUser.getRole() != Role.ADMIN) {
                predicates.add(cb.or(
                        cb.equal(root.get("createdBy").get("id"), currentUser.getId()),
                        cb.equal(root.get("assignedTo").get("id"), currentUser.getId())
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return taskRepository.findAll(spec, pageable);
    }

    public Task getById(Long id, User currentUser) {
        var task = taskRepository.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
        verifyTaskAccess(task, currentUser);
        return task;
    }

    @Transactional(readOnly = true)
    public Map<TaskPriority, List<Task>> getDashboardTasks(User currentUser) {
        // This specification will fetch all non-paginated tasks created by or assigned to the user, unless they are an admin.
        Specification<Task> spec = (root, query, cb) -> {
            if (currentUser.getRole() == Role.ADMIN) {
                return cb.conjunction(); // Admin sees all tasks
            }
            return cb.or(
                    cb.equal(root.get("createdBy").get("id"), currentUser.getId()),
                    cb.equal(root.get("assignedTo").get("id"), currentUser.getId())
            );
        };

        List<Task> userTasks = taskRepository.findAll(spec);

        // Group tasks by priority for the dashboard view
        return userTasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority));
    }

    @Transactional
    public Task create(TaskRequest request, MultipartFile[] files, User currentUser) {
        var task = new Task();
        applyTaskRequest(task, request, currentUser);
        task.setCreatedBy(currentUser);
        Task saved = taskRepository.save(task);

        if (files != null && files.length > 0) {
            appendDocuments(saved, files);
        }
        return taskRepository.save(saved);
    }

    @Transactional
    public Task update(Long id, TaskRequest request, MultipartFile[] files, User currentUser) {
        var task = taskRepository.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
        verifyTaskAccess(task, currentUser);

        applyTaskRequest(task, request, currentUser);
        task.setUpdatedAt(OffsetDateTime.now());

        if (files != null && files.length > 0) {
            appendDocuments(task, files);
        }

        return taskRepository.save(task);
    }

    @Transactional
    public Task addDocuments(Long taskId, MultipartFile[] files, User currentUser) {
        var task = taskRepository.findById(taskId).orElseThrow(() -> new NotFoundException("Task not found"));
        verifyTaskAccess(task, currentUser);
        appendDocuments(task, files);
        task.setUpdatedAt(OffsetDateTime.now());
        return taskRepository.save(task);
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        var task = taskRepository.findById(id).orElseThrow(() -> new NotFoundException("Task not found"));
        verifyTaskAccess(task, currentUser);

        var storageFiles = task.getDocuments().stream().map(TaskDocument::getStorageFilename).toList();
        taskRepository.delete(task);
        storageFiles.forEach(storageService::delete);
    }

    @Transactional(readOnly = true)
    public TaskDocument getDocument(Long documentId, User currentUser) {
        var document = taskDocumentRepository.findById(documentId)
                .orElseThrow(() -> new NotFoundException("Document not found"));
        verifyTaskAccess(document.getTask(), currentUser);
        return document;
    }

    @Transactional
    public void deleteDocument(Long taskId, Long documentId, User currentUser) {
        var task = taskRepository.findById(taskId).orElseThrow(() -> new NotFoundException("Task not found"));
        verifyTaskAccess(task, currentUser);

        var document = task.getDocuments().stream()
                .filter(d -> d.getId().equals(documentId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Document not found for task"));

        task.getDocuments().remove(document);
        storageService.delete(document.getStorageFilename());
        task.setUpdatedAt(OffsetDateTime.now());
        taskRepository.save(task);
    }

    private void applyTaskRequest(Task task, TaskRequest request, User currentUser) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() == null ? TaskStatus.TODO : request.getStatus());
        task.setPriority(request.getPriority() == null ? TaskPriority.MEDIUM : request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssignedToId() != null) {
            var assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new NotFoundException("Assigned user not found"));
            task.setAssignedTo(assignee);
        } else if (task.getAssignedTo() == null) {
            task.setAssignedTo(currentUser);
        }
    }

    private void appendDocuments(Task task, MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return;
        }
        var nextCount = task.getDocuments().size() + files.length;
        if (nextCount > MAX_DOCS_PER_TASK) {
            throw new BadRequestException("A task can have at most 3 PDF documents");
        }

        for (var file : files) {
            var storageName = storageService.storePdf(file);
            var doc = new TaskDocument();
            doc.setTask(task);
            doc.setOriginalFilename(file.getOriginalFilename() == null ? "document.pdf" : file.getOriginalFilename());
            doc.setStorageFilename(storageName);
            doc.setContentType(file.getContentType() == null ? "application/pdf" : file.getContentType());
            doc.setSize(file.getSize());
            task.getDocuments().add(doc);
        }
    }

    private void verifyTaskAccess(Task task, User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        var uid = currentUser.getId();
        var allowed = task.getCreatedBy() != null && task.getCreatedBy().getId().equals(uid)
                || task.getAssignedTo() != null && task.getAssignedTo().getId().equals(uid);

        if (!allowed) {
            throw new ForbiddenException("You can only manage your own tasks");
        }
    }
}

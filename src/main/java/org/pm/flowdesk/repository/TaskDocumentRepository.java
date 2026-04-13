package org.pm.flowdesk.repository;

import org.pm.flowdesk.model.TaskDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskDocumentRepository extends JpaRepository<TaskDocument, Long> {
}

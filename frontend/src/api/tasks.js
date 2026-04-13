import { apiRequest } from "./http";

export function listTasks(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  params.set("size", filters.size || "50");
  params.set("sort", filters.sort || "updatedAt,desc");

  return apiRequest(`/api/tasks?${params.toString()}`);
}

export function getTask(taskId) {
  return apiRequest(`/api/tasks/${taskId}`);
}

export function createTask(payload) {
  return apiRequest("/api/tasks", {
    method: "POST",
    body: toTaskFormData(payload),
  });
}

export function updateTask(taskId, payload) {
  return apiRequest(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: toTaskFormData(payload),
  });
}

export function deleteTask(taskId) {
  return apiRequest(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export function addTaskDocuments(taskId, files) {
  const formData = new FormData();
  Array.from(files || []).forEach((file) => formData.append("files", file));

  return apiRequest(`/api/tasks/${taskId}/documents`, {
    method: "POST",
    body: formData,
  });
}

export function deleteTaskDocument(taskId, documentId) {
  return apiRequest(`/api/tasks/${taskId}/documents/${documentId}`, {
    method: "DELETE",
  });
}

function toTaskFormData(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "files" || value === undefined || value === null || value === "") {
      return;
    }

    formData.append(key, value);
  });

  Array.from(payload.files || []).forEach((file) => formData.append("files", file));
  return formData;
}

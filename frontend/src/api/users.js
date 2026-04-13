import { apiRequest } from "./http";

export function listUsers(query = "") {
  const params = new URLSearchParams({
    size: "50",
    sort: "username,asc",
  });

  if (query) {
    params.set("query", query);
  }

  return apiRequest(`/api/users?${params.toString()}`);
}

export function getUser(userId) {
  return apiRequest(`/api/users/${userId}`);
}

export function createUser(payload) {
  return apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUser(userId, payload) {
  return apiRequest(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteUser(userId) {
  return apiRequest(`/api/users/${userId}`, {
    method: "DELETE",
  });
}

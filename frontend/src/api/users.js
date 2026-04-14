import { apiRequest } from "./http";

export function listUsers(query = "", options = {}) {
  const params = new URLSearchParams();

  if (query && query.trim()) {
    params.set("query", query.trim());
  }

  params.set("size", options.size || "200");
  params.set("sort", options.sort || "username,asc");

  return apiRequest(`/api/users?${params.toString()}`);
}

export function createUser(payload) {
  return apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteUser(userId) {
  return apiRequest(`/api/users/${userId}`, {
    method: "DELETE",
  });
}

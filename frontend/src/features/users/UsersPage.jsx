import { useEffect, useState } from "react";
import { createUser, deleteUser, listUsers } from "../../api/users";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Select } from "../../components/ui/Select";
import { USER_ROLES } from "../../utils/constants";

const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  role: "USER",
};

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadUsers(nextQuery = query) {
    setLoading(true);
    setError("");
    try {
      const response = await listUsers(nextQuery);
      setUsers(response.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createUser(form);
      setForm(EMPTY_FORM);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(userId) {
    await deleteUser(userId);
    await loadUsers();
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Admin"
        title="User Registry"
        body="This route is reserved for admins. It exposes the user CRUD surface expected by the backend assignment."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="space-y-4 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-card" onSubmit={handleCreate}>
          <div className="border-b border-black/10 pb-4">
            <p className="text-xs uppercase tracking-[0.32em] text-black/45">Create User</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Add team member</h3>
          </div>
          <Input
            label="Username"
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create User"}
          </Button>
        </form>

        <section className="space-y-5 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-card">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-black/45">Directory</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Manage users</h3>
            </div>
            <form
              className="w-full max-w-sm"
              onSubmit={(event) => {
                event.preventDefault();
                loadUsers(query);
              }}
            >
              <Input
                placeholder="Search username or email"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>
          </div>

          {loading ? (
            <p className="text-sm text-black/55">Loading users...</p>
          ) : users.length === 0 ? (
            <EmptyState title="No users found" body="Adjust the search or create a user from the form." />
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-[1.5rem] border border-black/10 px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-black">{user.username}</p>
                    <p className="mt-1 text-xs text-black/55">
                      {user.email} / {user.role}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getUser, updateUser } from "../../api/users";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { SectionHeading } from "../../components/ui/SectionHeading";

export function ProfilePage() {
  const { user, updateUser: syncUser } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: user?.role,
  });
  const [status, setStatus] = useState({ loading: true, saving: false, error: "", success: "" });

  useEffect(() => {
    async function loadProfile() {
      setStatus((current) => ({ ...current, loading: true, error: "" }));
      try {
        const response = await getUser(user.id);
        setForm({
          username: response.username,
          email: response.email,
          password: "",
          role: response.role,
        });
      } catch (err) {
        setStatus((current) => ({ ...current, error: err.message }));
      } finally {
        setStatus((current) => ({ ...current, loading: false }));
      }
    }

    loadProfile();
  }, [user.id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus((current) => ({ ...current, saving: true, error: "", success: "" }));

    try {
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const response = await updateUser(user.id, payload);
      syncUser(response);
      setForm((current) => ({ ...current, password: "" }));
      setStatus((current) => ({ ...current, success: "Profile updated." }));
    } catch (err) {
      setStatus((current) => ({ ...current, error: err.message }));
    } finally {
      setStatus((current) => ({ ...current, saving: false }));
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Profile"
        title="Your Account"
        body="Update the current user data through the protected user endpoint. Role changes remain visible for admins while normal users keep a simple profile editor."
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-card">
          <p className="text-xs uppercase tracking-[0.32em] text-white/45">Identity</p>
          <h3 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.04em]">{user.username}</h3>
          <div className="mt-6 space-y-3 text-sm text-white/70">
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>User ID: {user.id}</p>
          </div>
        </div>

        <form className="space-y-5 rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-card" onSubmit={handleSubmit}>
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
            label="New Password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {status.loading ? <p className="text-sm text-black/55">Loading profile...</p> : null}
          {status.error ? <p className="text-sm text-red-600">{status.error}</p> : null}
          {status.success ? <p className="text-sm text-green-700">{status.success}</p> : null}
          <Button type="submit" disabled={status.saving}>
            {status.saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </section>
    </div>
  );
}

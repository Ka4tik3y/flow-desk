import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-black/45">Register</p>
        <h2 className="mt-3 font-display text-6xl uppercase leading-none tracking-[0.04em]">Open A Desk</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-black/60">
         Sign Up and create a workspace for your tasks!
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Username"
          placeholder="kartikey"
          value={form.username}
          onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="psi@example.com"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Minimum 6 characters"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>

      <p className="text-sm text-black/55">
        Already registered?{" "}
        <Link to="/login" className="font-medium text-black underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}

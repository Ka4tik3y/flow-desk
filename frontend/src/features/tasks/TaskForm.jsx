import { useState } from "react";
import { TASK_PRIORITY, TASK_STATUS } from "../../utils/constants";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  assignedToId: "",
  files: [],
};

export function TaskForm({
  initialValues,
  users,
  onSubmit,
  submitLabel,
}) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...initialValues,
    assignedToId: initialValues?.assignedToId || initialValues?.assignedTo?.id || "",
    files: [],
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSubmit({
        ...form,
        assignedToId: form.assignedToId || null,
      });
      if (!initialValues?.id) {
        setForm(EMPTY_FORM);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Title"
        placeholder="Design landing page"
        value={form.title}
        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
        required
      />
      <Textarea
        label="Description"
        placeholder="Brief notes, context, or implementation steps."
        value={form.description}
        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Status"
          value={form.status}
          onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
        >
          {TASK_STATUS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Select
          label="Priority"
          value={form.priority}
          onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
        >
          {TASK_PRIORITY.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Due Date"
          type="date"
          value={form.dueDate || ""}
          onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
        />
        <Select
          label="Assign To"
          value={form.assignedToId}
          onChange={(event) => setForm((current) => ({ ...current, assignedToId: event.target.value }))}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.role})
            </option>
          ))}
        </Select>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.32em] text-black/60">PDF Uploads</span>
        <input
          type="file"
          accept="application/pdf"
          multiple
          className="rounded-[1.5rem] border border-dashed border-black/20 bg-white px-4 py-3 text-sm"
          onChange={(event) => setForm((current) => ({ ...current, files: Array.from(event.target.files || []) }))}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

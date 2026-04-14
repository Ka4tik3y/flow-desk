import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { createTask, listTasks } from "../../api/tasks";
import { listUsers } from "../../api/users";
import { useAuth } from "../auth/AuthContext";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { TASK_PRIORITY, TASK_STATUS } from "../../utils/constants";
import { formatDate, isOverdue } from "../../utils/format";
import { TaskForm } from "./TaskForm";

export function TasksPage() {
  const { isAdmin, user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignedToId: "",
  });

  function uniqueUsers(...groups) {
    const byId = new Map();
    groups.flat().forEach((entry) => {
      if (entry?.id != null && !byId.has(entry.id)) {
        byId.set(entry.id, entry);
      }
    });
    return Array.from(byId.values()).sort((a, b) =>
      (a.username || "").localeCompare(b.username || ""),
    );
  }

  function usersFromTasks(taskItems) {
    const fromTasks = (taskItems || []).flatMap((task) => [
      task?.assignedTo,
      task?.createdBy,
    ]);
    return uniqueUsers(user, fromTasks);
  }

  async function loadData(activeFilters = filters) {
    setLoading(true);
    setError("");

    try {
      const taskResponse = await listTasks(activeFilters);
      const taskItems = taskResponse.content || [];
      setTasks(taskItems);

      if (isAdmin) {
        try {
          const usersResponse = await listUsers("", { size: "500" });
          const dbUsers = usersResponse.content || [];
          setUsers(uniqueUsers(dbUsers, usersFromTasks(taskItems)));
        } catch {
          setUsers(usersFromTasks(taskItems));
        }
      } else {
        setUsers(usersFromTasks(taskItems));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setTasks([]);
      setError("Unauthorized");
      return;
    }
    loadData();
  }, [token, isAdmin, user?.id]);

  const selectedTaskId = location.pathname.split("/")[2];
  const selectedTask = useMemo(
    () => tasks.find((task) => String(task.id) === selectedTaskId),
    [selectedTaskId, tasks],
  );

  async function handleCreate(payload) {
    const created = await createTask(payload);
    await loadData();
    setShowCreate(false);
    navigate(`/tasks/${created.id}`);
  }

  async function applyFilters(event) {
    event.preventDefault();
    await loadData(filters);
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Tasks"
        title="Execution Board"
        body="Filter, create, inspect, and update tasks from one route group. Task details open as a dedicated child route."
        action={
          <Button onClick={() => setShowCreate((current) => !current)}>
            {showCreate ? "Close Creator" : "New Task"}
          </Button>
        }
      />

      {showCreate ? (
        <section className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-card">
          <div className="mb-6 border-b border-black/10 pb-4">
            <p className="text-xs uppercase tracking-[0.32em] text-black/45">Create</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Add a new task</h3>
          </div>
          <TaskForm users={users} onSubmit={handleCreate} submitLabel="Create Task" />
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-5">
          <form className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-card md:grid-cols-4" onSubmit={applyFilters}>
            <Select
              label="Status"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="">All</option>
              {TASK_STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}
            >
              <option value="">All</option>
              {TASK_PRIORITY.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
            <Select
              label="Assigned To"
              value={filters.assignedToId}
              onChange={(event) => setFilters((current) => ({ ...current, assignedToId: event.target.value }))}
            >
              <option value="">{isAdmin ? "All" : "My tasks"}</option>
              {users.map((userOption) => (
                <option key={userOption.id} value={userOption.id}>
                  {userOption.username}
                </option>
              ))}
            </Select>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-black/10 bg-white/80 shadow-card">
            <div className="grid grid-cols-[1.4fr_0.75fr_0.75fr_0.8fr] gap-4 border-b border-black/10 px-6 py-4 text-xs uppercase tracking-[0.28em] text-black/45">
              <span>Task</span>
              <span>Status</span>
              <span>Owner</span>
              <span>Due</span>
            </div>

            {loading ? (
              <p className="px-6 py-10 text-sm text-black/50">Loading tasks...</p>
            ) : error ? (
              <p className="px-6 py-10 text-sm text-red-600">{error}</p>
            ) : tasks.length === 0 ? (
              <div className="p-6">
                <EmptyState title="No matching tasks" body="Try different filters or create a new task to get started." />
              </div>
            ) : (
              tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className={`grid grid-cols-[1.4fr_0.75fr_0.75fr_0.8fr] gap-4 border-b border-black/5 px-6 py-5 transition last:border-b-0 hover:bg-black/[0.03] ${
                    selectedTask?.id === task.id ? "bg-black text-white hover:bg-black" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className={`mt-1 truncate text-xs ${selectedTask?.id === task.id ? "text-white/65" : "text-black/45"}`}>
                      {task.priority} priority
                    </p>
                  </div>
                  <div className="pt-0.5">
                    <Badge value={task.status} tone={task.status === "DONE" ? "muted" : "default"} />
                  </div>
                  <p className={`text-sm ${selectedTask?.id === task.id ? "text-white/72" : "text-black/58"}`}>
                    {task.assignedTo?.username || "Unassigned"}
                  </p>
                  <p className={`text-sm ${isOverdue(task.dueDate) && task.status !== "DONE" ? "text-red-600" : selectedTask?.id === task.id ? "text-white/72" : "text-black/58"}`}>
                    {formatDate(task.dueDate)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-card">
          <Outlet context={{ users, refreshTasks: loadData }} />
        </section>
      </div>
    </div>
  );
}

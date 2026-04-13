import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listTasks } from "../../api/tasks";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { StatBlock } from "../../components/ui/StatBlock";
import { Badge } from "../../components/ui/Badge";
import { formatDate, isOverdue } from "../../utils/format";

export function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await listTasks();
        setTasks(response.content || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => {
    const todo = tasks.filter((task) => task.status === "TODO").length;
    const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const done = tasks.filter((task) => task.status === "DONE").length;
    const overdue = tasks.filter((task) => task.status !== "DONE" && isOverdue(task.dueDate)).length;

    return { todo, inProgress, done, overdue };
  }, [tasks]);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Overview"
        title="Assignment Workspace"
        body="A minimal surface for task execution, status tracking, and quick inspection of the Spring Boot backend data."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatBlock label="To Do" value={stats.todo} detail="Open work waiting to be picked up." />
        <StatBlock label="In Progress" value={stats.inProgress} detail="Tasks currently being worked on." />
        <StatBlock label="Done" value={stats.done} detail="Closed tasks already delivered." />
        <StatBlock label="Overdue" value={stats.overdue} detail="Incomplete tasks past the due date." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-card">
          <div className="flex items-end justify-between border-b border-black/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-black/45">Latest Tasks</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Current queue</h3>
            </div>
            <Link to="/tasks" className="text-sm text-black/55 underline underline-offset-4">
              Open task routes
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-black/50">Loading tasks...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : tasks.length === 0 ? (
              <EmptyState title="No tasks yet" body="Create your first task from the task route to populate the workspace." />
            ) : (
              tasks.slice(0, 6).map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-black/10 px-4 py-4 transition hover:-translate-y-0.5 hover:border-black"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-medium text-black">{task.title}</h4>
                    <Badge value={task.status} tone={task.status === "DONE" ? "muted" : "default"} />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-black/55">
                    <span>{task.assignedTo?.username || "Unassigned"}</span>
                    <span>/</span>
                    <span>{task.priority}</span>
                    <span>/</span>
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-card">
          <p className="text-xs uppercase tracking-[0.32em] text-white/45">Routing</p>
          <h3 className="mt-3 font-display text-4xl uppercase leading-none tracking-[0.04em]">Clean Path Map</h3>
          <div className="mt-6 space-y-4 text-sm text-white/72">
            <div className="rounded-[1.5rem] border border-white/10 p-4">
              <p className="font-medium text-white">Public</p>
              <p className="mt-2">`/login`, `/register`</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 p-4">
              <p className="font-medium text-white">Protected</p>
              <p className="mt-2">`/`, `/tasks`, `/tasks/:taskId`, `/profile`</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 p-4">
              <p className="font-medium text-white">Admin</p>
              <p className="mt-2">`/users`</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

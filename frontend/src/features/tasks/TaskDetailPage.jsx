import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  addTaskDocuments,
  deleteTask,
  deleteTaskDocument,
  getTask,
  getTaskDocument,
  updateTask,
} from "../../api/tasks";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { formatDate } from "../../utils/format";
import { TaskForm } from "./TaskForm";

export function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { users, refreshTasks } = useOutletContext();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [documentActionError, setDocumentActionError] = useState("");

  useEffect(() => {
    async function loadTask() {
      setLoading(true);
      setError("");

      try {
        const response = await getTask(taskId);
        setTask(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [taskId]);

  async function handleUpdate(payload) {
    const updated = await updateTask(taskId, payload);
    setTask(updated);
    await refreshTasks();
  }

  async function handleDelete() {
    await deleteTask(taskId);
    await refreshTasks();
    navigate("/tasks");
  }

  async function handleAddFiles(event) {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }

    const updated = await addTaskDocuments(taskId, files);
    setTask(updated);
    await refreshTasks();
  }

  async function handleDeleteDocument(documentId) {
    await deleteTaskDocument(taskId, documentId);
    const updated = await getTask(taskId);
    setTask(updated);
    await refreshTasks();
  }

  async function handlePreviewDocument(document) {
    setDocumentActionError("");

    try {
      const file = await getTaskDocument(document.id);
      const objectUrl = window.URL.createObjectURL(file.blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
    } catch (err) {
      setDocumentActionError(err.message);
    }
  }

  async function handleDownloadDocument(document) {
    setDocumentActionError("");

    try {
      const file = await getTaskDocument(document.id);
      const objectUrl = window.URL.createObjectURL(file.blob);
      const anchor = window.document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = document.originalFilename || `document-${document.id}.pdf`;
      window.document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      setDocumentActionError(err.message);
    }
  }

  if (loading) {
    return <p className="text-sm text-black/55">Loading task details...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!task) {
    return <EmptyState title="Task not found" body="Choose another task from the list to inspect its details." />;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-black/10 pb-5">
        <p className="text-xs uppercase tracking-[0.32em] text-black/45">Task Detail</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-black">{task.title}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge value={task.status} tone={task.status === "DONE" ? "muted" : "default"} />
          <Badge value={task.priority} />
        </div>
        <div className="mt-4 space-y-1 text-sm text-black/55">
          <p>Assigned to: {task.assignedTo?.username || "Unassigned"}</p>
          <p>Created by: {task.createdBy?.username || "-"}</p>
          <p>Due date: {formatDate(task.dueDate)}</p>
        </div>
      </div>

      <TaskForm initialValues={task} users={users} onSubmit={handleUpdate} submitLabel="Update Task" />

      <div className="space-y-4 border-t border-black/10 pt-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-black/45">Documents</p>
            <h4 className="mt-2 text-lg font-medium">Attached PDFs</h4>
          </div>
          <label className="cursor-pointer rounded-full border border-black/10 px-4 py-2 text-sm transition hover:bg-black hover:text-white">
            Add files
            <input type="file" accept="application/pdf" multiple className="hidden" onChange={handleAddFiles} />
          </label>
        </div>

        {documentActionError ? <p className="text-sm text-red-600">{documentActionError}</p> : null}

        {task.documents?.length ? (
          <div className="space-y-3">
            {task.documents.map((document) => (
              <div key={document.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-black/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{document.originalFilename}</p>
                  <p className="mt-1 text-xs text-black/50">{document.contentType || "application/pdf"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => handlePreviewDocument(document)}>
                    Preview
                  </Button>
                  <Button variant="ghost" onClick={() => handleDownloadDocument(document)}>
                    Download
                  </Button>
                  <Button variant="ghost" onClick={() => handleDeleteDocument(document.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No documents" body="Upload up to three PDFs to reflect the assignment document flow." />
        )}
      </div>

      <div className="border-t border-black/10 pt-5">
        <Button variant="danger" onClick={handleDelete}>
          Delete Task
        </Button>
      </div>
    </div>
  );
}

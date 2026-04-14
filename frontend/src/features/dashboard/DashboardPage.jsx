
import { useEffect, useState } from "react";
import { listTasks, updateTask, deleteTask } from "../../api/tasks"; // Import updateTask and deleteTask
import { Button } from "../../components/ui/Button"; // Import Button component
import { Badge } from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../../styles/index.css";

export function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Board columns by priority
  const priorities = ["HIGH", "MEDIUM", "LOW"];
  const [columns, setColumns] = useState({ HIGH: [], MEDIUM: [], LOW: [] });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await listTasks();
        const allTasks = response.content || [];
        setTasks(allTasks);
        // Group tasks by priority
        const grouped = { HIGH: [], MEDIUM: [], LOW: [] };
        allTasks.forEach((task) => {
          if (grouped[task.priority]) grouped[task.priority].push(task);
        });
        setColumns(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function onDragEnd(result) { // Make onDragEnd async
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI update
    let movedTask = null;
    setColumns((prevColumns) => {
      if (source.droppableId === destination.droppableId) {
        const newCol = Array.from(prevColumns[source.droppableId]);
        const [optimisticMoved] = newCol.splice(source.index, 1);
        newCol.splice(destination.index, 0, optimisticMoved);
        return {
          ...prevColumns,
          [source.droppableId]: newCol,
        };
      }

      const newSourceCol = Array.from(prevColumns[source.droppableId]);
      const newDestCol = Array.from(prevColumns[destination.droppableId]);
      const [optimisticMoved] = newSourceCol.splice(source.index, 1);
      optimisticMoved.priority = destination.droppableId; // Update priority locally
      newDestCol.splice(destination.index, 0, optimisticMoved);

      movedTask = { ...optimisticMoved }; // Capture the moved task for backend update

      return {
        ...prevColumns,
        [source.droppableId]: newSourceCol,
        [destination.droppableId]: newDestCol,
      };
    });

    if (movedTask) {
      try {
        // Send update to backend
        await updateTask(movedTask.id, { ...movedTask, priority: destination.droppableId });
      } catch (err) {
        // If backend update fails, set an error.
        // For a more robust solution, you might want to revert the UI state here.
        setError("Failed to update task priority on the server: " + err.message);
        console.error("Failed to update task priority:", err);
      }
    }
  }

  async function handleDeleteTask(taskId, priority) {
    // Store current state for potential revert
    const originalColumns = { ...columns };

    // Optimistically remove the task from the UI
    setColumns((prevColumns) => {
      const newColumn = prevColumns[priority].filter((task) => task.id !== taskId);
      return {
        ...prevColumns,
        [priority]: newColumn,
      };
    });

    try {
      await deleteTask(taskId);
    } catch (err) {
      // If backend update fails, revert the UI state
      setColumns(originalColumns); // Revert to original state
      setError("Failed to delete task on the server: " + err.message);
      console.error("Failed to delete task:", err);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 p-0 m-0">
      <header className="p-8 pb-4 mb-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Task Dashboard</h1>
        <span className="text-base text-black/50 mt-2 md:mt-0">Drag and drop tasks between priorities</span>
      </header>
      <main className="flex-1 flex flex-col items-stretch justify-stretch overflow-x-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-lg text-black/50">Loading tasks...</div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-600">{error}</div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex-1 flex gap-8 px-8 pb-8 pt-2 w-full h-full">
              {priorities.map((priority) => (
                <Droppable droppableId={priority} key={priority}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 bg-white/90 rounded-2xl shadow-xl border border-gray-200 p-4 min-w-[320px] max-w-[400px] flex flex-col transition-all duration-200 ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
                    >
                      <h2 className="text-xl font-semibold pb-2 mb-4 border-b border-gray-200 text-center uppercase tracking-wider text-gray-700">
                        {priority} Priority
                      </h2>
                      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2"> {/* Added overflow-y-auto and pr-2 for scrollbar */}
                        {columns[priority].length === 0 && (
                          <div className="text-center text-black/30 py-8">No tasks</div>
                        )}
                        {columns[priority].map((task, idx) => (
                          <Draggable draggableId={String(task.id)} index={idx} key={task.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={provided.draggableProps.style}
                               className={`rounded-xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg transition-all flex flex-col gap-2 cursor-grab ${snapshot.isDragging ? "ring-2 ring-blue-400 z-50" : ""}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium text-lg text-gray-900 truncate" title={task.title}>{task.title}</span>
                                  <Badge value={task.status} tone={task.status === "DONE" ? "muted" : "default"} />
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs text-black/55">
                                  <span className="text-gray-600">{task.assignedTo?.username || "Unassigned"}</span>
                                  <span>/</span>
                                  <span>{formatDate(task.dueDate)}</span>
                                </div>
                                <div className="text-xs text-black/40 truncate">{task.description}</div>
                                {/* Action button to delete a task */}
                                <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent drag from starting on button click
                                      handleDeleteTask(task.id, task.priority);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </main>
    </div>
  );
}
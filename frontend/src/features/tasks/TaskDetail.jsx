import { useOutletContext, useParams } from "react-router-dom";

export function TaskDetail() {
  const { taskId } = useParams();
  // The context is passed from the parent route element in TasksPage
  const { users, refreshTasks } = useOutletContext();
  return (
    <div>
      <h3 className="text-lg font-semibold">Task Details</h3>
      <p className="mt-4">Details for task ID: {taskId}</p>
      <p className="mt-2 text-sm text-gray-500">This is where the form to view or edit a specific task would appear.</p>
    </div>
  );
}
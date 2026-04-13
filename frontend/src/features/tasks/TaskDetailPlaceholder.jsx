import { EmptyState } from "../../components/ui/EmptyState";

export function TaskDetailPlaceholder() {
  return (
    <EmptyState
      title="Select a task"
      body="The detail route lives here. Choose any task from the list to open its dedicated child view."
    />
  );
}

import { Badge } from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";

export function TaskPreviewModal({ task, onClose }) {
  if (!task) return null;

  // Stop propagation to prevent clicks inside the modal from closing it via the overlay
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose} // Close modal on overlay click
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full space-y-6"
        onClick={handleModalContentClick}
      >
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-2xl font-semibold tracking-tight text-black">{task.title}</h3>
            <button
              className="text-gray-400 hover:text-gray-800 transition-colors text-2xl leading-none"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge value={task.status} tone={task.status === "DONE" ? "muted" : "default"} />
            <Badge value={task.priority} />
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-base text-gray-700 whitespace-pre-wrap">{task.description || "No description provided."}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <p><span className="font-medium text-gray-800">Assigned To:</span> {task.assignedTo?.username || "Unassigned"}</p>
            <p><span className="font-medium text-gray-800">Due Date:</span> {formatDate(task.dueDate)}</p>
            <p><span className="font-medium text-gray-800">Created By:</span> {task.createdBy?.username || "-"}</p>
          </div>
          {task.documents && task.documents.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <span className="font-medium text-gray-800 block mb-3">Attachments:</span>
              <div className="flex flex-wrap gap-2">
                {task.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    {doc.originalFilename}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
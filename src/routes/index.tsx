import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index
});

function Index() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Home</h2>
        <p className="text-gray-600">Welcome to Merkle Science Tracker Chat</p>
      </div>
    </div>
  );
}

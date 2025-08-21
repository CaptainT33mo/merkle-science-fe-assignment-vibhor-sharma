import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index
});

function Index() {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate({ to: "/chat" });
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Home</h2>
        <p className="text-gray-600 mb-6">
          Welcome to Merkle Science Tracker Chat
        </p>
        <Button onClick={handleChatClick} variant="primary">
          Start Chat
        </Button>
      </div>
    </div>
  );
}

import ApiKeySettings from "@/components/pages/settings/api-key-settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 bg-gray-50 md:mr-2 md:mb-2 md:rounded-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h2>
      <ApiKeySettings />
      <div className="bg-white rounded-lg p-4 border">
        <h3 className="font-semibold text-gray-900 mb-2">About</h3>
        <p className="text-gray-600 text-sm">
          This is a Merkle Science chat interface powered by OpenAI. Configure
          your API key above to start chatting.
        </p>
      </div>
    </div>
  );
}

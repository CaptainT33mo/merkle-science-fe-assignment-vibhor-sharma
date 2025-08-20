import { useState, useEffect } from "react";
import { Key, Eye, EyeOff } from "lucide-react";

interface ApiKeySettingsProps {
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeySettings = ({ onApiKeyChange }: ApiKeySettingsProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      onApiKeyChange(savedKey);
    }
  }, [onApiKeyChange]);

  const handleSaveKey = () => {
    localStorage.setItem("openai_api_key", apiKey);
    onApiKeyChange(apiKey);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Key className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">
          OpenAI API Configuration
        </h3>
      </div>

      <p className="text-sm text-blue-700 mb-3">
        Enter your OpenAI API key to enable AI responses. Your key is stored
        locally in your browser.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <button
          onClick={handleSaveKey}
          disabled={!apiKey.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
        >
          Save Key
        </button>
      </div>

      <div className="mt-3 text-xs text-blue-600">
        <p>
          💡 <strong>Recommendation:</strong> For production apps, connect to
          Supabase for secure API key management.
        </p>
      </div>
    </div>
  );
};

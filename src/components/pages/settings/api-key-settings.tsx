import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, Trash2 } from "lucide-react";
import { useGlobalStore } from "@/store";
import { Button } from "@/components/ui/button";

export default function ApiKeySettings() {
  const { apiKey, setApiKey, clearApiKey } = useGlobalStore();
  const [showKey, setShowKey] = useState(false);
  const [inputValue, setInputValue] = useState(apiKey);

  // Sync input value with store value
  useEffect(() => {
    setInputValue(apiKey);
  }, [apiKey]);

  const handleSaveKey = () => {
    setApiKey(inputValue);
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputValue("");
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
        locally in your browser using Zustand store with persistence.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? "text" : "password"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
        <Button
          onClick={handleSaveKey}
          variant="primary"
          disabled={!inputValue.trim()}
          // className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
        >
          Save Key
        </Button>
        {apiKey && (
          <Button
            variant="destructive"
            onClick={handleClearKey}
            // className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 whitespace-nowrap flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {apiKey && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
          ✅ API key is saved and ready to use
        </div>
      )}
    </div>
  );
}

import {
  getDummyResponseByKeywords,
  streamDummyResponse
} from "./dummyResponses";

interface OpenAIStreamOptions {
  apiKey: string;
  message: string;
  onChunk: (chunk: string) => void;
  onComplete: () => void;
}

export async function streamOpenAIResponse({
  apiKey,
  message,
  onChunk,
  onComplete
}: OpenAIStreamOptions) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant specializing in blockchain, cryptocurrency, and related technologies. Provide detailed, accurate, and educational responses. Format your responses with clear headings and bullet points where appropriate."
          },
          {
            role: "user",
            content: message
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);

          if (data === "[DONE]") {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip malformed JSON
            console.error(e);
            continue;
          }
        }
      }
    }
  } catch {
    console.log("OpenAI API failed, using dummy response as fallback");

    // Use dummy response as fallback
    const dummyResponse = getDummyResponseByKeywords(message);
    streamDummyResponse(dummyResponse, onChunk, onComplete);
  }
}

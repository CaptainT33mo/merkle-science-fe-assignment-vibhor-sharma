import {
  getDummyResponseByKeywords,
  streamDummyResponse
} from "./dummyResponses";

interface OpenAIStreamOptions {
  apiKey: string;
  message: string;
  onChunk: (chunk: string) => void;
  onComplete: () => void;
  abortSignal?: AbortSignal;
  onDummyStreamStart?: (timeoutId: NodeJS.Timeout) => void;
}

export async function streamOpenAIResponse({
  apiKey,
  message,
  onChunk,
  onComplete,
  abortSignal,
  onDummyStreamStart
}: OpenAIStreamOptions) {
  // For testing: force dummy response if API key is "test" or "invalid"
  if (apiKey === "test" || apiKey === "invalid") {
    console.log("Test/invalid mode: using dummy response");
    const dummyResponse = getDummyResponseByKeywords(message);
    streamDummyResponse(
      dummyResponse,
      onChunk,
      onComplete,
      50,
      onDummyStreamStart
    );
    return;
  }

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
      }),
      signal: abortSignal
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
  } catch (error) {
    // Check if the error is due to abort
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Request was aborted");
      return;
    }

    console.log("OpenAI API failed, using dummy response as fallback", error);

    // Use dummy response as fallback
    try {
      const dummyResponse = getDummyResponseByKeywords(message);
      console.log("Using dummy response:", dummyResponse.title);
      streamDummyResponse(
        dummyResponse,
        onChunk,
        onComplete,
        50,
        onDummyStreamStart
      );
    } catch (dummyError) {
      console.error("Dummy response also failed:", dummyError);
      // Provide a basic fallback response
      onChunk(
        "I apologize, but I'm currently unable to provide a response. Please try again later."
      );
      onComplete();
    }
  }
}

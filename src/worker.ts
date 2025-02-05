/**
 * Interface for the message sent from the main thread to the worker
 * @url - The URL of the audio file
 * @name - The name of the audio file
 * @audioBuffer - The decoded audio buffer
 * @error - The error message
 */
interface WorkerMessage {
  url: string;
  name: string;
}

interface WorkerResponse {
  name: string;
  audioBuffer?: AudioBuffer;
  error?: string;
}

self.addEventListener("message", async (event: MessageEvent<WorkerMessage>) => {
  // Extract the URL and name from the message
  const { url, name } = event.data;

  try {
    // Fetch the audio file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Convert the response to an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Decode the audio data
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Send the decoded audio buffer back to the main thread
    const responseMessage: WorkerResponse = { name, audioBuffer };
    self.postMessage(responseMessage);
  } catch (error) {
    // Send an error message back to the main thread
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const responseMessage: WorkerResponse = { name, error: errorMessage };
    self.postMessage(responseMessage);
  }
});

// Export an empty object to satisfy TypeScript's module system
export default {};

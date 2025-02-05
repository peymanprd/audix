/**
 * Audix - A Functional Audio Manager for the Web
 *
 * Audix is a lightweight and flexible audio management library designed for modern web applications.
 * It provides a functional programming interface to control audio playback, including:
 * - Loading and decoding audio files.
 * - Playing, pausing, stopping, and seeking audio.
 * - Managing multiple audio instances.
 * - Applying volume control.
 * - Handling audio events (play, pause, end, error).
 *
 * Built with TypeScript and the Web Audio API, Audix is type-safe and easy to integrate into any project.
 *
 * Author: Peyman Pirzadeh
 * Version: 1.0.0
 */

type AudioEvent = "play" | "pause" | "end" | "error";
type AudioSource = {
  source: AudioBufferSourceNode;
  startTime: number;
  offset: number;
};

/**
 * Create an instance of Audix.
 * @returns An object containing methods to manage audio playback.
 */
const createAudix = () => {
  let audioContext: AudioContext | null = new AudioContext();
  let audioBuffers: Map<string, AudioBuffer> = new Map();
  let audioSources: Map<string, AudioSource> = new Map();
  let playbackTimes: Map<string, number> = new Map();
  let eventListeners: Map<string, Map<string, Set<() => void>>> = new Map();
  /**
   * Get or create an audio context.
   * @returns The audio context.
   */
  const getOrCreateAudioContext = () => {
    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContext();
    }
    return audioContext;
  };
  /**
   * Emit an event for a specific audio file.
   * @param event - The event type ('play', 'pause', 'end', 'error').
   * @param name - The name of the audio file.
   */
  const emitEvent = (event: AudioEvent, name: string): void => {
    const eventMap = eventListeners.get(event);
    if (eventMap) {
      const listeners = eventMap.get(name);
      if (listeners) listeners.forEach((listener) => listener());
    }
  };

  /**
   * Load an audio file and store it in the buffer.
   * @param name - A unique name for the audio file.
   * @param url - The URL of the audio file.
   */
  const load = async (name: string, url: string): Promise<void> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const context = getOrCreateAudioContext();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      audioBuffers.set(name, audioBuffer);
    } catch (error) {
      emitEvent("error", name);
      if (error instanceof Error) {
        throw new Error(`Failed to load audio "${name}": ${error.message}`);
      }
    }
  };

  /**
   * Play an audio file.
   * @param name - The name of the audio file to play.
   * @param loop - Whether to loop the audio.
   * @param startTime - The time (in seconds) to start playback from.
   */
  const play = (
    name: string,
    loop: boolean = false,
    startTime?: number
  ): void => {
    const context = getOrCreateAudioContext();

    const audioBuffer = audioBuffers.get(name);
    if (!audioBuffer) throw new Error(`Audio "${name}" not found.`);

    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = loop;
    source.connect(context.destination);

    const playbackTime = startTime ?? playbackTimes.get(name) ?? 0;
    source.start(0, playbackTime);

    audioSources.set(name, {
      source,
      startTime: context.currentTime,
      offset: playbackTime,
    });

    emitEvent("play", name);

    source.onended = () => {
      audioSources.delete(name);
      playbackTimes.delete(name);
      emitEvent("end", name);
    };
  };

  /**
   * Pause an audio file.
   * @param name - The name of the audio file to pause.
   */
  const pause = (name: string): void => {
    const audioSource = audioSources.get(name);
    if (!audioSource) return;

    const { source, startTime, offset } = audioSource;
    const context = getOrCreateAudioContext();
    const currentTime = context.currentTime - startTime + offset;
    playbackTimes.set(name, currentTime);
    source.stop();
    audioSources.delete(name);
    emitEvent("pause", name);
  };

  /**
   * Stop an audio file.
   * @param name - The name of the audio file to stop.
   */
  const stop = (name: string): void => {
    const audioSource = audioSources.get(name);
    if (!audioSource) return;

    const { source } = audioSource;
    source.stop();
    audioSources.delete(name);
    playbackTimes.delete(name);
    emitEvent("end", name);
  };

  /**
   * Seek to a specific time in the audio.
   * @param name - The name of the audio file.
   * @param time - The time (in seconds) to seek to.
   */
  const seek = (name: string, time: number): void => {
    const isPlaying = audioSources.has(name);
    if (isPlaying) pause(name);
    playbackTimes.set(name, time);
    if (isPlaying) play(name);
  };

  /**
   * Get the current playback time of an audio file.
   * @param name - The name of the audio file.
   * @returns The current playback time in seconds.
   */
  const getCurrentTime = (name: string): number => {
    const audioSource = audioSources.get(name);
    if (audioSource) {
      const { startTime, offset } = audioSource;
      const context = getOrCreateAudioContext();
      return context.currentTime - startTime + offset;
    }
    return playbackTimes.get(name) ?? 0;
  };

  /**
   * Set the volume of the audio.
   * @param name - The name of the audio file.
   * @param volume - The volume level (0 to 1).
   */
  const setVolume = (name: string, volume: number): void => {
    const audioSource = audioSources.get(name);
    if (!audioSource) return;

    const { source } = audioSource;
    const context = getOrCreateAudioContext();
    const gainNode = context.createGain();
    gainNode.gain.value = volume;
    source.disconnect();
    source.connect(gainNode);
    gainNode.connect(context.destination);
  };

  /**
   * Add an event listener for a specific audio event.
   * @param event - The event type ('play', 'pause', 'end', 'error').
   * @param name - The name of the audio file.
   * @param listener - The callback function.
   */
  const on = (event: AudioEvent, name: string, listener: () => void): void => {
    if (!eventListeners.has(event)) eventListeners.set(event, new Map());
    const eventMap = eventListeners.get(event)!;
    if (!eventMap.has(name)) eventMap.set(name, new Set());
    eventMap.get(name)!.add(listener);
  };

  /**
   * Remove an event listener for a specific audio event.
   * @param event - The event type ('play', 'pause', 'end', 'error').
   * @param name - The name of the audio file.
   * @param listener - The callback function.
   */
  const off = (event: AudioEvent, name: string, listener: () => void): void => {
    const eventMap = eventListeners.get(event);
    if (eventMap) {
      const listeners = eventMap.get(name);
      if (listeners) listeners.delete(listener);
    }
  };

  /**
   * Clean up resources and stop all audio playback.
   */
  const dispose = (): void => {
    const context = getOrCreateAudioContext();
    audioSources.forEach(({ source }) => source.stop());
    context.close();
    audioContext = null;
    audioSources.clear();
    audioBuffers.clear();
    playbackTimes.clear();
    eventListeners.clear();
  };

  return {
    load,
    play,
    pause,
    stop,
    seek,
    getCurrentTime,
    setVolume,
    on,
    off,
    dispose,
  };
};

export default createAudix;

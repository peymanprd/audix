# Audix

**Audix** is a powerful, flexible, and lightweight audio management library for modern web applications. Built with TypeScript and the Web Audio API, Audix provides full control over audio playback, including loading, playing, pausing, stopping, seeking, and applying effects like volume control. It also supports optional Web Workers for offloading audio decoding tasks to improve performance.

---

## Features

- 🎵 **Play, Pause, Stop, and Seek**: Full control over audio playback.
- 🔄 **Looping**: Seamlessly loop audio files.
- 🔊 **Volume Control**: Adjust the volume of individual audio files.
- ⏱️ **Playback Time Management**: Get the current playback time and seek to specific positions.
- 🚀 **Web Worker Support**: Optional Web Worker for offloading audio decoding tasks (improves performance for large files).
- 🎚️ **Event Handling**: Listen to events like `play`, `pause`, `end`,`loaded` and `error`.
- 🧹 **Memory Management**: Unload unused audio files to free up memory.
- 💻 **TypeScript Support**: Fully typed for better developer experience.

---

## Installation

You can install Audix via npm:

```bash
npm install audix
```

Or using yarn:

```bash
yarn add audix
```

---

## Usage

### Basic Usage

```javascript
import createAudix from "audix";

// Create an instance of Audix
const audix = createAudix();

// Load an audio file
await audix.load("background", "path/to/background.mp3");

// Play the audio file (with looping)
audix.play("background", true);

// Pause the audio
audix.pause("background");

// Stop the audio
audix.stop("background");

// Seek to a specific time (in seconds)
audix.seek("background", 30);

// Set the volume (0 to 1)
audix.setVolume("background", 0.5);

// Get the current playback time
const currentTime = audix.getCurrentTime("background");
console.log(`Current time: ${currentTime} seconds`);

// Unload the audio file to free up memory
audix.unload("background");

// Clean up all resources
audix.dispose();
```

### Using Web Workers (Optional)

To enable Web Workers for audio decoding, pass the `useWorker` option when creating an instance of Audix:

```javascript
const audix = createAudix({ useWorker: true });

// Load and play audio as usual
await audix.load("background", "path/to/background.mp3");
audix.play("background");
```

---

## API Documentation

### `createAudix(options?: { useWorker?: boolean })`

Creates a new instance of Audix.

- **`options.useWorker`** (optional): If `true`, uses a Web Worker for audio decoding. Default is `false`.

### Methods

#### `load(name: string, url: string): Promise<void>`

Loads an audio file and stores it in the buffer.

- **`name`**: A unique name for the audio file.
- **`url`**: The URL of the audio file.

#### `play(name: string, loop?: boolean, startTime?: number): void`

Plays an audio file.

- **`name`**: The name of the audio file to play.
- **`loop`**: Whether to loop the audio. Default is `false`.
- **`startTime`**: The time (in seconds) to start playback from. Default is `0`.

#### `pause(name: string): void`

Pauses an audio file.

- **`name`**: The name of the audio file to pause.

#### `stop(name: string): void`

Stops an audio file.

- **`name`**: The name of the audio file to stop.

#### `seek(name: string, time: number): void`

Seeks to a specific time in the audio.

- **`name`**: The name of the audio file.
- **`time`**: The time (in seconds) to seek to.

#### `getCurrentTime(name: string): number`

Gets the current playback time of an audio file.

- **`name`**: The name of the audio file.
- **Returns**: The current playback time in seconds.

#### `setVolume(name: string, volume: number): void`

Sets the volume of an audio file.

- **`name`**: The name of the audio file.
- **`volume`**: The volume level (0 to 1).

#### `setPlaybackRate(name: string, rate: number): void`

Sets the playback rate of an audio file.

- **`name`**: The name of the audio file.
- **`rate`**: The playback rate (e.g., 1.0 for normal speed, 0.5 for half speed, 2.0 for double speed).

#### `addEffect(name: string, effect: (context: AudioContext) => AudioNode): void`

Adds a custom audio effect to an audio file.

- **`name`**: The name of the audio file.
- **`effect`**: A function that takes an **`AudioContext`** and returns an **`AudioNode`** (e.g., a gain node, filter, etc.).

#### `on(event: AudioEvent, name: string, listener: () => void): void`

Adds an event listener for a specific audio event.

- **`event`**: The event type (`play`, `pause`, `end`, `error`).
- **`name`**: The name of the audio file.
- **`listener`**: The callback function.

#### `off(event: AudioEvent, name: string, listener: () => void): void`

Removes an event listener for a specific audio event.

- **`event`**: The event type (`play`, `pause`, `end`, `error`).
- **`name`**: The name of the audio file.
- **`listener`**: The callback function.

#### `unload(name: string): void`

Unloads an audio file and frees up memory.

- **`name`**: The name of the audio file to unload.

#### `dispose(): void`

Cleans up all resources and stops all audio playback.

---

## Events

Audix emits the following events:

- **`play`**: Triggered when an audio file starts playing.
- **`pause`**: Triggered when an audio file is paused.
- **`end`**: Triggered when an audio file finishes playing.
- **`error`**: Triggered when an error occurs (e.g., loading or decoding fails).
- **`loaded`**: Triggered when an audio file is successfully loaded and decoded (especially useful when using the **`useWorker`** option).

### Example: Listening to Events

```javascript
audix.on("play", "background", () => {
  console.log("Background music started playing");
});

audix.on("loaded", "background", () => {
  console.log("Background music loaded and ready to play");
});

audix.on("error", "background", (data) => {
  console.error("Error occurred:", data.error);
});
```

---

## Why Use Audix?

- **Lightweight**: Minimal overhead and optimized for performance.
- **Flexible**: Supports multiple audio files, looping, volume control, and more.
- **Modern**: Built with TypeScript and the Web Audio API.
- **Optional Web Workers**: Improves performance for large audio files.
- **Easy to Use**: Simple and intuitive API.

---

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on GitHub. If you'd like to contribute code, feel free to submit a pull request.

---

## License

Audix is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

- **Peyman Pirzadeh**
- GitHub: [Me!](https://github.com/peymanprd)
- Email: dev.pirzadeh@gmail.com

---

Enjoy using Audix! 🎶

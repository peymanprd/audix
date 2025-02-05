# Audix

A lightweight and flexible audio management library designed for modern web applications.

## Installation

```bash
npm install audix
```

### Usage

```javascript
import createAudix from "audix";

const audix = createAudix();
audix.load("background", "background.mp3");
audix.play("background", true);
```

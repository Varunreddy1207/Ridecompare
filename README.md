# VOZX RideCompare 🚗⚡
> **One Ride. All Prices.** — The next-generation real-time multi-provider ride price aggregator and comparison platform.

[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Platform](https://img.shields.io/badge/platform-Mobile%20%7C%20Tablet%20%7C%20Desktop-orange.svg)]()

---

## 🌟 Overview
**VOZX RideCompare** solves rideshare fragmentation by letting users search for a destination once and compare live estimated fares, ETAs, and vehicle tiers across all major providers (**Uber**, **Rapido**, and **Ola**) in one clean, unified interface.

### ✨ Key Features
- **⚡ Real-time Fare Comparison**: Simultaneously compares prices, wait times, and vehicle classes across Uber, Rapido, and Ola.
- **🗺️ Interactive Cyberpunk Live Map**: Dark-themed vector route canvas with animated route path, GPS radar pulse, destination pin, and real-time moving vehicle markers.
- **🎬 Futuristic Animated Reveal**: Comparison results and route map remain cleanly hidden until the user clicks **"Search Rides"**, revealing with a smooth spring slide-in animation.
- **📱 True Responsive Design**:
  - **Mobile (< 768px)**: Native app experience with bottom navigation and quick comparison cards.
  - **Tablet (768px – 1023px)**: Floating glassmorphism navigation dock.
  - **Desktop (>= 1024px)**: Full widescreen dashboard with sidebar navigation, live GPS status bar, and 2-column comparison layout.
- **🔊 Synthesized Web Audio FX**: Rich UI sound effects for tap feedback, search actions, and ride booking confirmation.
- **📍 Smart Recent Searches**: Instant destination chips with preset routes (Sanjay Ghodawat University, Pune Junction, etc.).

---

## 🛠️ Tech Stack
- **HTML5 & Vanilla JavaScript**: Fast, modular ES6 architecture (`RideCompareApp` controller, `WebAudio` synthesizer).
- **Tailwind CSS & Custom Cyberpunk Theme**: Dark midnight blue glassmorphism aesthetic (`#020617`, `#070D1E`, neon cyan, electric blue, lime green).
- **Vector SVG Engine**: Dynamic route line drawing and marker mapping.
- **Python HTTP Server**: Lightweight local test server with zero-cache headers.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Varunreddy1207/Ridecompare.git
cd Ridecompare
```

### 2. Run locally
You can use Python's built-in server or any static file server:

```bash
# Using Python
python server.py
# or
python -m http.server 3000
```

### 3. Open in Browser
Navigate to:
```
http://localhost:3000
```

---

## 📁 Project Structure
```
Ridecompare/
├── index.html            # Main single-page application entrypoint
├── css/
│   └── styles.css        # Custom styles, animations, and responsive rules
├── js/
│   ├── app.js            # Master application controller and routing
│   └── audio.js          # Web Audio API sound effects synthesizer
├── assets/
│   └── images/           # Brand logos, emblems, and visual assets
├── server.py             # Development server with cache-busting headers
└── README.md             # Project documentation
```

---

## 📄 License
This project is licensed under the MIT License.

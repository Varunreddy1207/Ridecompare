# VOZX RideCompare 🚀
> **One Ride. Every Price.**  
> A premium AI-powered ride comparison application for Android & iOS comparing fares across **Rapido**, **Uber**, **Ola**, **BluSmart**, and **Namma Yatri**.

---

## 🎨 Brand Identity & Theme
- **App Name:** VOZX RideCompare
- **Tagline:** One Ride. Every Price.
- **Color Palette:**
  - Deep Black: `#030712`
  - Accent Blue: `#2563EB`
  - Neon Cyan Glow: `#22D3EE`
  - Success Green: `#22C55E`
  - Warning Orange: `#F59E0B`
  - Error Red: `#EF4444`
- **Aesthetic:** Tesla Dark Mode, Apple Maps fluidity, Spotify glassmorphism with glowing neon cyan/blue accents and 24px rounded corners.

---

## 📱 Complete App Flow (15+ Screens Implemented)

1. **Splash Screen (`screen-splash`):**
   - 3D Metallic chrome & neon electric blue VOZX logo with animated light beam sweep.
   - Luxury electric sports car with glowing neon cyan/red strip taillights overlooking a cyberpunk night skyline.
   - Tagline, Get Started, and Login buttons.

2. **Onboarding Carousel (`screen-onboarding`):**
   - Step 1: *Compare ride prices instantly* (Rapido, Uber, Ola, BluSmart).
   - Step 2: *Save money every trip* (Side-by-side transparent fares).
   - Step 3: *AI recommends the smartest ride* (Multi-factor prediction).
   - Interactive step dots, Skip, and Next / Start Riding buttons.

3. **Login / Signup (`screen-auth`):**
   - Continue with Google & Apple.
   - Phone Number OTP with +91 Indian code selector, live 30s countdown timer, and 4-digit code verification (`4921`).
   - Email/Password login switch.

4. **Home Screen (`screen-home`):**
   - Dynamic user greeting: *"Good Morning, Varun Reddy 👋"*.
   - Pickup & Drop search cards (*Current Location* → *Sanjay Ghodawat University*).
   - "Search Rides Across 5 Apps" glowing blue button.
   - Saved Places quick chips (Home, College SGU, Gym, Airport).
   - Live Leaflet Tesla-style Dark Mini-Map Route Preview.
   - Recent Searches list (SGU Ichalkaranji, Pune Junction, Home).
   - Floating AI Assistant quantum button.

5. **Search Destination Screen (`screen-search`):**
   - Live real-time search input autocomplete.
   - One-tap "Use Current Location (GPS ON)" button.
   - Simulated Voice Ride Search trigger.
   - Suggested & Popular destinations with distance tags.

6. **Map Ride Comparison Screen (`screen-comparison`):**
   - Fullscreen dark Tesla/Apple map with neon glowing blue & cyan polyline route.
   - Route header: *4.2 km · 12 min · Moderate Traffic*.
   - Live loading ticker: *"Comparing live prices across 5 ride apps..."*
   - Multi-category filter pills: **All (10)**, **Bike (3)**, **Auto (4)**, **Cab (1)**, **EV (1)**, **SUV (1)**.
   - Provider cards for **Rapido Bike (₹78 - Cheapest)**, **Ola Bike (₹92)**, **Uber Moto (₹105)**, **Rapido Auto (₹110)**, **Namma Yatri Auto (₹112)**, **Uber Auto (₹118)**, **Ola Auto (₹142)**, **Uber Go Cab (₹168)**, **BluSmart EV (₹185)**, **Uber XL (₹245)**.

7. **Ride Details Screen (`screen-details`):**
   - Vehicle overview, driver proximity (3 mins away), safety badges.
   - Pickup & destination address details.
   - Transparent Fare Breakdown: Base fare, Distance fare, Taxes (5%), Platform fee (FREE), Promo discount (`VOZXAI` -₹15), and Total payable.
   - One-tap "Book Ride with Driver" button.

8. **AI Smart Recommendation Screen (`screen-ai-recommendation`):**
   - Neural quantum AI processor core visual (`assets/images/ai_chip.jpg`).
   - 4-Factor Live Analysis: Price Index (98%), Live Traffic (38 km/h), Rain & Surge (0%), Availability (14 drivers).
   - Curated Cards: 🏆 **Cheapest Ride** (Rapido Bike ₹78), ⚡ **Fastest Ride** (Rapido Auto 14 min), ⭐ **Best Value** (Uber Go AC Cab ₹168).
   - Total Money Saved Today counter (₹142 saved).

9. **Offers & Scratch Cards Screen (`screen-offers`):**
   - Interactive HTML5 Canvas **Scratch & Win** card (scratch off silver coating to reveal ₹50 VOZX Cash).
   - Partner coupons with one-click clipboard copy: `UBERVOZX30` (30% off), `RAPIDOFIRST` (₹25 cashback), `OLAPAY50` (₹50 off), `HDFCVOZX15` (15% cashback), `CAMPUSPASS` (20% student pass).

10. **Wallet Screen (`screen-wallet`):**
    - Metallic dark balance card (Balance: ₹420.50, Cashback: ₹1,280.00).
    - Quick Top-Up chips (+₹100, +₹250, +₹500, +₹1,000).
    - Supported UPI apps: Google Pay, PhonePe, Paytm, BHIM.
    - Promo code redemption bar (`VOZX50`).
    - Transaction history with credit/debit indicators.

11. **Ride Tracking Screen (`screen-tracking`):**
    - Live dark map showing driver icon smoothly gliding along the route polyline.
    - Start PIN / OTP: `4921`.
    - Driver Profile: Rajesh Patil, 4.9★, Bajaj Pulsar (MH 09 CW 9812).
    - Quick actions: In-App Driver Calling dialog, Interactive Driver Chat drawer with quick reply chips, Share live trip, and SOS emergency.

12. **Ride History Screen (`screen-history`):**
    - Filter tabs: All, Completed, Cancelled.
    - Past ride cards with route, price, date, vehicle type, and ratings.
    - "Repeat Ride" button (instant prefill and search) & "Invoice" button.

13. **Saved Places Screen (`screen-saved-places`):**
    - Home, College (SGU), Gym, Airport, Office.
    - "Add New Favorite Place" modal.

14. **Notifications Screen (`screen-notifications`):**
    - Real-time alerts for booking confirmation, price drop alerts, cashback credit, and rain forecast.

15. **Profile Screen (`screen-profile`):**
    - Varun Reddy profile, `varunreddy@gmail.com`.
    - High-tech stats: Total Savings (₹3,450), Total Trips (48), Carbon Saved (18.4 kg CO2).
    - Saved locations, payment methods, ride preferences, notification settings, and Logout.

---

## ⚡ Extra Premium Features

- **AI Price Predictor Modal:** Dynamic SVG curve showing predicted fares for the next 30 minutes with smart advice (*"Wait 10 minutes and save ₹22"*).
- **Split Fare Modal:** Split ride fare with friends with calculated per-person shares and instant UPI payment requests.
- **Emergency SOS Center:** High-priority SOS trigger with siren sound, Police (100) / Ambulance (108) quick dial, and GPS broadcast.
- **Voice Ride Search Modal:** Speech recognition simulation with animated equalizer wave bars.
- **Interactive Device Shell Switcher:** Switch between **iPhone 16 Pro** (with Dynamic Island), **Google Pixel 9 Pro**, and **Fullscreen Responsive Mode**.
- **Synthesized Tesla Sound Engine:** Web Audio API sound feedback for button taps, scratch cards, AI calculations, and success chimes.
- **Live Traffic Layer Toggle:** Toggle real-time traffic heat layer on dark map.

---

## 💻 How to Run Locally

### Option 1: Built-in Python Server (Recommended)
```bash
python server.py
```
Open **[http://localhost:3000](http://localhost:3000)** in Chrome, Safari, or Edge.

### Option 2: Direct Browser
Double-click `index.html` in your file explorer.

---

## 📲 Building Native Android & iOS Apps (Capacitor)

The codebase is pre-configured with `capacitor.config.json` and `manifest.json`.

```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. Add native platforms
npx cap add android
npx cap add ios

# 3. Sync web assets
npx cap sync

# 4. Open in Android Studio / Xcode
npx cap open android
npx cap open ios
```

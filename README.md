# RideCompare - Exact Pixel-Perfect App 📱
> **One Ride. All Prices.**  
> Built with 1-to-1 fidelity matching the reference 8-screen mobile application design.

---

## 📸 The 8 Exact Screens

1. **Splash Screen:**
   - 3D Neon Blue 'R' Emblem with glow.
   - `RideCompare` & `One Ride. All Prices.`
   - "Compare prices from all ride apps. Choose the best. Save money. Travel smarter."
   - Cinematic sports car with neon red taillights & night city skyline background.
   - `Get Started` (Blue Pill) & `Login` button.

2. **Home Screen ("Where do you want to go?"):**
   - Header with 'R' logo, `RideCompare`, and user profile icon.
   - Large headline: `Where do you want to go?`
   - Capsule Search Box:
     - `Pickup Location`: **Current Location**
     - `Drop Location`: **Select destination**
   - `Search Rides` Blue Pill Button.
   - Recent Searches (`Sanjay Ghodawat University`, `Pune Junction`, `Home`).
   - 4-Tab Bottom Navigation (`Home` [Active Blue], `History`, `Saved`, `More`).

3. **Map Comparison Screen:**
   - Full dark Tesla/Apple map with blue route polyline connecting `Ichalkaranji` to destination red pin.
   - Floating Top Capsule: `Current Location` & `Sanjay Ghodawat University` + `+`.
   - Bottom Drawer:
     - `Comparing prices across 4 ride apps...`
     - 4 Provider icons: **Uber**, **Ola**, **Rapido**, **Others (+)**.
     - `★ Best Price`: Rapido - `₹78` (Estimated).

4. **Ride Options List Screen:**
   - Header: `Ride Options` with `Current Location -> Sanjay Ghodawat University` & `4.2 km · 12 min (approx)`.
   - Cards:
     - **Rapido** Bike · 12 min | **₹78** [Cheapest]
     - **Ola** Bike · 14 min | **₹92**
     - **Uber** Bike · 15 min | **₹105**
     - **Rapido** Auto · 16 min | **₹118**
     - **Ola** Auto · 18 min | **₹142**
     - **Uber** Car · 20 min | **₹168**

5. **Ride Details Screen (Rapido Bike):**
   - Top map preview thumbnail.
   - Yellow Rapido Logo box, `Rapido` `Bike`, `₹78`, `12 min`.
   - `Ride Details`:
     - Pickup: **Your Location**
     - Drop: **Sanjay Ghodawat University**
     - Distance: **4.2 km**
     - Estimated Time: **12 min**
   - `About Rapido`: Fast · Affordable · Bike Taxi | ★ 4.2 (1M+ reviews).
   - `Book Now` Blue Pill Button.

6. **Ride Details Screen (Ola Car):**
   - Top map preview thumbnail.
   - Green Ring Ola Logo, `Ola` `Car`, `₹142`, `18 min`.
   - `Ride Details`: Pickup, Drop, Distance 4.2 km, Estimated Time 18 min.
   - `About Ola`: Reliable · Safe · Comfortable | ★ 4.1 (2M+ reviews).
   - `Book Now` Blue Pill Button.

7. **Ride History Screen:**
   - Header: `Ride History`
   - Past rides list:
     - Ola - Bike | **₹96** (SGU -> Home, 12 Sep)
     - Rapido - Bike | **₹82** (College -> City Center, 10 Sep)
     - Uber - Auto | **₹138** (Railway Station -> College, 8 Sep)
     - Ola - Car | **₹165** (Airport -> Home, 5 Sep)
     - Rapido - Bike | **₹74** (College -> Market, 2 Sep)
   - Bottom Nav with `History` active.

8. **Profile Screen:**
   - Header: `Profile`
   - Large Circular Avatar: **Varun Reddy** (`varunreddy@gmail.com`).
   - Menu Items: `Saved Locations`, `Payment Methods`, `Ride Preferences (Bike, Auto, Car)`, `Notifications`, `Help & Support`, `About RideCompare`.
   - Red Outline Pill Button: `Log Out`.
   - Bottom Nav with `More` active.

---

## 🚀 How to Run Locally

### Start Server
```bash
python server.py
```
Open **[http://localhost:3000](http://localhost:3000)**

### View Modes
- **📱 Live Phone:** Tap through the real interactive phone with transitions, dark Leaflet map, audio feedback, and booking flow.
- **🖼️ Exact 8 Screens:** View all 8 phones side-by-side in a single gallery, matching the uploaded design reference.

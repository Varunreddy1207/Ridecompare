// Interactive Tesla/Apple Dark Map Controller for VOZX RideCompare

class VozxMapController {
  constructor() {
    this.mapInstance = null;
    this.previewMapInstance = null;
    this.routeLayer = null;
    this.trafficLayer = null;
    this.driverMarker = null;
    this.pickupMarker = null;
    this.dropMarker = null;
    this.isTrafficVisible = true;
    this.animationTimer = null;
    this.driverStep = 0;
    
    // Route waypoints between Ichalkaranji and Sanjay Ghodawat University (Atigre)
    this.routeCoordinates = [
      [16.6975, 74.4571], // Start: Ichalkaranji Pickup
      [16.7032, 74.4510],
      [16.7115, 74.4420],
      [16.7180, 74.4310],
      [16.7240, 74.4180],
      [16.7310, 74.4020],
      [16.7390, 74.3850],
      [16.7450, 74.3725]  // End: Sanjay Ghodawat University
    ];
  }

  initPreviewMap(containerId = 'home-map-preview') {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (this.previewMapInstance) {
      this.previewMapInstance.invalidateSize();
      return;
    }

    try {
      this.previewMapInstance = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false
      }).setView([16.715, 74.41], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.previewMapInstance);

      // Add miniature glowing route
      L.polyline(this.routeCoordinates, {
        color: '#22D3EE',
        weight: 3,
        opacity: 0.9,
        lineCap: 'round'
      }).addTo(this.previewMapInstance);

      // Start & end dots
      L.circleMarker([16.6975, 74.4571], {
        radius: 4,
        color: '#2563EB',
        fillColor: '#22D3EE',
        fillOpacity: 1
      }).addTo(this.previewMapInstance);

      L.circleMarker([16.7450, 74.3725], {
        radius: 4,
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 1
      }).addTo(this.previewMapInstance);
    } catch (e) {
      console.warn("Map preview init warning:", e);
    }
  }

  initFullMap(containerId = 'full-ride-map') {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (this.mapInstance) {
      setTimeout(() => this.mapInstance.invalidateSize(), 150);
      return;
    }

    try {
      this.mapInstance = L.map(containerId, {
        zoomControl: false,
        attributionControl: false
      }).setView([16.721, 74.415], 12);

      // High-contrast Tesla Dark Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.mapInstance);

      this.renderRoute();
      this.renderMarkers();
      this.renderTrafficSegments();

      setTimeout(() => {
        if (this.mapInstance) this.mapInstance.invalidateSize();
      }, 200);
    } catch (e) {
      console.warn("Full map init error:", e);
    }
  }

  renderRoute() {
    if (!this.mapInstance) return;

    // Glowing outer shadow polyline (neon blue ambient halo)
    L.polyline(this.routeCoordinates, {
      color: '#2563EB',
      weight: 10,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.mapInstance);

    // Glowing core line (neon cyan)
    this.routeLayer = L.polyline(this.routeCoordinates, {
      color: '#22D3EE',
      weight: 4,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
      className: 'glow-polyline'
    }).addTo(this.mapInstance);

    this.mapInstance.fitBounds(this.routeLayer.getBounds(), {
      padding: [40, 40]
    });
  }

  renderMarkers() {
    if (!this.mapInstance) return;

    // Pickup Marker (Glowing Blue with pulsing radar ring)
    const pickupIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-7 h-7 rounded-full bg-cyan-400 opacity-75 animate-ping"></div>
          <div class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-cyan-300 shadow-[0_0_12px_#22D3EE] flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    this.pickupMarker = L.marker([16.6975, 74.4571], { icon: pickupIcon }).addTo(this.mapInstance);
    this.pickupMarker.bindPopup('<b class="text-xs text-white">Current Location</b><br><span class="text-[10px] text-slate-400">Ichalkaranji</span>');

    // Drop Marker (Neon Red Pin with drop flag)
    const dropIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-7 h-7 rounded-full bg-red-500 border-2 border-white shadow-[0_0_15px_#EF4444] flex items-center justify-center text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div class="w-1 h-2 bg-red-400"></div>
        </div>
      `,
      iconSize: [30, 36],
      iconAnchor: [15, 36]
    });

    this.dropMarker = L.marker([16.7450, 74.3725], { icon: dropIcon }).addTo(this.mapInstance);
    this.dropMarker.bindPopup('<b class="text-xs text-white">Sanjay Ghodawat University</b><br><span class="text-[10px] text-slate-400">Atigre Campus</span>');
  }

  renderTrafficSegments() {
    if (!this.mapInstance) return;
    this.trafficLayer = L.layerGroup();

    // Segment 1: Green (smooth)
    L.polyline(this.routeCoordinates.slice(0, 4), {
      color: '#22C55E',
      weight: 3,
      opacity: 0.8
    }).addTo(this.trafficLayer);

    // Segment 2: Orange/Yellow (moderate traffic near bridge)
    L.polyline(this.routeCoordinates.slice(3, 6), {
      color: '#F59E0B',
      weight: 4,
      opacity: 0.9
    }).addTo(this.trafficLayer);

    // Segment 3: Green (free highway flow)
    L.polyline(this.routeCoordinates.slice(5), {
      color: '#22C55E',
      weight: 3,
      opacity: 0.8
    }).addTo(this.trafficLayer);

    if (this.isTrafficVisible) {
      this.trafficLayer.addTo(this.mapInstance);
    }
  }

  toggleTraffic() {
    this.isTrafficVisible = !this.isTrafficVisible;
    if (this.mapInstance && this.trafficLayer) {
      if (this.isTrafficVisible) {
        this.trafficLayer.addTo(this.mapInstance);
      } else {
        this.mapInstance.removeLayer(this.trafficLayer);
      }
    }
    return this.isTrafficVisible;
  }

  recenter() {
    if (this.mapInstance && this.routeLayer) {
      this.mapInstance.fitBounds(this.routeLayer.getBounds(), {
        padding: [50, 50]
      });
    }
  }

  // Live Driver Simulation for Tracking Screen
  startDriverTracking(vehicleCategory = 'bike') {
    if (!this.mapInstance) return;

    if (!this.driverMarker) {
      const vehicleSvg = vehicleCategory === 'bike'
        ? `<svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>`
        : `<svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`;

      const driverIcon = L.divIcon({
        className: 'driver-live-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 rounded-full bg-cyan-500/30 animate-pulse"></div>
            <div class="w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-[0_0_16px_#22D3EE] flex items-center justify-center z-10">
              ${vehicleSvg}
            </div>
            <div class="absolute -top-6 bg-slate-900/90 text-[10px] text-cyan-300 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/40 whitespace-nowrap shadow-lg">
              3 min away
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      this.driverMarker = L.marker(this.routeCoordinates[1], { icon: driverIcon }).addTo(this.mapInstance);
    }

    if (this.animationTimer) clearInterval(this.animationTimer);
    this.driverStep = 1;

    this.animationTimer = setInterval(() => {
      this.driverStep = (this.driverStep + 1) % this.routeCoordinates.length;
      if (this.driverMarker) {
        this.driverMarker.setLatLng(this.routeCoordinates[this.driverStep]);
      }
    }, 2800);
  }

  stopDriverTracking() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
    if (this.driverMarker && this.mapInstance) {
      this.mapInstance.removeLayer(this.driverMarker);
      this.driverMarker = null;
    }
  }
}

window.vozxMap = new VozxMapController();

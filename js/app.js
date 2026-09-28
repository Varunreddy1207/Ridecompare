// VOZX RideCompare - Exact UI Controller & Router

class ExactRideCompareApp {
  constructor() {
    this.currentScreen = 'screen-home';
    this.viewMode = 'single'; // 'single' (interactive phone) or 'grid' (exact 8 screens side-by-side)
    this.historyStack = [];
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initExactMap();
      this.updateNavBarState(this.currentScreen);
    });
  }

  // Switch between Interactive Single Phone and Exact 8-Screen Board
  setViewMode(mode) {
    this.viewMode = mode;
    const singleContainer = document.getElementById('single-phone-container');
    const gridContainer = document.getElementById('grid-board-container');
    const btnSingle = document.getElementById('view-mode-single');
    const btnGrid = document.getElementById('view-mode-grid');

    if (mode === 'grid') {
      if (singleContainer) singleContainer.classList.add('hidden');
      if (gridContainer) gridContainer.classList.remove('hidden');
      if (btnGrid) {
        btnGrid.className = 'px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-[0_0_12px_#2563EB] transition-all flex items-center gap-1.5';
      }
      if (btnSingle) {
        btnSingle.className = 'px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
      }
    } else {
      if (gridContainer) gridContainer.classList.add('hidden');
      if (singleContainer) singleContainer.classList.remove('hidden');
      if (btnSingle) {
        btnSingle.className = 'px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-[0_0_12px_#2563EB] transition-all flex items-center gap-1.5';
      }
      if (btnGrid) {
        btnGrid.className = 'px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
      }
    }

    if (window.soundFX) window.soundFX.playSelect();
  }

  // Navigate to screen
  navigateTo(screenId, push = true) {
    if (this.viewMode === 'grid') {
      this.setViewMode('single');
    }

    if (push && this.currentScreen && this.currentScreen !== screenId) {
      this.historyStack.push(this.currentScreen);
    }

    // Hide old screen
    const prevEl = document.getElementById(this.currentScreen);
    if (prevEl) prevEl.classList.remove('active');

    // Show target screen
    const targetEl = document.getElementById(screenId);
    if (targetEl) targetEl.classList.add('active');

    this.currentScreen = screenId;
    if (window.soundFX) window.soundFX.playTap();

    // Bottom Navigation Bar updates
    this.updateNavBarState(screenId);

    // Map resize if navigating to map
    if (screenId === 'screen-map') {
      setTimeout(() => {
        if (this.mapInstance) {
          this.mapInstance.invalidateSize();
        } else {
          this.initExactMap();
        }
      }, 150);
    }
  }

  goBack() {
    if (this.historyStack.length > 0) {
      const prev = this.historyStack.pop();
      const currentEl = document.getElementById(this.currentScreen);
      if (currentEl) currentEl.classList.remove('active');

      const targetEl = document.getElementById(prev);
      if (targetEl) targetEl.classList.add('active');

      this.currentScreen = prev;
      if (window.soundFX) window.soundFX.playTap();
      this.updateNavBarState(prev);
    } else {
      this.navigateTo('screen-home', false);
    }
  }

  updateNavBarState(screenId) {
    const navBar = document.getElementById('exact-nav-bar');
    if (!navBar) return;

    // Splash and Details screens hide the bottom nav
    const noNavScreens = ['screen-splash', 'screen-details-rapido', 'screen-details-ola'];
    if (noNavScreens.includes(screenId)) {
      navBar.style.display = 'none';
    } else {
      navBar.style.display = 'flex';
    }

    // Reset all tabs
    document.querySelectorAll('.exact-nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Match active tab
    if (screenId === 'screen-home') {
      const el = document.querySelector('.exact-nav-item[data-tab="home"]');
      if (el) el.classList.add('active');
    } else if (screenId === 'screen-history') {
      const el = document.querySelector('.exact-nav-item[data-tab="history"]');
      if (el) el.classList.add('active');
    } else if (screenId === 'screen-profile') {
      const el = document.querySelector('.exact-nav-item[data-tab="more"]');
      if (el) el.classList.add('active');
    }
  }

  // Dark Map for Screen 3
  initExactMap() {
    const mapEl = document.getElementById('exact-map-view');
    if (!mapEl || this.mapInstance) return;

    try {
      this.mapInstance = L.map('exact-map-view', {
        zoomControl: false,
        attributionControl: false
      }).setView([16.721, 74.415], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(this.mapInstance);

      // Route polyline coordinates from Ichalkaranji to Sanjay Ghodawat University
      const coordinates = [
        [16.6975, 74.4571], // Ichalkaranji
        [16.7032, 74.4510],
        [16.7115, 74.4420],
        [16.7180, 74.4310],
        [16.7240, 74.4180],
        [16.7310, 74.4020],
        [16.7390, 74.3850],
        [16.7450, 74.3725]  // Sanjay Ghodawat University
      ];

      // Route Outer Glow
      L.polyline(coordinates, {
        color: '#1D4ED8',
        weight: 8,
        opacity: 0.4,
        lineCap: 'round'
      }).addTo(this.mapInstance);

      // Route Core Line (Exact Blue)
      this.routeLayer = L.polyline(coordinates, {
        color: '#2563EB',
        weight: 4,
        opacity: 1,
        lineCap: 'round'
      }).addTo(this.mapInstance);

      // Start Dot (Current Location / Ichalkaranji)
      const startIcon = L.divIcon({
        className: 'start-map-dot',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-[0_0_10px_#2563EB]"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([16.6975, 74.4571], { icon: startIcon }).addTo(this.mapInstance);

      // End Pin (Red Flag / SGU)
      const endIcon = L.divIcon({
        className: 'end-map-pin',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });
      L.marker([16.7450, 74.3725], { icon: endIcon }).addTo(this.mapInstance);

      this.mapInstance.fitBounds(this.routeLayer.getBounds(), {
        padding: [60, 40]
      });
    } catch (e) {
      console.warn("Exact map init warning:", e);
    }
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (window.soundFX) window.soundFX.playSuccess();

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 2500);
  }
}

window.app = new ExactRideCompareApp();

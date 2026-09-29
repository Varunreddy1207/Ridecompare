// =============================================================================
// VOZX RideCompare — Responsive Master Application Controller
// Seamless screen routing, sound FX, and responsive interaction logic
// =============================================================================

class RideCompareApp {
  constructor() {
    this.currentScreen = 'screen-splash';
    this.currentTab = 'home';
    this.selectedDestination = null;
    this.toastTimeout = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Check initial hash routing (e.g. #home)
      if (window.location.hash === '#home') {
        this.navigateTo('screen-home', false);
      } else {
        this.navigateTo('screen-splash', false);
      }

      // Handle browser back/forward buttons
      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#home') {
          this.navigateTo('screen-home', false);
        } else {
          this.navigateTo('screen-splash', false);
        }
      });

      // Desktop keyboard shortcut: Press '/' to focus search
      document.addEventListener('keydown', (e) => {
        if (e.key === '/' && this.currentScreen === 'screen-home') {
          const input = document.getElementById('desktop-search-input');
          if (input && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
          }
        } else if (e.key === 'Enter' && this.currentScreen === 'screen-splash') {
          this.onGetStarted();
        } else if (e.key === 'Escape') {
          this.closeCompareSheet();
        }
      });
    });
  }

  // Primary Action on Get Started Screen
  onGetStarted() {
    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }
    const btn = document.getElementById('btn-get-started');
    if (btn) {
      btn.style.transform = 'scale(0.97)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    }
    
    // Smooth transition to Home Screen
    setTimeout(() => {
      this.navigateTo('screen-home', true);
      window.location.hash = '#home';
      this.showToast('Welcome to VOZX RideCompare! 🚀');
    }, 180);
  }

  // Secondary Action on Get Started Screen
  onLogin() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.showToast('Login portal opening...');
  }

  // Master Screen Navigator
  navigateTo(screenId, playAudio = true) {
    if (playAudio && window.soundFX) {
      window.soundFX.playTap();
    }

    const screens = document.querySelectorAll('.screen-page');
    screens.forEach(s => {
      s.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Selecting a Recent Search Item
  selectRecent(name, city) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }

    this.selectedDestination = `${name}, ${city}`;

    // Update Drop Location Card text
    const dropText = document.getElementById('home-drop-text');
    if (dropText) {
      dropText.textContent = name;
      dropText.classList.remove('placeholder');
      dropText.classList.add('text-white');
    }

    // Update Map Title if on tablet/desktop
    const mapTitle = document.getElementById('map-route-title');
    const mapSub = document.getElementById('map-route-sub');
    if (mapTitle) {
      mapTitle.textContent = `Current GPS ➔ ${name}`;
    }
    if (mapSub) {
      mapSub.textContent = `Destination: ${city} • Live comparison updated`;
    }

    // Update Mobile Modal subtitle
    const sheetSub = document.getElementById('sheet-dest-subtitle');
    if (sheetSub) {
      sheetSub.textContent = `Current GPS ➔ ${name}`;
    }

    this.showToast(`Selected: ${name} 📍`);
  }

  // Primary "Search Rides" Click Handler
  onSearchRides() {
    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }

    const dropText = document.getElementById('home-drop-text');
    if (!dropText || dropText.classList.contains('placeholder')) {
      // Auto-select Sanjay Ghodawat University as default demonstration
      this.selectRecent('Sanjay Ghodawat University', 'Ichalkaranji');
    }

    // On Mobile (< 768px): Open the compare bottom sheet
    if (window.innerWidth < 768) {
      const sheet = document.getElementById('mobile-compare-sheet');
      if (sheet) {
        sheet.classList.remove('hidden');
        sheet.classList.add('flex');
      }
    } else {
      // On Tablet & Desktop, highlight the map & show toast
      this.showToast('Comparing 3 Ride Apps in real-time...');
    }
  }

  closeCompareSheet() {
    const sheet = document.getElementById('mobile-compare-sheet');
    if (sheet) {
      sheet.classList.add('hidden');
      sheet.classList.remove('flex');
    }
  }

  // Booking a Ride
  bookRide(provider, fare) {
    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }
    this.closeCompareSheet();
    this.showToast(`Booking ${provider} for ₹${fare}... Opening app! 🚗`);
  }

  // Location Picker Prompt
  openLocationPicker(type) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    if (type === 'pickup') {
      this.showToast('Using GPS: Current Location (Accuracy: High)');
    } else {
      this.showToast('Select a location from Recent Searches below 👇');
    }
  }

  // Tab Switching
  switchTab(tab) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.currentTab = tab;

    // Update Mobile Bottom Nav active class
    const mobBtns = document.querySelectorAll('.mob-nav-btn');
    mobBtns.forEach(btn => btn.classList.remove('active'));
    const activeMob = document.getElementById(`mob-nav-${tab}`);
    if (activeMob) activeMob.classList.add('active');

    // Update Tablet Dock active class
    const tabBtns = document.querySelectorAll('.tab-dock-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    const activeTab = document.getElementById(`tab-btn-${tab}`);
    if (activeTab) activeTab.classList.add('active');

    // Update Desktop Sidebar active class
    const deskBtns = document.querySelectorAll('.sidebar-nav-item');
    deskBtns.forEach(btn => btn.classList.remove('active'));
    const activeDesk = document.getElementById(`desk-nav-${tab}`);
    if (activeDesk) activeDesk.classList.add('active');

    if (tab === 'home') {
      this.navigateTo('screen-home', false);
    } else {
      this.showToast(`${tab.charAt(0).toUpperCase() + tab.slice(1)} view selected`);
    }
  }

  // Toast feedback system
  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2500);
  }
}

window.app = new RideCompareApp();

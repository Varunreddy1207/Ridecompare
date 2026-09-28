// VOZX RideCompare - Ultra Responsive Multi-Device Application Controller

class RideCompareApp {
  constructor() {
    this.currentView = 'view-home';
    this.currentRideId = 'rapido-bike';
    this.activeCategory = 'all';
    this.toastTimer = null;
    this.simMode = 'auto';

    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('VOZX RideCompare Responsive Application Initialized.');
      this.bindShortcuts();
    });
  }

  bindShortcuts() {
    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const searchInput = document.querySelector('header input');
        if (searchInput) searchInput.focus();
      }
    });
  }

  // Navigation Router across Desktop Sidebar, Tablet Dock & Mobile Bottom Nav
  navigateTo(viewId) {
    if (window.soundFX) window.soundFX.playTap();
    this.currentView = viewId;

    // 1. Hide all screen views and activate target
    const screens = document.querySelectorAll('.screen-view');
    screens.forEach(s => s.classList.remove('active'));

    const targetScreen = document.getElementById(viewId);
    if (targetScreen) {
      targetScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 2. Sync Desktop Sidebar
    const desktopMap = {
      'view-home': 'nav-desktop-home',
      'view-compare': 'nav-desktop-compare',
      'view-history': 'nav-desktop-history',
      'view-wallet': 'nav-desktop-wallet',
      'view-offers': 'nav-desktop-offers',
      'view-saved': 'nav-desktop-saved',
      'view-profile': 'nav-desktop-profile'
    };

    Object.values(desktopMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    const activeDesktopNav = document.getElementById(desktopMap[viewId]);
    if (activeDesktopNav) activeDesktopNav.classList.add('active');

    // 3. Sync Mobile Bottom Nav
    const mobMap = {
      'view-home': 'nav-mob-home',
      'view-compare': 'nav-mob-compare',
      'view-history': 'nav-mob-history',
      'view-wallet': 'nav-mob-wallet',
      'view-profile': 'nav-mob-profile'
    };

    Object.values(mobMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    const activeMobNav = document.getElementById(mobMap[viewId]);
    if (activeMobNav) activeMobNav.classList.add('active');

    // 4. Sync Tablet Nav Dock
    const tabMap = {
      'view-home': 'dock-tab-home',
      'view-compare': 'dock-tab-compare',
      'view-history': 'dock-tab-history',
      'view-wallet': 'dock-tab-wallet',
      'view-profile': 'dock-tab-profile'
    };

    Object.values(tabMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    const activeTabNav = document.getElementById(tabMap[viewId]);
    if (activeTabNav) activeTabNav.classList.add('active');
  }

  // Swap Pickup & Drop Locations
  swapLocations() {
    if (window.soundFX) window.soundFX.playSelect();
    const pickupEl = document.getElementById('txt-pickup');
    const dropEl = document.getElementById('txt-drop');

    if (pickupEl && dropEl) {
      const temp = pickupEl.textContent;
      pickupEl.textContent = dropEl.textContent;
      dropEl.textContent = temp;
      this.showToast('Route Reversed');
    }
  }

  // Select Quick Destination
  selectDestination(destName) {
    if (window.soundFX) window.soundFX.playSelect();
    const dropEl = document.getElementById('txt-drop');
    if (dropEl) dropEl.textContent = destName;
    this.showToast(`Destination: ${destName}`);
    setTimeout(() => {
      this.navigateTo('view-compare');
    }, 300);
  }

  // Filter Comparison Categories (All, Bike, Auto, Cab)
  filterRideCategory(category) {
    if (window.soundFX) window.soundFX.playTap();
    this.activeCategory = category;

    ['all', 'bike', 'auto', 'cab'].forEach(cat => {
      const tab = document.getElementById(`tab-cat-${cat}`);
      if (tab) {
        if (cat === category) {
          tab.className = 'px-3 py-1 rounded-full text-xs font-bold bg-[#0073FF] text-white';
        } else {
          tab.className = 'px-3 py-1 rounded-full text-xs font-medium bg-[#0B1220] border border-slate-700 text-slate-300 hover:text-white';
        }
      }
    });

    this.showToast(`Filtered by: ${category.toUpperCase()}`);
  }

  // Open Ride Details View
  openRideDetails(rideId) {
    if (window.soundFX) window.soundFX.playSelect();
    this.currentRideId = rideId;

    const rideData = {
      'rapido-bike': {
        name: 'Rapido Bike',
        meta: 'Fastest in traffic • Bike Taxi • Sanitized Helmet',
        fare: '₹78',
        total: '₹78.00',
        logoClass: 'provider-logo-sq provider-rapido',
        logoContent: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>`
      },
      'ola-bike': {
        name: 'Ola Bike',
        meta: 'Verified Rider • Live GPS • Helmet Included',
        fare: '₹92',
        total: '₹92.00',
        logoClass: 'provider-logo-sq provider-ola',
        logoContent: `<div class="w-6 h-6 rounded-full bg-black flex items-center justify-center"><div class="w-3.5 h-3.5 rounded-full border-2 border-[#84CC16]"></div></div>`
      },
      'uber-moto': {
        name: 'Uber Moto',
        meta: 'Uber Safety Shield • Insurance Covered • Doorstep',
        fare: '₹105',
        total: '₹105.00',
        logoClass: 'provider-logo-sq provider-uber',
        logoContent: 'Uber'
      },
      'rapido-auto': {
        name: 'Rapido Auto',
        meta: 'Spacious 3-Seater • Metered Pricing • Direct',
        fare: '₹110',
        total: '₹110.00',
        logoClass: 'provider-logo-sq provider-rapido text-[11px] font-black',
        logoContent: 'AUTO'
      },
      'uber-auto': {
        name: 'Uber Auto',
        meta: 'Top Rated Auto Drivers • Fixed Fare • No Haggling',
        fare: '₹118',
        total: '₹118.00',
        logoClass: 'provider-logo-sq provider-uber text-[11px]',
        logoContent: 'Auto'
      },
      'ola-auto': {
        name: 'Ola Auto',
        meta: 'Sanitized Auto • Live Route Sharing • 24/7 Safety',
        fare: '₹142',
        total: '₹142.00',
        logoClass: 'provider-logo-sq provider-ola',
        logoContent: `<div class="w-6 h-6 rounded-full bg-black flex items-center justify-center"><div class="w-3.5 h-3.5 rounded-full border-2 border-[#84CC16]"></div></div>`
      },
      'uber-car': {
        name: 'Uber Go Car',
        meta: 'AC Compact Sedan • 4 Seats • Clean & Sanitized',
        fare: '₹168',
        total: '₹168.00',
        logoClass: 'provider-logo-sq provider-uber text-[11px]',
        logoContent: 'Go'
      }
    };

    const info = rideData[rideId] || rideData['rapido-bike'];

    const nameEl = document.getElementById('detail-vehicle-name');
    const metaEl = document.getElementById('detail-vehicle-meta');
    const priceEl = document.getElementById('detail-fare-price');
    const totalEl = document.getElementById('detail-total-fare');
    const logoEl = document.getElementById('detail-provider-logo');

    if (nameEl) nameEl.textContent = info.name;
    if (metaEl) metaEl.textContent = info.meta;
    if (priceEl) priceEl.textContent = info.fare;
    if (totalEl) totalEl.textContent = info.total;
    if (logoEl) {
      logoEl.className = info.logoClass;
      logoEl.innerHTML = info.logoContent;
    }

    this.navigateTo('view-details');
  }

  // Confirm Ride Booking
  confirmBooking() {
    if (window.soundFX) {
      window.soundFX.playSuccess();
      setTimeout(() => {
        if (window.soundFX) window.soundFX.playEngine();
      }, 120);
    }

    const modal = document.getElementById('modal-booking-success');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeBookingSuccess() {
    if (window.soundFX) window.soundFX.playTap();
    const modal = document.getElementById('modal-booking-success');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
    this.navigateTo('view-compare');
    this.showToast('Driver is en-route to your pickup location!');
  }

  // AI Assistant Modal
  openAiAssistant() {
    if (window.soundFX) window.soundFX.playSelect();
    const modal = document.getElementById('modal-ai-assistant');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeAiAssistant() {
    if (window.soundFX) window.soundFX.playTap();
    const modal = document.getElementById('modal-ai-assistant');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Copy Coupon Offer
  copyOffer(code) {
    if (window.soundFX) window.soundFX.playSuccess();
    this.showToast(`Coupon "${code}" applied to next booking!`);
  }

  // Handle Logout
  handleLogout() {
    if (window.soundFX) window.soundFX.playSelect();
    this.showToast('Logged out of VOZX RideCompare.');
    setTimeout(() => {
      this.navigateTo('view-home');
    }, 600);
  }

  // Toggle Futuristic Sound FX
  toggleSound() {
    if (!window.soundFX) return;
    const isMuted = window.soundFX.toggleMute();
    const topIcon = document.getElementById('topbar-sound-icon');

    if (isMuted) {
      if (topIcon) topIcon.classList.replace('text-cyan-400', 'text-slate-500');
      this.showToast('Tesla UI Audio Muted');
    } else {
      if (topIcon) topIcon.classList.replace('text-slate-500', 'text-cyan-400');
      window.soundFX.playSuccess();
      this.showToast('Tesla UI Audio Enabled');
    }
  }

  // Interactive Device Simulation Mode (Auto, Desktop, Tablet, Mobile)
  setSimMode(mode) {
    if (window.soundFX) window.soundFX.playSelect();
    this.simMode = mode;

    const contentContainer = document.getElementById('content-container');
    const root = document.getElementById('app-root');
    const sidebar = document.getElementById('desktop-sidebar');
    const topbar = document.getElementById('desktop-topbar');

    ['auto', 'desktop', 'tablet', 'mobile'].forEach(m => {
      const btn = document.getElementById(`prev-btn-${m}`);
      if (btn) {
        if (m === mode) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    if (contentContainer) {
      contentContainer.classList.remove('sim-frame-mobile', 'sim-frame-tablet');
    }

    if (mode === 'mobile') {
      if (contentContainer) contentContainer.classList.add('sim-frame-mobile');
      this.showToast('Simulating Mobile Viewport (390px iPhone)');
    } else if (mode === 'tablet') {
      if (contentContainer) contentContainer.classList.add('sim-frame-tablet');
      this.showToast('Simulating Tablet Viewport (768px iPad)');
    } else if (mode === 'desktop') {
      this.showToast('Desktop Mode (1024px+ Widescreen)');
    } else {
      this.showToast('Auto Responsive (Adapts to Window Width)');
    }
  }

  // Toast Notification System
  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('visible');

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }
}

// Global Application Instance
window.app = new RideCompareApp();

// =============================================================================
// VOZX RideCompare — Master Application Controller & Responsive Router
// =============================================================================

class VOZXAppController {
  constructor() {
    this.currentScreen = 'screen-splash';
    this.simMode = 'auto'; // 'auto' | 'desktop' | 'tablet' | 'mobile'
    this.selectedCategory = 'all';
    this.currentDestination = 'Sanjay Ghodawat University';
    this.toastTimeout = null;

    // Detailed ride specifications for comparison & instant booking
    this.ridesData = {
      'rapido-bike': {
        name: 'Rapido Bike',
        provider: 'Rapido',
        type: 'Bike Taxi',
        tagline: 'Fast • Affordable • Bike Taxi',
        badge: 'Cheapest',
        fare: '₹78',
        total: '₹78.00',
        baseFare: '₹35.00',
        distanceFare: '₹32.00',
        taxFare: '₹4.00',
        discountFare: '-₹15.00',
        eta: '12 min • 3 min away',
        driverName: 'Rajesh Patil (4.9 ★)',
        vehicleInfo: 'Bajaj Pulsar 150 • MH 09 CW 9812',
        otp: '4921',
        logoHtml: `<div class="provider-logo-sq provider-rapido"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg></div>`
      },
      'ola-bike': {
        name: 'Ola Bike',
        provider: 'Ola',
        type: 'Bike Taxi',
        tagline: 'Speedy • Helmet Provided • Insured',
        badge: 'Fastest',
        fare: '₹92',
        total: '₹92.00',
        baseFare: '₹40.00',
        distanceFare: '₹38.00',
        taxFare: '₹5.00',
        discountFare: '-₹5.00',
        eta: '14 min • 4 min away',
        driverName: 'Amit Shinde (4.8 ★)',
        vehicleInfo: 'Hero Splendor Plus • MH 09 BE 4321',
        otp: '5512',
        logoHtml: `<div class="provider-logo-sq provider-ola"><div class="w-6 h-6 rounded-full bg-black flex items-center justify-center"><div class="w-3.5 h-3.5 rounded-full border-2 border-[#84CC16]"></div></div></div>`
      },
      'uber-moto': {
        name: 'Uber Moto',
        provider: 'Uber',
        type: 'Moto Taxi',
        tagline: 'Reliable • GPS Tracked • Cashless',
        badge: 'Comfort',
        fare: '₹105',
        total: '₹105.00',
        baseFare: '₹45.00',
        distanceFare: '₹45.00',
        taxFare: '₹6.00',
        discountFare: '-₹6.00',
        eta: '15 min • 2 min away',
        driverName: 'Vikram Joshi (4.8 ★)',
        vehicleInfo: 'TVS Apache RTR • MH 09 AZ 1120',
        otp: '3890',
        logoHtml: `<div class="provider-logo-sq provider-uber font-bold text-xs">Uber</div>`
      },
      'rapido-auto': {
        name: 'Rapido Auto',
        provider: 'Rapido',
        type: 'Auto Rickshaw',
        tagline: 'Spacious • Doorstep Pickup • 3 Seats',
        badge: 'Best Value',
        fare: '₹110',
        total: '₹110.00',
        baseFare: '₹50.00',
        distanceFare: '₹48.00',
        taxFare: '₹7.00',
        discountFare: '-₹10.00',
        eta: '16 min • 3 min away',
        driverName: 'Santosh Mane (4.7 ★)',
        vehicleInfo: 'Bajaj Compact RE Auto • MH 09 Y 8820',
        otp: '7124',
        logoHtml: `<div class="provider-logo-sq provider-rapido text-[9px] font-black">AUTO</div>`
      },
      'uber-auto': {
        name: 'Uber Auto',
        provider: 'Uber',
        type: 'Auto Rickshaw',
        tagline: 'Metered Transparency • Clean Auto',
        badge: 'Verified',
        fare: '₹118',
        total: '₹118.00',
        baseFare: '₹55.00',
        distanceFare: '₹50.00',
        taxFare: '₹8.00',
        discountFare: '-₹7.00',
        eta: '15 min • 5 min away',
        driverName: 'Mahesh Kamble (4.9 ★)',
        vehicleInfo: 'TVS King Deluxe Auto • MH 09 T 6721',
        otp: '8215',
        logoHtml: `<div class="provider-logo-sq provider-uber text-[9px]">Auto</div>`
      },
      'ola-auto': {
        name: 'Ola Auto',
        provider: 'Ola',
        type: 'Prime Auto',
        tagline: 'Instant Match • No Haggling',
        badge: 'Prime Auto',
        fare: '₹142',
        total: '₹142.00',
        baseFare: '₹65.00',
        distanceFare: '₹62.00',
        taxFare: '₹9.00',
        discountFare: '-₹8.00',
        eta: '18 min • 6 min away',
        driverName: 'Deepak Patil (4.6 ★)',
        vehicleInfo: 'Piaggio Ape City • MH 09 AK 3341',
        otp: '6190',
        logoHtml: `<div class="provider-logo-sq provider-ola"><div class="w-6 h-6 rounded-full bg-black flex items-center justify-center"><div class="w-3.5 h-3.5 rounded-full border-2 border-[#84CC16]"></div></div></div>`
      },
      'uber-car': {
        name: 'Uber Go Car',
        provider: 'Uber',
        type: 'Sedan / Hatchback',
        tagline: '4 Seats • Air Conditioned • Premium Comfort',
        badge: 'AC Cab',
        fare: '₹168',
        total: '₹168.00',
        baseFare: '₹75.00',
        distanceFare: '₹72.00',
        taxFare: '₹11.00',
        discountFare: '-₹15.00',
        eta: '20 min • 4 seats • AC',
        driverName: 'Sachin Deshmukh (4.9 ★)',
        vehicleInfo: 'Maruti Swift VXi • MH 09 DG 4412',
        otp: '2048',
        logoHtml: `<div class="provider-logo-sq provider-uber text-[9px]">Go</div>`
      }
    };

    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Check initial URL hash (e.g. #home, #compare, #splash)
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`screen-${hash}`)) {
        this.navigateTo(`screen-${hash}`);
      } else {
        // Default to Splash Screen on first load
        this.navigateTo('screen-splash');
      }

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Press '/' to focus quick search bar on Desktop
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          const searchInput = document.querySelector('#desktop-topbar input');
          if (searchInput) searchInput.focus();
        }
        // Press 'Escape' to close AI Assistant Modal
        if (e.key === 'Escape') {
          this.closeAiAssistant();
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Flow: Splash Screen ➔ Home Screen
  // ---------------------------------------------------------------------------
  goToHomeScreen() {
    if (window.soundFX) window.soundFX.playSuccess();
    document.body.classList.remove('is-splash');
    this.navigateTo('screen-home');
    this.showToast('Welcome to VOZX RideCompare! 🚀');
  }

  // ---------------------------------------------------------------------------
  // Central Screen Router
  // ---------------------------------------------------------------------------
  navigateTo(screenId) {
    if (window.soundFX && screenId !== 'screen-splash') {
      window.soundFX.playTap();
    }

    // Toggle body.is-splash class for clean immersive splash view
    if (screenId === 'screen-splash') {
      document.body.classList.add('is-splash');
    } else {
      document.body.classList.remove('is-splash');
    }

    // Hide all screen pages
    const pages = document.querySelectorAll('.screen-page');
    pages.forEach(page => page.classList.remove('active'));

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }

    // Synchronize Navigation States across Desktop Sidebar, Tablet Dock, Mobile Nav
    this.syncNavigationState(screenId);

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const viewportRoot = document.getElementById('app-viewport-root');
    if (viewportRoot) {
      viewportRoot.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.currentScreen = screenId;
    window.location.hash = screenId.replace('screen-', '');
  }

  syncNavigationState(screenId) {
    const navKeyMap = {
      'screen-home': 'home',
      'screen-compare': 'compare',
      'screen-history': 'history',
      'screen-wallet': 'wallet',
      'screen-offers': 'offers',
      'screen-saved': 'saved',
      'screen-profile': 'profile'
    };

    const activeKey = navKeyMap[screenId] || '';

    // 1. Desktop Sidebar Links
    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
    if (activeKey) {
      const desktopLink = document.getElementById(`nav-d-${activeKey}`);
      if (desktopLink) desktopLink.classList.add('active');
    }

    // 2. Tablet Dock Links
    document.querySelectorAll('.tab-dock-btn').forEach(el => el.classList.remove('active'));
    if (activeKey) {
      const tabLink = document.getElementById(`tab-nav-${activeKey}`);
      if (tabLink) tabLink.classList.add('active');
    }

    // 3. Mobile Bottom Nav Links
    document.querySelectorAll('.mob-nav-btn').forEach(el => el.classList.remove('active'));
    if (activeKey) {
      const mobLink = document.getElementById(`mob-nav-${activeKey}`);
      if (mobLink) mobLink.classList.add('active');
    }
  }

  // ---------------------------------------------------------------------------
  // Action: Select Recent Search (SGU, Pune, Home, etc.)
  // ---------------------------------------------------------------------------
  selectRecent(destination, city) {
    if (window.soundFX) window.soundFX.playSelect();
    this.currentDestination = destination;

    const dropVal = document.getElementById('home-drop-val');
    if (dropVal) {
      dropVal.textContent = destination;
      dropVal.className = 'text-sm sm:text-base font-bold text-white block';
    }

    this.showToast(`Destination: ${destination} (${city})`);
    this.navigateTo('screen-compare');
  }

  // ---------------------------------------------------------------------------
  // Action: Open Ride Details & Populate Data
  // ---------------------------------------------------------------------------
  openRideDetails(rideKey) {
    if (window.soundFX) window.soundFX.playSelect();

    const ride = this.ridesData[rideKey] || this.ridesData['rapido-bike'];

    // Update Elements on Details Screen
    const dtName = document.getElementById('dt-name');
    const dtFare = document.getElementById('dt-fare');
    const dtTotal = document.getElementById('dt-total');
    const dtLogo = document.getElementById('dt-logo');

    if (dtName) dtName.textContent = ride.name;
    if (dtFare) dtFare.textContent = ride.fare;
    if (dtTotal) dtTotal.textContent = ride.total;
    if (dtLogo && dtLogo.parentElement) {
      dtLogo.outerHTML = ride.logoHtml;
    }

    this.navigateTo('screen-details');
  }

  // ---------------------------------------------------------------------------
  // Action: Confirm & Book Ride
  // ---------------------------------------------------------------------------
  confirmBooking() {
    if (window.soundFX) window.soundFX.playSuccess();

    this.showToast('✅ Ride Confirmed! Driver Rajesh Patil arriving in 3 mins. OTP: 4921');

    setTimeout(() => {
      this.navigateTo('screen-history');
    }, 1600);
  }

  // ---------------------------------------------------------------------------
  // Filter Comparison List by Vehicle Type (All, Bike, Auto, Car)
  // ---------------------------------------------------------------------------
  filterCategory(category) {
    if (window.soundFX) window.soundFX.playTap();
    this.selectedCategory = category;

    // Update Filter Buttons Styling
    const catButtons = ['all', 'bike', 'auto', 'car'];
    catButtons.forEach(cat => {
      const btn = document.getElementById(`cat-${cat}`);
      if (btn) {
        if (cat === category) {
          btn.className = 'px-3 py-1 rounded-full text-xs font-bold bg-[#0073FF] text-white shadow-[0_0_12px_rgba(0,115,255,0.6)]';
        } else {
          btn.className = 'px-3 py-1 rounded-full text-xs font-medium bg-[#0B1220] border border-slate-700 text-slate-300 hover:text-white';
        }
      }
    });

    // Filter Ride Cards with data-cat
    const rideCards = document.querySelectorAll('#screen-compare [data-cat]');
    rideCards.forEach(card => {
      const cardCat = card.getAttribute('data-cat');
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    this.showToast(`Filtered: ${category.toUpperCase()}`);
  }

  // ---------------------------------------------------------------------------
  // Multi-Device Simulation Switcher (Auto, Desktop, Tablet, Mobile)
  // ---------------------------------------------------------------------------
  setSimMode(mode) {
    if (window.soundFX) window.soundFX.playTap();
    this.simMode = mode;

    // Reset simulation classes on body
    document.body.classList.remove('sim-mobile-active', 'sim-tablet-active');

    // Update button active classes on desktop topbar and floating pill
    const modes = ['auto', 'desktop', 'tablet', 'mobile'];
    modes.forEach(m => {
      const btn = document.getElementById(`prev-${m}`);
      const flBtn = document.getElementById(`fl-prev-${m}`);
      if (btn) {
        if (m === mode) btn.classList.add('active');
        else btn.classList.remove('active');
      }
      if (flBtn) {
        if (m === mode) flBtn.classList.add('active');
        else flBtn.classList.remove('active');
      }
    });

    const floatingDock = document.getElementById('floating-device-switcher');

    if (mode === 'mobile') {
      document.body.classList.add('sim-mobile-active');
      if (floatingDock) floatingDock.classList.remove('hidden');
      this.showToast('📱 iPhone Simulator Viewport (390px Mobile View)');
    } else if (mode === 'tablet') {
      document.body.classList.add('sim-tablet-active');
      if (floatingDock) floatingDock.classList.remove('hidden');
      this.showToast('📲 iPad Simulator Viewport (820px Tablet View)');
    } else if (mode === 'desktop') {
      if (floatingDock) floatingDock.classList.add('hidden');
      this.showToast('💻 Desktop Viewport (12-Column Master Grid)');
    } else {
      // Auto responsive
      if (floatingDock) floatingDock.classList.add('hidden');
      this.showToast('⚡ Auto Responsive Mode (Adapts to Window Width)');
    }
  }

  // ---------------------------------------------------------------------------
  // Tesla Sound FX Toggle
  // ---------------------------------------------------------------------------
  toggleSound() {
    if (!window.soundFX) return;
    const isMuted = window.soundFX.toggleMute();

    const topIcon = document.getElementById('top-sound-icon');
    if (topIcon) {
      if (isMuted) {
        topIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>`;
        this.showToast('🔇 Audio FX Muted');
      } else {
        topIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;
        window.soundFX.playSuccess();
        this.showToast('🔊 Tesla UI Audio FX Enabled');
      }
    }
  }

  // ---------------------------------------------------------------------------
  // AI Smart Assistant Modal Controls
  // ---------------------------------------------------------------------------
  openAiAssistant() {
    if (window.soundFX) window.soundFX.playAiBeep();
    const modal = document.getElementById('modal-ai');
    if (modal) modal.classList.add('open');
  }

  closeAiAssistant() {
    if (window.soundFX) window.soundFX.playTap();
    const modal = document.getElementById('modal-ai');
    if (modal) modal.classList.remove('open');
  }

  // ---------------------------------------------------------------------------
  // Toast Notifications
  // ---------------------------------------------------------------------------
  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }
}

// Initialize Application Controller and Audio Engine
window.soundFX = new SoundFX();
window.app = new VOZXAppController();

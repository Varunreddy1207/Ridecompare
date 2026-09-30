// =============================================================================
// VOZX RideCompare — Responsive Master Application Controller
// Seamless screen routing, sound FX, and multi-device responsive interaction
// =============================================================================

class RideCompareApp {
  constructor() {
    this.currentScreen = 'screen-splash';
    this.currentTab = 'home';
    this.selectedDestination = 'Sanjay Ghodawat University, Ichalkaranji';
    this.toastTimeout = null;
    this.selectedHistoryTripId = 1;

    // Master History Trips Dataset (Exact Match to media_1790658953621.png)
    this.historyTrips = [
      {
        id: 1,
        provider: 'Ola',
        vehicle: 'Bike',
        providerCategory: 'ola',
        badgeClass: 'bg-white text-black',
        origin: 'Sanjay Ghodawat University',
        destination: 'Home',
        dateTime: '12 Sep, 07:45 PM',
        fare: 96,
        distance: '6.4 km',
        duration: '18 mins',
        driver: 'Ramesh K.',
        rating: '★ 4.9 (420 rides)',
        plate: 'MH 09 CZ 4821',
        payment: 'Paid via UPI (GPay)',
        baseFare: '₹45.00',
        distFare: '₹41.00',
        taxFare: '₹10.00'
      },
      {
        id: 2,
        provider: 'Rapido',
        vehicle: 'Bike',
        providerCategory: 'rapido',
        badgeClass: 'bg-[#FACC15] text-slate-900',
        origin: 'College',
        destination: 'City Center',
        dateTime: '10 Sep, 06:20 PM',
        fare: 82,
        distance: '5.1 km',
        duration: '15 mins',
        driver: 'Suresh Patil',
        rating: '★ 4.8 (310 rides)',
        plate: 'MH 09 BK 9912',
        payment: 'Paid via Paytm Wallet',
        baseFare: '₹35.00',
        distFare: '₹39.00',
        taxFare: '₹8.00'
      },
      {
        id: 3,
        provider: 'Uber',
        vehicle: 'Auto',
        providerCategory: 'uber',
        badgeClass: 'bg-black text-white border border-slate-700',
        origin: 'Railway Station',
        destination: 'College',
        dateTime: '8 Sep, 05:10 PM',
        fare: 138,
        distance: '8.2 km',
        duration: '26 mins',
        driver: 'Mahesh Jadhav',
        rating: '★ 4.95 (560 rides)',
        plate: 'MH 09 EA 3301',
        payment: 'Paid via Cash',
        baseFare: '₹50.00',
        distFare: '₹74.00',
        taxFare: '₹14.00'
      },
      {
        id: 4,
        provider: 'Ola',
        vehicle: 'Car',
        providerCategory: 'ola',
        badgeClass: 'bg-white text-black',
        origin: 'Airport',
        destination: 'Home',
        dateTime: '5 Sep, 09:30 AM',
        fare: 165,
        distance: '11.5 km',
        duration: '32 mins',
        driver: 'Amol Shinde',
        rating: '★ 4.85 (890 rides)',
        plate: 'MH 09 DX 7744',
        payment: 'Paid via Credit Card',
        baseFare: '₹70.00',
        distFare: '₹78.00',
        taxFare: '₹17.00'
      },
      {
        id: 5,
        provider: 'Rapido',
        vehicle: 'Bike',
        providerCategory: 'rapido',
        badgeClass: 'bg-[#FACC15] text-slate-900',
        origin: 'College',
        destination: 'Market',
        dateTime: '2 Sep, 08:15 PM',
        fare: 74,
        distance: '4.3 km',
        duration: '12 mins',
        driver: 'Deepak More',
        rating: '★ 4.78 (185 rides)',
        plate: 'MH 09 AR 6205',
        payment: 'Paid via UPI (PhonePe)',
        baseFare: '₹35.00',
        distFare: '₹32.00',
        taxFare: '₹7.00'
      }
    ];

    this.init();
  }

  init() {
    this.initTheme();
    document.addEventListener('DOMContentLoaded', () => {
      this.initTheme();
      // Check initial hash routing (#home, #history, or splash)
      this.handleHashRoute();

      // Handle browser back/forward buttons
      window.addEventListener('hashchange', () => {
        this.handleHashRoute();
      });

      // Responsive Navigation Enforcement
      this.enforceResponsiveNav();
      window.addEventListener('resize', () => this.enforceResponsiveNav());

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
          this.hideResultsPanel();
          this.closeHistoryModal();
        }
      });
    });
  }

  // =========================================================================
  // THEME MANAGEMENT (Light Mode White Background by Default + Dark Mode Toggle)
  // =========================================================================
  initTheme() {
    const savedTheme = localStorage.getItem('ridecompare_theme');
    // Default to 'light' (white background) unless explicitly saved as 'dark'
    const theme = (savedTheme === 'dark') ? 'dark' : 'light';
    this.applyTheme(theme, false);
  }

  toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    this.applyTheme(newTheme, true);
  }

  applyTheme(theme, showFeedback = false) {
    const metaTheme = document.getElementById('meta-theme-color');
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('ridecompare_theme', 'dark');
      if (metaTheme) metaTheme.setAttribute('content', '#020617');

      // Update button accessibility labels
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.setAttribute('title', 'Switch to Light Mode (☀️)');
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      });

      if (showFeedback) {
        if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
        this.showToast('Dark Mode Activated 🌙');
      }
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.classList.add('theme-light');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('ridecompare_theme', 'light');
      if (metaTheme) metaTheme.setAttribute('content', '#FFFFFF');

      // Update button accessibility labels
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.setAttribute('title', 'Switch to Dark Mode (🌙)');
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      });

      if (showFeedback) {
        if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
        this.showToast('Light Mode Activated ☀️');
      }
    }
    this.updateTopbarActionButtons(theme === 'dark');
    this.updateConfirmedModalTheme(theme === 'dark');
    this.updateHistoryReceiptTheme(theme === 'dark');
  }

  // Ensure "Back to Home" and Notification Bell buttons have blue background in light mode
  updateTopbarActionButtons(isDark = false) {
    const isDarkMode = isDark || document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const bellBtn = document.getElementById('btn-notification-bell') || document.querySelector('.btn-notification-bell') || document.querySelector('button[onclick*="No new notifications"]');
    const backBtns = document.querySelectorAll('.btn-back-home, button[onclick*="switchTab(\'home\')"]:not(.sidebar-nav-item):not(.mob-nav-btn)');

    if (isDarkMode) {
      if (bellBtn) {
        bellBtn.style.removeProperty('background');
        bellBtn.style.removeProperty('background-color');
        bellBtn.style.removeProperty('border-color');
        bellBtn.style.removeProperty('color');
        bellBtn.style.removeProperty('box-shadow');
        const dot = bellBtn.querySelector('.notification-dot') || bellBtn.querySelector('span');
        if (dot) {
          dot.style.removeProperty('background-color');
          dot.style.removeProperty('box-shadow');
        }
        const svg = bellBtn.querySelector('svg');
        if (svg) {
          svg.style.removeProperty('color');
          svg.style.removeProperty('stroke');
        }
      }
      backBtns.forEach(btn => {
        btn.style.removeProperty('background');
        btn.style.removeProperty('background-color');
        btn.style.removeProperty('border-color');
        btn.style.removeProperty('color');
        btn.style.removeProperty('box-shadow');
        btn.querySelectorAll('*').forEach(child => {
          child.style.removeProperty('color');
          child.style.removeProperty('stroke');
        });
      });
    } else {
      if (bellBtn) {
        bellBtn.style.setProperty('background', 'linear-gradient(135deg, #0073FF 0%, #0060E6 100%)', 'important');
        bellBtn.style.setProperty('border-color', '#0060E6', 'important');
        bellBtn.style.setProperty('color', '#FFFFFF', 'important');
        bellBtn.style.setProperty('box-shadow', '0 4px 14px rgba(0, 115, 255, 0.35)', 'important');
        const dot = bellBtn.querySelector('.notification-dot') || bellBtn.querySelector('span');
        if (dot) {
          dot.style.setProperty('background-color', '#FFFFFF', 'important');
          dot.style.setProperty('box-shadow', '0 0 6px rgba(255, 255, 255, 0.9)', 'important');
        }
        const svg = bellBtn.querySelector('svg');
        if (svg) {
          svg.style.setProperty('color', '#FFFFFF', 'important');
          svg.style.setProperty('stroke', '#FFFFFF', 'important');
        }
      }
      backBtns.forEach(btn => {
        btn.style.setProperty('background', 'linear-gradient(135deg, #0073FF 0%, #0060E6 100%)', 'important');
        btn.style.setProperty('border-color', '#0060E6', 'important');
        btn.style.setProperty('color', '#FFFFFF', 'important');
        btn.style.setProperty('box-shadow', '0 4px 14px rgba(0, 115, 255, 0.35)', 'important');
        btn.querySelectorAll('*').forEach(child => {
          child.style.setProperty('color', '#FFFFFF', 'important');
          if (child.tagName.toLowerCase() === 'svg' || child.tagName.toLowerCase() === 'path') {
            child.style.setProperty('stroke', '#FFFFFF', 'important');
          }
        });
      });
    }
  }

  // Ensure Ride Confirmed modal has pure white background in light mode
  
  // Ensure History Receipt and Modals have pure white theme in light mode
  updateHistoryReceiptTheme(isDark = false) {
    // Always guarantee Uber icon box text is pure white
    document.querySelectorAll('.provider-box-uber, .provider-box-uber *').forEach(el => {
      el.style.setProperty('color', '#FFFFFF', 'important');
    });

    const isDarkMode = isDark || document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const panel = document.getElementById('desktop-receipt-panel');
    const modalPanel = document.querySelector('#history-detail-modal .history-modal-panel');

    if (isDarkMode) {
      if (panel) {
        panel.style.removeProperty('background');
        panel.style.removeProperty('background-color');
        panel.style.removeProperty('border-color');
      }
      if (modalPanel) {
        modalPanel.style.removeProperty('background');
        modalPanel.style.removeProperty('background-color');
        modalPanel.style.removeProperty('border-color');
      }
    } else {
      if (panel) {
        panel.style.setProperty('background', '#FFFFFF', 'important');
        panel.style.setProperty('background-color', '#FFFFFF', 'important');
        panel.style.setProperty('border-color', '#E2E8F0', 'important');
      }
      if (modalPanel) {
        modalPanel.style.setProperty('background', '#FFFFFF', 'important');
        modalPanel.style.setProperty('background-color', '#FFFFFF', 'important');
        modalPanel.style.setProperty('border-color', '#E2E8F0', 'important');
      }
    }
  }

  updateConfirmedModalTheme(isDark = false) {
    const isDarkMode = isDark || document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const modalPanel = document.querySelector('#booking-confirmed-modal .confirmed-modal-panel');
    if (!modalPanel) return;
    if (isDarkMode) {
      modalPanel.style.removeProperty('background');
      modalPanel.style.removeProperty('background-color');
      modalPanel.style.removeProperty('border-color');
      modalPanel.style.removeProperty('color');
    } else {
      modalPanel.style.setProperty('background', '#FFFFFF', 'important');
      modalPanel.style.setProperty('background-color', '#FFFFFF', 'important');
      modalPanel.style.setProperty('border-color', '#E2E8F0', 'important');
      modalPanel.style.setProperty('color', '#0F172A', 'important');
    }
  }

  handleHashRoute() {
    if (window.location.hash === '#booking') {
      this.navigateTo('screen-booking', false);
    } else if (window.location.hash === '#history') {
      this.currentTab = 'history';
      this.navigateTo('screen-history', false);
      this.updateActiveNavs('history');
      this.selectHistoryTrip(this.selectedHistoryTripId || 1, false);
    } else if (window.location.hash === '#profile') {
      this.currentTab = 'profile';
      this.navigateTo('screen-profile', false);
      this.updateActiveNavs('profile');
    } else if (window.location.hash === '#home') {
      this.currentTab = 'home';
      this.navigateTo('screen-home', false);
      this.updateActiveNavs('home');
    } else {
      this.navigateTo('screen-splash', false);
    }
  }

  // Strict Responsive Navigation Display Enforcement across Mobile, Tablet, Desktop
  enforceResponsiveNav() {
    const bottomNav = document.getElementById('app-bottom-nav') || document.querySelector('.app-bottom-nav');
    const legacyMobNavs = document.querySelectorAll('#mobile-bottom-nav, .mobile-bottom-nav');
    const legacyTabDocks = document.querySelectorAll('#tablet-nav-dock, .tablet-nav-dock');
    const deskSidebars = document.querySelectorAll('#desktop-sidebar, .desktop-sidebar');
    const deskTopbars = document.querySelectorAll('.desktop-topbar');
    const width = window.innerWidth;

    // When on Get Started (Splash) Screen OR Booking Confirmation Screen
    if (this.currentScreen === 'screen-splash' || this.currentScreen === 'screen-booking') {
      if (bottomNav) bottomNav.style.setProperty('display', 'none', 'important');
      legacyMobNavs.forEach(el => el.style.setProperty('display', 'none', 'important'));
      legacyTabDocks.forEach(el => el.style.setProperty('display', 'none', 'important'));
      if (this.currentScreen === 'screen-splash') {
        deskSidebars.forEach(el => el.style.setProperty('display', 'none', 'important'));
        deskTopbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
      }
      return;
    }

    if (width >= 1024) {
      // Desktop: Sidebar + Topbar ONLY
      if (bottomNav) bottomNav.style.setProperty('display', 'none', 'important');
      legacyMobNavs.forEach(el => el.style.setProperty('display', 'none', 'important'));
      legacyTabDocks.forEach(el => el.style.setProperty('display', 'none', 'important'));
      deskSidebars.forEach(el => el.style.setProperty('display', 'flex', 'important'));
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'flex', 'important'));
    } else {
      // Mobile and Tablet: Unified Fixed Bottom Navigation Bar (< 1024px)
      if (bottomNav) bottomNav.style.setProperty('display', 'flex', 'important');
      legacyMobNavs.forEach(el => el.style.setProperty('display', 'none', 'important'));
      legacyTabDocks.forEach(el => el.style.setProperty('display', 'none', 'important'));
      deskSidebars.forEach(el => el.style.setProperty('display', 'none', 'important'));
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
    }

    this.updateActiveNavs(this.currentTab);
  }

  // Update active states across all navigation items
  updateActiveNavs(tab) {
    const mobBtns = document.querySelectorAll('.mob-nav-btn');
    mobBtns.forEach(btn => {
      const match = btn.getAttribute('data-tab') === tab || btn.id === `mob-nav-${tab}`;
      btn.classList.toggle('active', !!match);
    });

    const deskBtns = document.querySelectorAll('.sidebar-nav-item');
    deskBtns.forEach(btn => {
      const match = btn.getAttribute('data-tab') === tab || btn.id === `desk-nav-${tab}`;
      btn.classList.toggle('active', !!match);
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
      this.enforceResponsiveNav();
      this.updateTopbarActionButtons();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Selecting a Recent Search Item
  selectRecent(name, city) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }

    this.selectedDestination = `${name}, ${city}`;

    // Update Drop Location Card text on Home Screen
    const dropText = document.getElementById('home-drop-text');
    if (dropText) {
      dropText.textContent = name;
      dropText.classList.remove('placeholder');
      dropText.classList.add('text-white');
    }

    // Update Map Title
    const mapTitle = document.getElementById('map-route-title');
    const mapSub = document.getElementById('map-route-sub');
    if (mapTitle) {
      mapTitle.textContent = `Current GPS ➔ ${name}`;
    }
    if (mapSub) {
      mapSub.textContent = `Destination: ${city} • Live comparison updated`;
    }

    const panel = document.getElementById('home-results-panel');
    if (panel && panel.classList.contains('results-panel-visible')) {
      this.showToast(`Updated destination: ${name} 📍`);
    } else {
      this.showToast(`Selected: ${name} 📍`);
    }
  }

  // Primary "Search Rides" Click Handler — Reveals results panel with animation across all screen sizes
  onSearchRides() {
    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }

    const dropText = document.getElementById('home-drop-text');
    if (!dropText || dropText.classList.contains('placeholder')) {
      this.selectRecent('Sanjay Ghodawat University', 'Ichalkaranji');
    }

    this.showResultsPanel();
  }

  // Smooth Reveal of Results Panel (Map + comparison cards)
  showResultsPanel() {
    const panel = document.getElementById('home-results-panel');
    const searchContainer = document.getElementById('home-search-container');
    if (!panel) return;

    // Reset animation state to ensure it plays freshly
    panel.classList.remove('results-panel-hidden');
    panel.classList.remove('results-panel-visible');
    void panel.offsetWidth; // Trigger DOM reflow
    panel.classList.add('results-panel-visible');

    // On Desktop & Tablet: adjust search container to left column
    if (searchContainer) {
      searchContainer.classList.remove('max-w-xl', 'mx-auto', 'lg:col-span-12');
      searchContainer.classList.add('lg:col-span-4');
    }

    // On mobile (< 768px): scroll results into view smoothly
    if (window.innerWidth < 768) {
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    this.showToast('Live ride fares found! Lowest: ₹45 with Rapido ⚡');
  }

  // Hide Results Panel and return to clean search form
  hideResultsPanel() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }

    const panel = document.getElementById('home-results-panel');
    const searchContainer = document.getElementById('home-search-container');
    const moreSection = document.getElementById('more-rides-section');
    const toggleText = document.getElementById('more-toggle-text');
    if (moreSection) {
      moreSection.classList.add('hidden');
      moreSection.classList.remove('flex');
      if (toggleText) toggleText.textContent = 'More ▾';
    }

    if (!panel) return;

    panel.classList.remove('results-panel-visible');
    panel.classList.add('results-panel-hidden');

    if (searchContainer) {
      searchContainer.classList.remove('lg:col-span-4', 'lg:col-span-5');
      searchContainer.classList.add('max-w-xl', 'mx-auto');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showToast('Search options updated 📍');
  }

  // Toggle More Ride Options Section
  toggleMoreRides() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    const section = document.getElementById('more-rides-section');
    const toggleText = document.getElementById('more-toggle-text');
    if (!section) return;

    if (section.classList.contains('hidden')) {
      section.classList.remove('hidden');
      section.classList.add('flex');
      if (toggleText) toggleText.textContent = 'Hide ▴';
      this.showToast('Showing 6 more ride options! 🛺🚗⚡');
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } else {
      section.classList.add('hidden');
      section.classList.remove('flex');
      if (toggleText) toggleText.textContent = 'More ▾';
    }
  }

  // Filter Rides by Category (All, Cabs, Autos, Bikes, EV)
  filterRideCategory(category) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }

    // Update active pill
    const pills = document.querySelectorAll('.ride-filter-pill');
    pills.forEach(p => p.classList.remove('active'));
    const activePill = document.getElementById(`filter-pill-${category}`);
    if (activePill) activePill.classList.add('active');

    const moreCard = document.getElementById('card-more-options');
    const moreSection = document.getElementById('more-rides-section');
    const toggleText = document.getElementById('more-toggle-text');

    if (category !== 'all') {
      if (moreSection) {
        moreSection.classList.remove('hidden');
        moreSection.classList.add('flex');
        if (toggleText) toggleText.textContent = 'Hide ▴';
      }
      if (moreCard) moreCard.style.display = 'none';
    } else {
      if (moreCard) moreCard.style.display = '';
    }

    // Filter items
    const items = document.querySelectorAll('.ride-item-card');
    items.forEach(card => {
      if (card.id === 'card-more-options') return;
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    if (category !== 'all') {
      this.showToast(`Showing ${category.toUpperCase()} rides 🚗`);
    } else {
      this.showToast('Showing all 9 ride options ⚡');
    }
  }

  // Sort Rides by Price or ETA
  sortRides(criteria) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    const section = document.getElementById('more-rides-section');
    if (section && section.classList.contains('hidden')) {
      section.classList.remove('hidden');
      section.classList.add('flex');
      const toggleText = document.getElementById('more-toggle-text');
      if (toggleText) toggleText.textContent = 'Hide ▴';
    }

    const btnPrice = document.getElementById('sort-btn-price');
    const btnEta = document.getElementById('sort-btn-eta');
    if (btnPrice && btnEta) {
      if (criteria === 'price') {
        btnPrice.classList.add('bg-blue-600', 'text-white', 'border-blue-400');
        btnPrice.classList.remove('bg-slate-800', 'text-slate-200', 'border-slate-700');
        btnEta.classList.remove('bg-blue-600', 'text-white', 'border-blue-400');
        btnEta.classList.add('bg-slate-800', 'text-slate-200', 'border-slate-700');
        this.showToast('Sorted by Lowest Price: Rapido Bike at ₹45 🏷️');
      } else {
        btnEta.classList.add('bg-blue-600', 'text-white', 'border-blue-400');
        btnEta.classList.remove('bg-slate-800', 'text-slate-200', 'border-slate-700');
        btnPrice.classList.remove('bg-blue-600', 'text-white', 'border-blue-400');
        btnPrice.classList.add('bg-slate-800', 'text-slate-200', 'border-slate-700');
        this.showToast('Sorted by Fastest Arrival: Rapido Auto in 2 mins ⚡');
      }
    }
  }

  // Provider Filter Selection
  selectProvider(providerName) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.showToast(`Filtered: ${providerName} rides`);
  }

  // Booking a Ride - Opens the requested Ride Details & Confirmation UI
  bookRide(provider, fare) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.openBookingScreen(provider, fare);
  }

  // Open Booking Confirmation Screen (Matches media_1790660374330.png & media_1790660393523.png)
  openBookingScreen(provider, fare) {
    const provLower = (provider || '').toLowerCase();
    let pName = 'Rapido';
    let pVehicle = 'Bike';
    let pFare = fare || 78;
    let pEta = '12 min';
    let pDistance = '4.2 km';
    let pAboutTitle = 'About Rapido';
    let pAboutTagline = 'Fast • Affordable • Bike Taxi';
    let pRating = '4.2 (1M+ reviews)';
    let pBoxClass = 'provider-box-rapido';
    let pIconSvg = `
      <svg class="w-7 h-7 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 12c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm0 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-14-4.5c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm0 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6.5-6.5h3.25l1.62 3.25c.34-.16.72-.25 1.13-.25 1.65 0 3 1.35 3 3h-2.1c-.4-1.18-1.52-2-2.9-2-.41 0-.8.09-1.15.25l-1.35-2.7V17h-2v-4.5l-2.6-3.9H5v-2h4.5l2 3z"/>
      </svg>
    `;

    if (provLower.includes('ola')) {
      pName = 'Ola';
      pVehicle = provLower.includes('auto') ? 'Auto' : 'Car';
      pFare = fare || 142;
      pEta = '18 min';
      pAboutTitle = 'About Ola';
      pAboutTagline = 'Reliable • Safe • Comfortable';
      pRating = '4.1 (2M+ reviews)';
      pBoxClass = 'provider-box-ola';
      pIconSvg = `
        <div class="ola-ring">
          <div class="ola-dot"></div>
        </div>
      `;
    } else if (provLower.includes('uber')) {
      pName = 'Uber';
      pVehicle = provLower.includes('auto') ? 'Auto' : (provLower.includes('premier') ? 'Premier' : 'Go');
      pFare = fare || (provLower.includes('auto') ? 85 : 120);
      pEta = '10 min';
      pAboutTitle = 'About Uber';
      pAboutTagline = 'Reliable • Door-to-Door • Global Standard';
      pRating = '4.7 (5M+ reviews)';
      pBoxClass = 'provider-box-uber';
      pIconSvg = `<span class="text-white font-black text-xs tracking-tight" style="color: #FFFFFF !important;">Uber</span>`;
    } else if (provLower.includes('blusmart')) {
      pName = 'BluSmart';
      pVehicle = 'EV Sedan';
      pFare = fare || 95;
      pEta = '8 min';
      pAboutTitle = 'About BluSmart';
      pAboutTagline = '100% Electric • Zero Surge • Clean Cabs';
      pRating = '4.9 (500k+ reviews)';
      pBoxClass = 'provider-box-blusmart';
      pIconSvg = `
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      `;
    }

    // Populate Booking UI Elements
    const iconBox = document.getElementById('booking-provider-icon-box');
    if (iconBox) {
      iconBox.className = pBoxClass;
      iconBox.innerHTML = pIconSvg;
    }
    const nameEl = document.getElementById('booking-provider-name');
    if (nameEl) nameEl.textContent = pName;
    const vehicleEl = document.getElementById('booking-vehicle-type');
    if (vehicleEl) vehicleEl.textContent = pVehicle;
    const fareEl = document.getElementById('booking-fare');
    if (fareEl) fareEl.textContent = `₹${pFare}`;
    const etaEl = document.getElementById('booking-eta');
    if (etaEl) etaEl.textContent = pEta;

    const pickupEl = document.getElementById('booking-pickup-location');
    if (pickupEl) pickupEl.textContent = 'Your Location';
    const dropEl = document.getElementById('booking-drop-location');
    if (dropEl) dropEl.textContent = this.selectedDestination || 'Sanjay Ghodawat University';
    const distEl = document.getElementById('booking-distance');
    if (distEl) distEl.textContent = pDistance;
    const timeEl = document.getElementById('booking-estimated-time');
    if (timeEl) timeEl.textContent = pEta;

    const aboutTitleEl = document.getElementById('booking-about-title');
    if (aboutTitleEl) aboutTitleEl.textContent = pAboutTitle;
    const aboutTagEl = document.getElementById('booking-about-tagline');
    if (aboutTagEl) aboutTagEl.textContent = pAboutTagline;
    const aboutRatingEl = document.getElementById('booking-about-rating');
    if (aboutRatingEl) aboutRatingEl.textContent = pRating;

    const mapEta = document.getElementById('booking-map-eta');
    if (mapEta) mapEta.textContent = `Fastest Route • ${pEta} (${pDistance})`;

    // Reset Book Now CTA state
    const btnBook = document.getElementById('btn-confirm-book-now');
    if (btnBook) {
      btnBook.innerHTML = '<span>Book Now</span>';
      btnBook.disabled = false;
      btnBook.className = 'w-full py-4 rounded-2xl bg-[#0073FF] hover:bg-[#0062dd] text-white font-bold text-base tracking-wide shadow-[0_6px_25px_rgba(0,115,255,0.45)] transition-all active:scale-[0.98] flex items-center justify-center gap-2';
    }

    // Navigate to Booking Screen
    this.navigateTo('screen-booking', false);
    window.location.hash = '#booking';
  }

  // Close Booking Screen and return to Home comparison
  closeBookingScreen() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.navigateTo('screen-home', false);
    window.location.hash = '#home';
    this.showResultsPanel();
  }

  // Confirm Booking Action on Blue Button
  confirmBooking() {
    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }
    const btn = document.getElementById('btn-confirm-book-now');
    if (btn) {
      btn.innerHTML = `
        <svg class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Confirming with Driver...</span>
      `;
      btn.disabled = true;
    }

    setTimeout(() => {
      const modal = document.getElementById('booking-confirmed-modal');
      if (modal) {
        modal.classList.add('show');
        this.updateConfirmedModalTheme();
      }
      this.showToast('Ride Confirmed! Pilot is on the way 🚗⚡');
    }, 700);
  }

  // Close Confirmed Modal and return to Home
  closeConfirmedModal() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    const modal = document.getElementById('booking-confirmed-modal');
    if (modal) {
      modal.classList.remove('show');
    }
    this.switchTab('home');
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
    this.updateActiveNavs(tab);

    if (tab === 'home') {
      this.navigateTo('screen-home', false);
      window.location.hash = '#home';
    } else if (tab === 'history') {
      this.navigateTo('screen-history', false);
      window.location.hash = '#history';
      this.selectHistoryTrip(this.selectedHistoryTripId || 1, false);
    } else if (tab === 'compare') {
      this.navigateTo('screen-home', false);
      window.location.hash = '#home';
      this.showResultsPanel();
    } else if (tab === 'profile') {
      this.navigateTo('screen-profile', false);
      window.location.hash = '#profile';
    } else {
      this.showToast(`${tab.charAt(0).toUpperCase() + tab.slice(1)} view selected`);
    }
  }

  // Open Profile Screen
  openProfile() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.switchTab('profile');
  }

  // Log Out Action
  logout() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.showToast('Logged out of Varun Reddy successfully 👋');
    setTimeout(() => {
      this.navigateTo('screen-splash', false);
      window.location.hash = '#';
    }, 350);
  }

  // Select History Trip (syncs Desktop Receipt Panel and Mobile/Tablet Modal)
  selectHistoryTrip(id, openMobileModal = true) {
    const trip = this.historyTrips.find(t => t.id == id);
    if (!trip) return;
    this.selectedHistoryTripId = parseInt(id, 10) || 1;

    if (window.soundFX) {
      window.soundFX.playTap();
    }

    // Update active highlight on history cards
    const cards = document.querySelectorAll('.history-item');
    cards.forEach(card => {
      const cardId = parseInt(card.getAttribute('data-id'), 10);
      card.classList.toggle('selected-trip', cardId == id);
    });

    // 1. Update Desktop Receipt Panel
    this.updateHistoryReceiptTheme();
    const recBadge = document.getElementById('receipt-provider-badge');
    if (recBadge) {
      recBadge.textContent = `${trip.provider} • ${trip.vehicle}`;
      recBadge.className = `px-2.5 py-1 rounded-full text-xs font-bold ${trip.badgeClass}`;
    }
    const recDatetime = document.getElementById('receipt-datetime');
    if (recDatetime) recDatetime.textContent = trip.dateTime;
    const recTotal = document.getElementById('receipt-total-fare');
    if (recTotal) recTotal.textContent = `₹${trip.fare}`;
    const recOrigin = document.getElementById('receipt-origin');
    if (recOrigin) recOrigin.textContent = trip.origin;
    const recDest = document.getElementById('receipt-destination');
    if (recDest) recDest.textContent = trip.destination;
    const recDist = document.getElementById('receipt-distance');
    if (recDist) recDist.textContent = trip.distance;
    const recDur = document.getElementById('receipt-duration');
    if (recDur) recDur.textContent = trip.duration;
    const recDriver = document.getElementById('receipt-driver-name');
    if (recDriver) recDriver.textContent = trip.driver;
    const recRating = document.getElementById('receipt-driver-rating');
    if (recRating) recRating.textContent = trip.rating;
    const recPlate = document.getElementById('receipt-plate');
    if (recPlate) recPlate.textContent = trip.plate;
    const recPay = document.getElementById('receipt-payment-method');
    if (recPay) recPay.textContent = trip.payment;
    const recBase = document.getElementById('receipt-base-fare');
    if (recBase) recBase.textContent = trip.baseFare;
    const recDistFare = document.getElementById('receipt-dist-fare');
    if (recDistFare) recDistFare.textContent = trip.distFare;
    const recTax = document.getElementById('receipt-tax-fare');
    if (recTax) recTax.textContent = trip.taxFare;
    const recFinal = document.getElementById('receipt-final-fare');
    if (recFinal) recFinal.textContent = `₹${trip.fare}.00`;

    // 2. Open Mobile / Tablet Slide-up Modal if on smaller screens
    if (openMobileModal && window.innerWidth < 1024) {
      const modal = document.getElementById('history-detail-modal');
      const modBadge = document.getElementById('modal-provider-badge');
      if (modBadge) {
        modBadge.textContent = `${trip.provider} • ${trip.vehicle}`;
        modBadge.className = `px-2.5 py-1 rounded-full text-xs font-bold ${trip.badgeClass}`;
      }
      const modDatetime = document.getElementById('modal-datetime');
      if (modDatetime) modDatetime.textContent = trip.dateTime;
      const modFare = document.getElementById('modal-fare');
      if (modFare) modFare.textContent = `₹${trip.fare}`;
      const modOrigin = document.getElementById('modal-origin');
      if (modOrigin) modOrigin.textContent = trip.origin;
      const modDest = document.getElementById('modal-destination');
      if (modDest) modDest.textContent = trip.destination;
      const modDist = document.getElementById('modal-distance');
      if (modDist) modDist.textContent = trip.distance;
      const modDur = document.getElementById('modal-duration');
      if (modDur) modDur.textContent = trip.duration;
      const modDriver = document.getElementById('modal-driver');
      if (modDriver) modDriver.textContent = trip.driver;
      const modRating = document.getElementById('modal-rating');
      if (modRating) modRating.innerHTML = `${trip.rating} • Plate: <span id="modal-plate" class="text-slate-200 font-mono">${trip.plate}</span>`;
      const modPay = document.getElementById('modal-payment');
      if (modPay) modPay.textContent = trip.payment;

      if (modal) {
        modal.classList.add('show');
      }
    }
  }

  // Close Mobile/Tablet History Modal
  closeHistoryModal() {
    const modal = document.getElementById('history-detail-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  // Filter History Cards by Provider (all, ola, rapido, uber)
  filterHistory(provider) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }

    // Update active filter pills
    const pills = document.querySelectorAll('.history-filter-pill');
    pills.forEach(pill => {
      const f = pill.getAttribute('data-filter');
      pill.classList.toggle('active', f === provider);
    });

    // Filter cards
    const cards = document.querySelectorAll('.history-item');
    let visibleCount = 0;
    cards.forEach(card => {
      const cardProvider = card.getAttribute('data-provider');
      if (provider === 'all' || cardProvider === provider) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const label = provider === 'all' ? 'All Rides' : provider.toUpperCase();
    this.showToast(`Showing ${visibleCount} ${label} trips`);
  }

  // Re-Book Current Trip (Pre-fills Home inputs and opens Live Compare rates)
  rebookCurrentTrip() {
    const trip = this.historyTrips.find(t => t.id === this.selectedHistoryTripId) || this.historyTrips[0];
    this.closeHistoryModal();

    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }

    // Set pickup & destination
    this.selectedDestination = trip.destination;
    const destInput = document.getElementById('search-destination-input');
    if (destInput) destInput.value = trip.destination;

    const deskSearchInput = document.getElementById('desktop-search-input');
    if (deskSearchInput) deskSearchInput.value = trip.destination;

    // Switch to Home screen and open results panel
    this.switchTab('home');
    setTimeout(() => {
      this.showResultsPanel();
      this.showToast(`Re-booking: ${trip.origin} ➔ ${trip.destination} ⚡`);
    }, 150);
  }

  // Export History as CSV
  exportHistory() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    const header = 'Date,Provider,Vehicle,Pickup,Dropoff,Fare,Distance,Duration,Driver,Plate\n';
    const rows = this.historyTrips.map(t => 
      `"${t.dateTime}","${t.provider}","${t.vehicle}","${t.origin}","${t.destination}","₹${t.fare}","${t.distance}","${t.duration}","${t.driver}","${t.plate}"`
    ).join('\n');
    const csvBlob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RideCompare_History.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('Ride History CSV exported successfully! 📄');
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

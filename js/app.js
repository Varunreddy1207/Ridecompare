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
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Check initial hash routing (#home or default splash)
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
        }
      });
    });
  }

  handleHashRoute() {
    if (window.location.hash === '#home') {
      this.navigateTo('screen-home', false);
    } else {
      this.navigateTo('screen-splash', false);
    }
  }

  // Strict Responsive Navigation Display Enforcement
  enforceResponsiveNav() {
    // 1. Remove any stray More buttons from DOM permanently
    const moreBtn1 = document.getElementById('mob-nav-more');
    if (moreBtn1) moreBtn1.remove();
    const moreBtn2 = document.getElementById('tab-btn-more');
    if (moreBtn2) moreBtn2.remove();

    const mobNav = document.getElementById('mobile-bottom-nav');
    const tabDock = document.getElementById('tablet-nav-dock');
    const deskSidebar = document.getElementById('desktop-sidebar');
    const deskTopbars = document.querySelectorAll('.desktop-topbar');
    const width = window.innerWidth;

    // When on Get Started (Splash) Screen
    if (this.currentScreen === 'screen-splash') {
      if (mobNav) mobNav.style.setProperty('display', 'none', 'important');
      if (tabDock) tabDock.style.setProperty('display', 'none', 'important');
      if (deskSidebar) deskSidebar.style.setProperty('display', 'none', 'important');
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
      return;
    }

    // When on Home Screen
    if (width >= 1024) {
      // Desktop: Sidebar + Topbar ONLY
      if (mobNav) mobNav.style.setProperty('display', 'none', 'important');
      if (tabDock) tabDock.style.setProperty('display', 'none', 'important');
      if (deskSidebar) deskSidebar.style.setProperty('display', 'flex', 'important');
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'flex', 'important'));
      
      const deskBtns = document.querySelectorAll('.sidebar-nav-item');
      deskBtns.forEach(btn => btn.classList.remove('active'));
      const activeDesk = document.getElementById('desk-nav-home');
      if (activeDesk) activeDesk.classList.add('active');
    } else if (width >= 768) {
      // Tablet: Floating dock ONLY (NEVER mobile bottom nav)
      if (mobNav) mobNav.style.setProperty('display', 'none', 'important');
      if (tabDock) tabDock.style.setProperty('display', 'flex', 'important');
      if (deskSidebar) deskSidebar.style.setProperty('display', 'none', 'important');
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
    } else {
      // Mobile: Mobile bottom nav ONLY
      if (mobNav) mobNav.style.setProperty('display', 'flex', 'important');
      if (tabDock) tabDock.style.setProperty('display', 'none', 'important');
      if (deskSidebar) deskSidebar.style.setProperty('display', 'none', 'important');
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
    }
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

  // Smooth Reveal of Results Panel (Map + 3 comparison cards)
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
      searchContainer.classList.remove('max-w-xl', 'mx-auto');
      searchContainer.classList.add('lg:col-span-5');
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
      searchContainer.classList.remove('lg:col-span-5');
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

    // Filter items
    const items = document.querySelectorAll('.ride-item-card');
    items.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category || card.id === 'card-more-options') {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    if (category !== 'all') {
      const section = document.getElementById('more-rides-section');
      if (section && section.classList.contains('hidden') && (category === 'autos' || category === 'ev')) {
        section.classList.remove('hidden');
        section.classList.add('flex');
        const toggleText = document.getElementById('more-toggle-text');
        if (toggleText) toggleText.textContent = 'Hide ▴';
      }
      this.showToast(`Filtered by ${category.toUpperCase()} 🚗`);
    } else {
      this.showToast('Showing all ride options ⚡');
    }
  }

  // Provider Filter Selection
  selectProvider(providerName) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.showToast(`Filtered: ${providerName} rides`);
  }

  // Booking a Ride
  bookRide(provider, fare) {
    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }
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
      window.location.hash = '#home';
    } else if (tab === 'compare') {
      this.navigateTo('screen-home', false);
      window.location.hash = '#home';
      this.showResultsPanel();
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

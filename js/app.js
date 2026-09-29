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
    document.addEventListener('DOMContentLoaded', () => {
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

  handleHashRoute() {
    if (window.location.hash === '#history') {
      this.currentTab = 'history';
      this.navigateTo('screen-history', false);
      this.updateActiveNavs('history');
      this.selectHistoryTrip(this.selectedHistoryTripId || 1, false);
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
    // Permanently remove any stray More buttons from DOM
    const moreBtn1 = document.getElementById('mob-nav-more');
    if (moreBtn1) moreBtn1.remove();
    const moreBtn2 = document.getElementById('tab-btn-more');
    if (moreBtn2) moreBtn2.remove();

    const mobNavs = document.querySelectorAll('#mobile-bottom-nav, .mobile-bottom-nav');
    const tabDocks = document.querySelectorAll('#tablet-nav-dock, .tablet-nav-dock');
    const deskSidebars = document.querySelectorAll('#desktop-sidebar, .desktop-sidebar');
    const deskTopbars = document.querySelectorAll('.desktop-topbar');
    const width = window.innerWidth;

    // When on Get Started (Splash) Screen
    if (this.currentScreen === 'screen-splash') {
      mobNavs.forEach(el => el.style.setProperty('display', 'none', 'important'));
      tabDocks.forEach(el => el.style.setProperty('display', 'none', 'important'));
      deskSidebars.forEach(el => el.style.setProperty('display', 'none', 'important'));
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
      return;
    }

    // When on Home or History Screen
    if (width >= 1024) {
      // Desktop: Sidebar + Topbar ONLY
      mobNavs.forEach(el => el.style.setProperty('display', 'none', 'important'));
      tabDocks.forEach(el => el.style.setProperty('display', 'none', 'important'));
      deskSidebars.forEach(el => el.style.setProperty('display', 'flex', 'important'));
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'flex', 'important'));
    } else if (width >= 768) {
      // Tablet: Floating dock ONLY (NEVER mobile bottom nav)
      mobNavs.forEach(el => el.style.setProperty('display', 'none', 'important'));
      tabDocks.forEach(el => el.style.setProperty('display', 'flex', 'important'));
      deskSidebars.forEach(el => el.style.setProperty('display', 'none', 'important'));
      deskTopbars.forEach(tb => tb.style.setProperty('display', 'none', 'important'));
    } else {
      // Mobile: Mobile bottom nav ONLY
      mobNavs.forEach(el => el.style.setProperty('display', 'flex', 'important'));
      tabDocks.forEach(el => el.style.setProperty('display', 'none', 'important'));
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

    const tabBtns = document.querySelectorAll('.tab-dock-btn');
    tabBtns.forEach(btn => {
      const match = btn.getAttribute('data-tab') === tab || btn.id === `tab-btn-${tab}`;
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
    } else {
      this.showToast(`${tab.charAt(0).toUpperCase() + tab.slice(1)} view selected`);
    }
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

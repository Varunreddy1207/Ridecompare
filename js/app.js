// User-configured Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyA4LfkJpAF7Ggz83bF--j3vPztxlzrxPxg';
window.GOOGLE_MAPS_API_KEY = GOOGLE_MAPS_API_KEY;

// Curated fast-lookup directory for popular colleges, stations, landmarks, and regional hubs
const KNOWN_LOCATIONS = [
  // Kolhapur & Surrounding
  { name: 'Sanjay Ghodawat University', address: 'Kolhapur-Sangli Highway, Atigre, Kolhapur', lat: 16.7450, lng: 74.3720, tags: ['sgu', 'ghodawat', 'university', 'atigre', 'college', 'engineering', 'campus'] },
  { name: 'Aastha Hospital', address: 'Shivaji Park, Kolhapur', lat: 16.7020, lng: 74.2460, tags: ['aastha', 'hospital', 'shivaji park', 'aastha hospital'] },
  { name: 'Rajarampuri', address: '6th Lane, Rajarampuri, Kolhapur', lat: 16.6912, lng: 74.2435, tags: ['rajarampuri', 'kolhapur'] },
  { name: 'Shri Ambabai Mahalaxmi Temple', address: 'Bhavani Mandap, Kolhapur', lat: 16.6946, lng: 74.2238, tags: ['mahalaxmi', 'temple', 'mandir', 'ambabai', 'bhavani mandap', 'darshan'] },
  { name: 'Kolhapur Railway Station', address: 'Station Road, Shahupuri, Kolhapur', lat: 16.7028, lng: 74.2405, tags: ['kolhapur railway', 'train', 'station', 'shahu maharaj terminus', 'shahupuri', 'csm terminus'] },
  { name: 'Central Bus Stand (CBS) Kolhapur', address: 'Station Road, Shahupuri, Kolhapur', lat: 16.7042, lng: 74.2415, tags: ['cbs', 'bus stand', 'st stand', 'central bus station', 'kolhapur bus'] },
  { name: 'Rankala Lake', address: 'Promenade, Kolhapur', lat: 16.6894, lng: 74.2144, tags: ['rankala', 'lake', 'talav', 'chowpatty', 'promenade'] },
  { name: 'DY Patil College', address: 'Kasaba Bawada, Kolhapur', lat: 16.7212, lng: 74.2541, tags: ['dy patil', 'dypcet', 'college', 'kasaba bawada', 'engineering', 'campus'] },
  { name: 'New Palace (Chhatrapati Shahu Palace)', address: 'Tarabai Park, Kolhapur', lat: 16.7161, lng: 74.2292, tags: ['new palace', 'shahu museum', 'tarabai park', 'palace'] },
  { name: 'Shivaji University', address: 'Vidyanagar, Kolhapur', lat: 16.6782, lng: 74.2546, tags: ['shivaji university', 'suk', 'vidyanagar', 'university', 'campus'] },
  { name: 'Bhavani Mandap', address: 'Old City, Kolhapur', lat: 16.6949, lng: 74.2244, tags: ['bhavani mandap', 'old palace', 'mahalaxmi'] },
  { name: 'Panhala Fort', address: 'Panhala, Kolhapur District', lat: 16.8122, lng: 74.1165, tags: ['panhala', 'fort', 'hill station'] },
  { name: 'Kagal MIDC', address: 'Five Star MIDC, Kagal, Kolhapur', lat: 16.5812, lng: 74.3168, tags: ['kagal', 'midc', 'industrial area'] },
  { name: 'Shiroli MIDC', address: 'NH4 Highway, Kolhapur', lat: 16.7458, lng: 74.2754, tags: ['shiroli', 'midc', 'industrial'] },
  { name: 'Aster Aadhar Hospital', address: 'Shastri Nagar, Kolhapur', lat: 16.6872, lng: 74.2482, tags: ['aadhar', 'aster', 'hospital', 'medical'] },
  { name: 'CPR Hospital', address: 'Bhavani Mandap Road, Kolhapur', lat: 16.6985, lng: 74.2298, tags: ['cpr', 'hospital', 'civil hospital'] },
  // Ichalkaranji
  { name: 'Ichalkaranji Main Bus Stand', address: 'Main Road, Ichalkaranji', lat: 16.6965, lng: 74.4628, tags: ['ichalkaranji', 'bus stand', 'textile city', 'home'] },
  { name: 'DKTE Textile & Engineering Institute', address: 'Rajwada, Ichalkaranji', lat: 16.6998, lng: 74.4622, tags: ['dkte', 'college', 'textile', 'engineering', 'ichalkaranji'] },
  // Pune & Metro
  { name: 'Pune Junction Railway Station', address: 'Agarkar Nagar, Pune', lat: 18.5284, lng: 73.8739, tags: ['pune junction', 'pune railway station', 'pune train', 'agarkar nagar'] },
  { name: 'Pune International Airport (PNQ)', address: 'Lohegaon, Pune', lat: 18.5822, lng: 73.9197, tags: ['pune airport', 'pnq', 'lohegaon', 'flight', 'airport'] },
  { name: 'Hinjawadi IT Park', address: 'Rajiv Gandhi Infotech Park Phase 1, Pune', lat: 18.5913, lng: 73.7389, tags: ['hinjawadi', 'hinjewadi', 'it park', 'infosys', 'wipro', 'tcs', 'tech'] },
  { name: 'Swargate Bus Station', address: 'Swargate, Pune', lat: 18.5018, lng: 73.8586, tags: ['swargate', 'bus stand', 'metro', 'st stand'] },
  { name: 'Shivaji Nagar Bus Stand / Station', address: 'Shivajinagar, Pune', lat: 18.5314, lng: 73.8553, tags: ['shivajinagar', 'shivaji nagar', 'bus station', 'court'] },
  { name: 'Kothrud Bus Depot', address: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077, tags: ['kothrud', 'chandani chowk', 'depot', 'paud road'] },
  { name: 'Phoenix Marketcity', address: 'Viman Nagar, Pune', lat: 18.5615, lng: 73.9167, tags: ['phoenix', 'mall', 'viman nagar', 'shopping'] },
  { name: 'Magarpatta Cybercity', address: 'Hadapsar, Pune', lat: 18.5089, lng: 73.9259, tags: ['magarpatta', 'hadapsar', 'cybercity', 'it park'] },
  { name: 'Baner Road', address: 'Balewadi High Street, Pune', lat: 18.5590, lng: 73.7868, tags: ['baner', 'balewadi', 'high street'] },
  { name: 'Wakad Chowk', address: 'Hinjewadi Bridge, Wakad, Pune', lat: 18.5987, lng: 73.7635, tags: ['wakad', 'bridge', 'chowk'] },
  { name: 'Aundh', address: 'Parihar Chowk, Aundh, Pune', lat: 18.5626, lng: 73.8087, tags: ['aundh', 'parihar chowk'] },
  { name: 'Koregaon Park (KP)', address: 'North Main Road, Pune', lat: 18.5362, lng: 73.8940, tags: ['koregaon park', 'kp', 'osho'] },
  { name: 'FC Road', address: 'Fergusson College Road, Shivajinagar, Pune', lat: 18.5246, lng: 73.8415, tags: ['fc road', 'fergusson', 'college road'] },
  { name: 'JM Road', address: 'Jangali Maharaj Road, Pune', lat: 18.5273, lng: 73.8479, tags: ['jm road', 'balgandharva'] },
  { name: 'Katraj Zoo / Snake Park', address: 'Rajiv Gandhi Zoological Park, Katraj, Pune', lat: 18.4556, lng: 73.8596, tags: ['katraj', 'zoo', 'snake park'] },
  { name: 'COEP Technological University', address: 'Shivajinagar, Pune', lat: 18.5298, lng: 73.8566, tags: ['coep', 'engineering college', 'university'] },
  // Mumbai
  { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', address: 'Fort, Mumbai', lat: 18.9401, lng: 72.8354, tags: ['csmt', 'cst', 'vt', 'mumbai railway station', 'mumbai cst'] },
  { name: 'Mumbai Airport (BOM)', address: 'Terminal 2, Sahar, Andheri East, Mumbai', lat: 19.0896, lng: 72.8656, tags: ['mumbai airport', 'bom', 't2', 'sahar', 'international airport'] },
  { name: 'Bandra Kurla Complex (BKC)', address: 'Bandra East, Mumbai', lat: 19.0664, lng: 72.8687, tags: ['bkc', 'bandra kurla', 'corporate'] },
  { name: 'Dadar Railway Station', address: 'Dadar, Mumbai', lat: 19.0178, lng: 72.8478, tags: ['dadar', 'station', 'central'] },
  { name: 'Marine Drive', address: 'Nariman Point, Mumbai', lat: 18.9432, lng: 72.8234, tags: ['marine drive', 'queens necklace', 'nariman point', 'churchgate'] },
  // Sangli & Satara
  { name: 'Sangli Railway Station', address: 'Station Road, Sangli', lat: 16.8524, lng: 74.5815, tags: ['sangli', 'station', 'railway', 'st stand'] },
  { name: 'Walchand College of Engineering', address: 'Vishrambag, Sangli', lat: 16.8457, lng: 74.6015, tags: ['walchand', 'wce', 'sangli', 'college', 'engineering'] },
  { name: 'Satara Central Bus Stand', address: 'Powai Naka, Satara', lat: 17.6805, lng: 74.0183, tags: ['satara', 'bus stand', 'powai naka', 'st stand'] },
  { name: 'Belagavi (Belgaum) Railway Station', address: 'Station Road, Belagavi', lat: 15.8497, lng: 74.4977, tags: ['belgaum', 'belagavi', 'railway station'] }
];

// =============================================================================
// VOZX RideCompare — Responsive Master Application Controller
// Seamless screen routing, sound FX, and multi-device responsive interaction
// =============================================================================

class RideCompareApp {
  constructor() {
    this.currentScreen = 'screen-splash';
    this.currentTab = 'home';
    this.selectedDestination = '';
    this.toastTimeout = null;
    this.selectedHistoryTripId = 1;
    this.userCoords = null;
    this.pickupLocationName = '';
    this.pickupLocationFull = '';
    this.pickupCoords = { lat: 16.7050, lng: 74.2433 };
    this.hasPickupSelected = false;
    this.dropMap = null;
    this.dropMarker = null;
    this.selectedDropCoords = { lat: 16.7450, lng: 74.3720 };
    this.selectedDropName = '';
    this.selectedDropSub = '';
    this.hasDropSelected = false;
    this.autoChainToDrop = false;
    this.isLocatingUser = false;
    this.dropSearchDebounce = null;
    this.locationPickerMode = 'pickup';
    this.tempSelectedName = '';
    this.tempSelectedSub = '';
    this.tempSelectedCoords = null;
    this.resultsMap = null;
    this.resultsTileLayer = null;
    this.resultsRouteLayers = [];
    this.currentRouteBounds = null;
    this.isFetchingRoute = false;
    this.googleMapsApiKey = GOOGLE_MAPS_API_KEY;

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
    this.initConnectivity();
    this.initUserProfile();

    document.addEventListener('DOMContentLoaded', () => {
      this.initTheme();
      this.initUserProfile();
      // Initialize Premium Welcome Splash Sequence
      this.initWelcomeSplash();
      // Check initial hash routing (#home, #history, or splash)
      this.handleHashRoute();

      // Handle browser back/forward buttons
      window.addEventListener('hashchange', () => {
        this.handleHashRoute();
      });

      // Responsive Navigation Enforcement
      this.enforceResponsiveNav();
      window.addEventListener('resize', () => this.enforceResponsiveNav());

      // Close Edit Profile Modal on backdrop click
      const editModal = document.getElementById('edit-profile-modal');
      if (editModal) {
        editModal.addEventListener('click', (e) => {
          if (e.target === editModal) {
            this.closeEditProfileModal();
          }
        });
      }

      // Close Auth Modal on backdrop click
      const authModal = document.getElementById('auth-modal');
      if (authModal) {
        authModal.addEventListener('click', (e) => {
          if (e.target === authModal) {
            this.closeAuthModal();
          }
        });
      }

      // Close Logout Confirm Modal on backdrop click
      const logoutModal = document.getElementById('logout-confirm-modal');
      if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
          if (e.target === logoutModal) {
            this.closeLogoutConfirmModal();
          }
        });
      }

      // Close System Status Restricted Modal on backdrop click
      const restrictedModal = document.getElementById('system-status-restricted-modal');
      if (restrictedModal) {
        restrictedModal.addEventListener('click', (e) => {
          if (e.target === restrictedModal) {
            this.closeAccessRestrictedModal();
          }
        });
      }

      // Close Delete Account Confirm Modal on backdrop click
      const deleteModal = document.getElementById('delete-account-modal');
      if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
          if (e.target === deleteModal) {
            this.closeDeleteAccountModal();
          }
        });
      }

      // Close Drop Location Map Modal on backdrop click
      const dropModal = document.getElementById('drop-location-map-modal');
      if (dropModal) {
        dropModal.addEventListener('click', (e) => {
          if (e.target === dropModal) {
            this.closeDropMapModal();
          }
        });
      }

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
          this.closeEditProfileModal();
          this.closeAuthModal();
          this.closeLogoutConfirmModal();
          this.closeDeleteAccountModal();
          this.closeDropMapModal();
        }
      });

      // Global click handler: Clicking RideCompare symbol or text reloads the page
      document.addEventListener('click', (e) => {
        const brandTarget = e.target.closest(
          '.brand-emblem-small, .brand-title, .logo-emblem-container, .desktop-brand-header, [data-reload-brand], img[src*="logo_cropped_clean"], img[alt*="VOZX Logo"], img[alt*="logo"]'
        );
        if (brandTarget) {
          if (e.target.closest('button:not([data-reload-brand]), a:not([data-reload-brand]), input, select, textarea')) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          this.reloadPage();
        }
      });

      // Initial route map badges and headers setup
      this.updateResultsMapRoute();
      this.renderRecentSearches();
      this.syncRecentSearchesFromBackend();

      // Automatically re-sync from backend/cloud when switching back to tab/app across devices
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.syncRecentSearchesFromBackend();
        }
      });
      window.addEventListener('focus', () => {
        this.syncRecentSearchesFromBackend();
      });

      // Desktop search input: Enter key to search
      const deskSearchInput = document.getElementById('desktop-search-input');
      if (deskSearchInput) {
        deskSearchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const val = deskSearchInput.value.trim();
            if (val) {
              this.selectedDropName = val;
              this.selectedDropSub = 'Kolhapur';
              this.hasDropSelected = true;
              const dropText = document.getElementById('home-drop-text');
              if (dropText) {
                dropText.textContent = val;
                dropText.classList.remove('placeholder');
              }
              if (!this.hasPickupSelected) {
                this.hasPickupSelected = true;
                this.pickupLocationName = 'Current Location';
                const pText = document.getElementById('home-pickup-text');
                if (pText) {
                  pText.textContent = 'Current Location';
                  pText.classList.remove('placeholder');
                }
              }
              this.onSearchRides();
            }
          }
        });
      }
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
      if (this.resultsMap && this.resultsTileLayer) {
        this.resultsTileLayer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}');
      }

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
      if (this.resultsMap && this.resultsTileLayer) {
        this.resultsTileLayer.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      }

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
    this.updateEditProfileModalTheme(theme === 'dark');
    this.updateAuthModalTheme(theme === 'dark');
    this.updateLogoutModalTheme(theme === 'dark');
    this.updateDeleteAccountModalTheme(theme === 'dark');
    this.updateRestrictedModalTheme(theme === 'dark');
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
    // Always guarantee Uber icon box and Uber badge text is pure white
    document.querySelectorAll('.provider-box-uber, .provider-box-uber *, #receipt-provider-badge.bg-black, #modal-provider-badge.bg-black').forEach(el => {
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

  // Reload Page Action when user clicks RideCompare symbol or text
  reloadPage() {
    if (this._isReloading) return;
    this._isReloading = true;
    if (window.soundFX && window.soundFX.playTap) {
      try { window.soundFX.playTap(); } catch (_) {}
    }
    // Maintain current screen / tab route across reload
    if (this.currentScreen === 'screen-splash') {
      try {
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch (_) {}
    } else if (this.currentScreen === 'screen-history' || this.currentTab === 'history') {
      window.location.hash = '#history';
    } else if (this.currentScreen === 'screen-profile' || this.currentTab === 'profile') {
      window.location.hash = '#profile';
    } else if (this.currentScreen === 'screen-booking') {
      window.location.hash = '#booking';
    } else {
      window.location.hash = '#home';
    }
    window.location.reload();
  }

  // =========================================================================
  // PREMIUM WELCOME / SPLASH ANIMATION CONTROLLER (Apple Minimal Pure White)
  // "One Ride. Every Price." • 3.0s Cinematic Sequence
  // =========================================================================
  initWelcomeSplash() {
    const splash = document.getElementById('welcome-splash-screen');
    if (!splash) return;

    // Check if user has already viewed the welcome animation in this browser session
    const hasViewed = sessionStorage.getItem('vozx_welcome_viewed') === 'true';
    const path = (window.location.pathname || '').toLowerCase().replace(/\/$/, '');
    const isDeepPath = path.endsWith('/login') || path.endsWith('/signup') || path.endsWith('/system-status') || path.endsWith('/status') || path.endsWith('/profile') || path.endsWith('/rides') || path.endsWith('/history') || path.endsWith('/booking');

    // If already viewed or entering directly with specific deep route
    if (hasViewed || isDeepPath || (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#home')) {
      splash.classList.add('hidden');
      this.isWelcomeSplashActive = false;
      return;
    }

    // Active welcome sequence
    this.isWelcomeSplashActive = true;

    // Enforce pure white canvas without background navigation bars
    this.enforceResponsiveNav();

    // Sequence transition begins at 2.7s (2700ms) and finishes by 3.1s (3100ms)
    this.welcomeTransitionTimer = setTimeout(() => {
      this.finishWelcomeSplash();
    }, 2700);
  }

  finishWelcomeSplash() {
    if (!this.isWelcomeSplashActive && !document.getElementById('welcome-splash-screen')) return;
    this.isWelcomeSplashActive = false;

    if (this.welcomeTransitionTimer) {
      clearTimeout(this.welcomeTransitionTimer);
      this.welcomeTransitionTimer = null;
    }

    const splash = document.getElementById('welcome-splash-screen');
    if (!splash) return;

    // Mark as viewed for the session so it won't replay on page navigation
    sessionStorage.setItem('vozx_welcome_viewed', 'true');

    // Smooth white-to-white exit transition (scale down 0.96 + fade out opacity 0 over 400ms)
    splash.classList.add('fade-out');

    // Check authentication / started state
    const hasStarted = localStorage.getItem('ridecompare_has_started') === 'true';
    const isAuth = !!(window.RideCompareAuth && window.RideCompareAuth.isAuthenticated);

    const path = (window.location.pathname || '').toLowerCase().replace(/\/$/, '');
    const hash = (window.location.hash || '').toLowerCase();

    // Direct developer route check
    if (hash === '#system-status' || hash === '#status' || path.endsWith('/system-status') || path.endsWith('/status')) {
      if (!this.isAdminOrDev()) {
        this.currentTab = 'home';
        this.navigateTo(isAuth || hasStarted ? 'screen-home' : 'screen-splash', false);
        this.updateActiveNavs('home');
        try { history.replaceState(null, '', '#home'); } catch (_) {}
        setTimeout(() => this.openAccessRestrictedModal(), 350);
      } else {
        this.currentTab = 'status';
        this.navigateTo('screen-status', false);
        this.updateActiveNavs('status');
        this.initSystemStatus();
      }
    } else if (path.endsWith('/login') || hash === '#login') {
      this.currentTab = 'home';
      this.navigateTo(isAuth || hasStarted ? 'screen-home' : 'screen-splash', false);
      setTimeout(() => this.openAuthModal('login'), 200);
    } else if (path.endsWith('/signup') || hash === '#signup') {
      this.currentTab = 'home';
      this.navigateTo(isAuth || hasStarted ? 'screen-home' : 'screen-splash', false);
      setTimeout(() => this.openAuthModal('signup'), 200);
    } else if (path.endsWith('/profile') || hash === '#profile') {
      this.currentTab = 'profile';
      this.navigateTo('screen-profile', false);
      this.updateActiveNavs('profile');
    } else if (path.endsWith('/rides') || path.endsWith('/history') || hash === '#rides' || hash === '#history') {
      this.currentTab = 'history';
      this.navigateTo('screen-history', false);
      this.updateActiveNavs('history');
      this.selectHistoryTrip(this.selectedHistoryTripId || 1, false);
    } else if (path.endsWith('/booking') || hash === '#booking') {
      this.navigateTo('screen-booking', false);
    } else if (hasStarted || isAuth) {
      // If authenticated or returning user who has started: proceed to Home
      this.currentTab = 'home';
      this.navigateTo('screen-home', false);
      this.updateActiveNavs('home');
      if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#splash') {
        try { history.replaceState(null, '', '#home'); } catch (_) {}
      }
    } else {
      // Unauthenticated / Logged out / First time: reveal Get Started page
      this.currentTab = 'home';
      this.navigateTo('screen-splash', false);
      if (!window.location.hash || window.location.hash === '#') {
        try { history.replaceState(null, '', '#splash'); } catch (_) {}
      }
    }
    this.enforceResponsiveNav();

    // After 400ms fade transition finishes, hide overlay completely
    setTimeout(() => {
      splash.classList.add('hidden');
      splash.classList.remove('fade-out');
    }, 420);
  }

  skipWelcomeSplash() {
    // Allows user to skip anytime by tapping/clicking anywhere on the screen
    if (!this.isWelcomeSplashActive) return;
    if (window.soundFX && window.soundFX.playTap) {
      try { window.soundFX.playTap(); } catch (_) {}
    }
    this.finishWelcomeSplash();
  }

  handleHashRoute() {
    // If welcome splash is currently running, let it complete its smooth transition
    if (this.isWelcomeSplashActive) {
      return;
    }
    const hash = (window.location.hash || '').toLowerCase();
    const path = (window.location.pathname || '').toLowerCase().replace(/\/$/, '');
    const hasStarted = localStorage.getItem('ridecompare_has_started') === 'true';
    const isAuth = !!(window.RideCompareAuth && window.RideCompareAuth.isAuthenticated);

    // Explicit System Status developer route
    if (hash === '#system-status' || hash === '#status' || path.endsWith('/system-status') || path.endsWith('/status')) {
      if (!this.isAdminOrDev()) {
        try { history.replaceState(null, '', '#home'); } catch (_) {}
        this.openAccessRestrictedModal();
        return;
      }
      this.currentTab = 'status';
      this.navigateTo('screen-status', false);
      this.updateActiveNavs('status');
      this.initSystemStatus();
      return;
    }

    // Explicit direct login / signup routes
    if (path.endsWith('/login') || hash === '#login') {
      this.currentTab = 'home';
      this.navigateTo(isAuth || hasStarted ? 'screen-home' : 'screen-splash', false);
      setTimeout(() => this.openAuthModal('login'), 200);
      return;
    }
    if (path.endsWith('/signup') || hash === '#signup') {
      this.currentTab = 'home';
      this.navigateTo(isAuth || hasStarted ? 'screen-home' : 'screen-splash', false);
      setTimeout(() => this.openAuthModal('signup'), 200);
      return;
    }

    // Explicit Get Started / Splash routes
    if (hash === '#splash' || hash === '#get-started' || path.endsWith('/get-started')) {
      this.currentTab = 'home';
      this.navigateTo('screen-splash', false);
      return;
    }

    if (hash === '#booking' || path.endsWith('/booking')) {
      this.navigateTo('screen-booking', false);
    } else if (hash === '#history' || hash === '#rides' || path.endsWith('/history') || path.endsWith('/rides')) {
      this.currentTab = 'history';
      this.navigateTo('screen-history', false);
      this.updateActiveNavs('history');
      this.selectHistoryTrip(this.selectedHistoryTripId || 1, false);
    } else if (hash === '#profile' || path.endsWith('/profile')) {
      this.currentTab = 'profile';
      this.navigateTo('screen-profile', false);
      this.updateActiveNavs('profile');
    } else if (hash === '#home' || path.endsWith('/home')) {
      this.currentTab = 'home';
      this.navigateTo('screen-home', false);
      this.updateActiveNavs('home');
    } else if (hasStarted || isAuth) {
      this.currentTab = 'home';
      this.navigateTo('screen-home', false);
      this.updateActiveNavs('home');
    } else {
      // Unauthenticated / Logged Out: Route to Get Started page
      this.currentTab = 'home';
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

    // When Welcome Splash is Active OR on Get Started Screen OR Booking Screen OR System Status Screen
    if (this.isWelcomeSplashActive || this.currentScreen === 'screen-splash' || this.currentScreen === 'screen-booking' || this.currentScreen === 'screen-status') {
      if (bottomNav) bottomNav.style.setProperty('display', 'none', 'important');
      legacyMobNavs.forEach(el => el.style.setProperty('display', 'none', 'important'));
      legacyTabDocks.forEach(el => el.style.setProperty('display', 'none', 'important'));
      if (this.isWelcomeSplashActive || this.currentScreen === 'screen-splash') {
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
    if (this.isCurrentlyOffline) {
      this.handleConnectivityChange(false);
      return;
    }
    const btn = document.getElementById('btn-get-started');
    if (btn) {
      btn.style.transform = 'scale(0.97)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    }
    
    // If user is already authenticated with a valid session, proceed directly to Home
    if (window.RideCompareAuth && window.RideCompareAuth.isAuthenticated) {
      localStorage.setItem('ridecompare_has_started', 'true');
      setTimeout(() => {
        this.navigateTo('screen-home', true);
        window.location.hash = '#home';
        this.showToast('Welcome back to VOZX RideCompare! 🚀');
      }, 180);
      return;
    }

    // New / Unauthenticated User: Open the Login portal
    setTimeout(() => {
      this.openAuthModal('login');
    }, 180);
  }

  // Secondary Action on Get Started Screen
  onLogin() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.openAuthModal('login');
  }

  // =========================================================================
  // AUTHENTICATION MODAL & CONTROLLERS (Connected to Supabase PostgreSQL & JWT)
  // =========================================================================
  openAuthModal(tab = 'login') {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    const welcomeSplash = document.getElementById('welcome-splash-screen');
    if (welcomeSplash) {
      welcomeSplash.classList.add('hidden');
      welcomeSplash.classList.remove('fade-out');
    }
    this.isWelcomeSplashActive = false;

    document.body.classList.add('auth-modal-open');
    this.switchAuthTab(tab);
    this.clearAuthErrors();
    modal.classList.add('show');
    this.updateAuthModalTheme();
  }

  closeAuthModal() {
    if (this.authRedirectTimer) {
      clearTimeout(this.authRedirectTimer);
      this.authRedirectTimer = null;
    }
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    document.body.classList.remove('auth-modal-open');
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('show');
    }
    const successBox = document.getElementById('auth-signup-success-box');
    if (successBox) successBox.classList.add('hidden');
    const tabContainer = document.getElementById('auth-tab-container');
    if (tabContainer) tabContainer.classList.remove('hidden');
    this.clearAuthErrors();
    this.clearAuthSuccess();
    this.resetPasswordVisibility();

    // If user is not authenticated and hasn't started the app, ensure Get Started screen is cleanly active
    const isAuth = !!((window.RideCompareAuth && window.RideCompareAuth.isAuthenticated) || (this.userProfile && this.userProfile.name && this.userProfile.name !== 'Guest User'));
    const hasStarted = localStorage.getItem('ridecompare_has_started') === 'true';
    if (!isAuth && !hasStarted) {
      this.navigateTo('screen-splash', false);
    }
  }

  switchAuthTab(tab = 'login') {
    if (this.authRedirectTimer) {
      clearTimeout(this.authRedirectTimer);
      this.authRedirectTimer = null;
    }
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    this.clearAuthErrors();
    this.clearAuthSuccess();
    this.resetPasswordVisibility();

    const isDarkMode = document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const successBox = document.getElementById('auth-signup-success-box');
    if (successBox) successBox.classList.add('hidden');
    const tabContainer = document.getElementById('auth-tab-container');
    if (tabContainer) tabContainer.classList.remove('hidden');

    const loginTab = document.getElementById('tab-auth-login');
    const signupTab = document.getElementById('tab-auth-signup');
    const loginForm = document.getElementById('form-auth-login');
    const signupForm = document.getElementById('form-auth-signup');
    const title = document.getElementById('auth-modal-title');
    const sub = document.getElementById('auth-modal-sub');

    if (tab === 'signup') {
      this.lastAuthAction = 'signup';
      const boxTitle = document.getElementById('auth-success-box-title');
      if (boxTitle) boxTitle.textContent = 'Your account created successfully!';
      if (loginTab) {
        loginTab.className = isDarkMode 
          ? 'flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-slate-400 hover:text-white cursor-pointer'
          : 'flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-slate-500 hover:text-slate-900 cursor-pointer';
      }
      if (signupTab) {
        signupTab.className = 'flex-1 py-2 text-xs font-bold rounded-lg transition-all text-white bg-blue-600 shadow-md cursor-pointer';
      }
      if (loginForm) loginForm.classList.add('hidden');
      if (signupForm) signupForm.classList.remove('hidden');
      if (title) title.textContent = 'Create Account';
      if (sub) sub.textContent = 'Join VOZX RideCompare to unlock best rates';
      const nameInput = document.getElementById('auth-signup-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 50);
    } else {
      this.lastAuthAction = 'login';
      const boxTitle = document.getElementById('auth-success-box-title');
      if (boxTitle) boxTitle.textContent = 'You login successful!';
      if (loginTab) {
        loginTab.className = 'flex-1 py-2 text-xs font-bold rounded-lg transition-all text-white bg-blue-600 shadow-md cursor-pointer';
      }
      if (signupTab) {
        signupTab.className = isDarkMode
          ? 'flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-slate-400 hover:text-white cursor-pointer'
          : 'flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-slate-500 hover:text-slate-900 cursor-pointer';
      }
      if (loginForm) loginForm.classList.remove('hidden');
      if (signupForm) signupForm.classList.add('hidden');
      if (title) title.textContent = 'Welcome Back';
      if (sub) sub.textContent = 'Sign in to compare rates & save money';
      const emailInput = document.getElementById('auth-login-email');
      if (emailInput) setTimeout(() => emailInput.focus(), 50);
    }
  }

  clearAuthErrors() {
    const banner = document.getElementById('auth-error-banner');
    const errorText = document.getElementById('auth-error-text');
    if (banner) banner.classList.add('hidden');
    if (errorText) errorText.textContent = '';
  }

  clearAuthSuccess() {
    const banner = document.getElementById('auth-success-banner');
    const successText = document.getElementById('auth-success-text');
    if (banner) banner.classList.add('hidden');
    if (successText) successText.textContent = 'Your account created successfully!';
  }

  setAuthSuccess(message = 'Your account created successfully!') {
    this.clearAuthErrors();
    const banner = document.getElementById('auth-success-banner');
    const successText = document.getElementById('auth-success-text');
    if (banner && successText) {
      successText.textContent = message;
      banner.classList.remove('hidden');
    }
  }

  setAuthError(message) {
    this.clearAuthSuccess();
    const banner = document.getElementById('auth-error-banner');
    const errorText = document.getElementById('auth-error-text');
    if (banner && errorText) {
      errorText.textContent = message || 'An error occurred. Please try again.';
      banner.classList.remove('hidden');
    }
  }

  setAuthLoading(isLoading, formType = 'login') {
    const submitBtn = document.getElementById(`btn-auth-${formType}-submit`);
    const submitText = document.getElementById(`btn-auth-${formType}-text`);
    const spinner = document.getElementById(`btn-auth-${formType}-spinner`);

    if (submitBtn) submitBtn.disabled = isLoading;
    if (spinner) {
      if (isLoading) spinner.classList.remove('hidden');
      else spinner.classList.add('hidden');
    }
    if (submitText) {
      if (isLoading) {
        submitText.textContent = formType === 'login' ? 'Signing In...' : 'Creating Account...';
      } else {
        submitText.textContent = formType === 'login' ? 'Log In' : 'Create Account';
      }
    }
  }

  togglePasswordVisibility(inputId, btnElement) {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    const input = document.getElementById(inputId);
    if (!input) return;
    const btn = btnElement || (input.parentElement ? input.parentElement.querySelector('.btn-toggle-password') : null);
    const eyeShow = btn ? btn.querySelector('.eye-icon-show') : null;
    const eyeHide = btn ? btn.querySelector('.eye-icon-hide') : null;

    if (input.type === 'password') {
      input.type = 'text';
      if (eyeShow) eyeShow.classList.add('hidden');
      if (eyeHide) eyeHide.classList.remove('hidden');
      if (btn) {
        btn.setAttribute('title', 'Hide password');
        btn.setAttribute('aria-label', 'Hide password');
      }
    } else {
      input.type = 'password';
      if (eyeShow) eyeShow.classList.remove('hidden');
      if (eyeHide) eyeHide.classList.add('hidden');
      if (btn) {
        btn.setAttribute('title', 'View password');
        btn.setAttribute('aria-label', 'View password');
      }
    }
  }

  resetPasswordVisibility() {
    const passwordInputIds = ['auth-login-password', 'auth-signup-password', 'auth-signup-confirm'];
    passwordInputIds.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.type = 'password';
        const parent = input.parentElement;
        if (parent) {
          const btn = parent.querySelector('.btn-toggle-password');
          if (btn) {
            const eyeShow = btn.querySelector('.eye-icon-show');
            const eyeHide = btn.querySelector('.eye-icon-hide');
            if (eyeShow) eyeShow.classList.remove('hidden');
            if (eyeHide) eyeHide.classList.add('hidden');
            btn.setAttribute('title', 'View password');
            btn.setAttribute('aria-label', 'View password');
          }
        }
      }
    });
  }

  async handleLoginSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.clearAuthErrors();

    const emailInp = document.getElementById('auth-login-email');
    const passInp = document.getElementById('auth-login-password');
    const email = emailInp ? emailInp.value.trim() : '';
    const password = passInp ? passInp.value : '';

    if (!email) {
      this.setAuthError('Please enter your email address.');
      if (emailInp) emailInp.focus();
      return;
    }
    if (!password) {
      this.setAuthError('Please enter your password.');
      if (passInp) passInp.focus();
      return;
    }

    this.setAuthLoading(true, 'login');

    try {
      if (!window.RideCompareAuth) {
        throw new Error('Authentication client not initialized.');
      }
      const res = await window.RideCompareAuth.login(email, password);
      const user = res.user;

      // Update current profile in application
      this.userProfile = Object.assign({}, this.userProfile, {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || (this.userProfile && this.userProfile.phone) || '+91 98765 43210'
      });
      localStorage.setItem('ridecompare_user_profile', JSON.stringify(this.userProfile));

      // Migrate any guest recent searches into the logged-in user account & upload to cloud
      try {
        const guestSearchesRaw = localStorage.getItem('ridecompare_recent_searches_guest');
        if (guestSearchesRaw) {
          const guestSearches = JSON.parse(guestSearchesRaw);
          if (Array.isArray(guestSearches) && guestSearches.length > 0) {
            const userKey = `ridecompare_recent_searches_${user.email.toLowerCase().trim()}`;
            const existingUserRaw = localStorage.getItem(userKey);
            const existingUserSearches = existingUserRaw ? JSON.parse(existingUserRaw) : [];
            const merged = [...existingUserSearches];
            for (const gs of guestSearches) {
              if (!merged.some(m => (m.name || '').toLowerCase() === (gs.name || '').toLowerCase())) {
                merged.push(gs);
                if (window.RideCompareApi && typeof window.RideCompareApi.saveRecentSearch === 'function') {
                  window.RideCompareApi.saveRecentSearch(gs).catch(() => {});
                }
              }
            }
            localStorage.setItem(userKey, JSON.stringify(merged.slice(0, 8)));
          }
        }
      } catch (_) {}

      this.renderUserProfile();
      this.syncRecentSearchesFromBackend();

      if (window.soundFX && window.soundFX.playGetStarted) {
        window.soundFX.playGetStarted();
      }

      // Display green theme "You login successful!" box and banner across all devices
      this.showLoginSuccessBox(user);
    } catch (err) {
      const msg = err.message || (err.data && err.data.error && err.data.error.message) || 'Invalid email or password.';
      this.setAuthError(msg);
    } finally {
      this.setAuthLoading(false, 'login');
    }
  }

  async handleSignupSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.clearAuthErrors();

    const nameInp = document.getElementById('auth-signup-name');
    const emailInp = document.getElementById('auth-signup-email');
    const passInp = document.getElementById('auth-signup-password');
    const confInp = document.getElementById('auth-signup-confirm');

    const name = nameInp ? nameInp.value.trim() : '';
    const email = emailInp ? emailInp.value.trim() : '';
    const password = passInp ? passInp.value : '';
    const confirm = confInp ? confInp.value : '';

    if (!name) {
      this.setAuthError('Please enter your full name.');
      if (nameInp) nameInp.focus();
      return;
    }
    if (!email || !email.includes('@')) {
      this.setAuthError('Please enter a valid email address.');
      if (emailInp) emailInp.focus();
      return;
    }
    if (!password || password.length < 6) {
      this.setAuthError('Password must be at least 6 characters long.');
      if (passInp) passInp.focus();
      return;
    }
    if (password !== confirm) {
      this.setAuthError('Passwords do not match. Please try again.');
      if (confInp) confInp.focus();
      return;
    }

    this.setAuthLoading(true, 'signup');

    try {
      if (!window.RideCompareAuth) {
        throw new Error('Authentication client not initialized.');
      }
      const res = await window.RideCompareAuth.register(name, email, password);
      const user = res.user;

      // Update current profile in application
      this.userProfile = Object.assign({}, this.userProfile, {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || (this.userProfile && this.userProfile.phone) || '+91 98765 43210'
      });
      localStorage.setItem('ridecompare_user_profile', JSON.stringify(this.userProfile));

      // Migrate any guest recent searches into the logged-in user account & upload to cloud
      try {
        const guestSearchesRaw = localStorage.getItem('ridecompare_recent_searches_guest');
        if (guestSearchesRaw) {
          const guestSearches = JSON.parse(guestSearchesRaw);
          if (Array.isArray(guestSearches) && guestSearches.length > 0) {
            const userKey = `ridecompare_recent_searches_${user.email.toLowerCase().trim()}`;
            const existingUserRaw = localStorage.getItem(userKey);
            const existingUserSearches = existingUserRaw ? JSON.parse(existingUserRaw) : [];
            const merged = [...existingUserSearches];
            for (const gs of guestSearches) {
              if (!merged.some(m => (m.name || '').toLowerCase() === (gs.name || '').toLowerCase())) {
                merged.push(gs);
                if (window.RideCompareApi && typeof window.RideCompareApi.saveRecentSearch === 'function') {
                  window.RideCompareApi.saveRecentSearch(gs).catch(() => {});
                }
              }
            }
            localStorage.setItem(userKey, JSON.stringify(merged.slice(0, 8)));
          }
        }
      } catch (_) {}

      this.renderUserProfile();
      this.syncRecentSearchesFromBackend();

      if (window.soundFX && window.soundFX.playGetStarted) {
        window.soundFX.playGetStarted();
      }

      // Display green theme account created success box
      this.showAccountCreatedSuccessBox(user);
    } catch (err) {
      const msg = err.message || (err.data && err.data.error && err.data.error.message) || 'Registration failed. Please try again.';
      this.setAuthError(msg);
    } finally {
      this.setAuthLoading(false, 'signup');
    }
  }

  // Display green theme "You login successful!" box on valid login across all devices
  showLoginSuccessBox(user) {
    if (this.authRedirectTimer) {
      clearTimeout(this.authRedirectTimer);
      this.authRedirectTimer = null;
    }

    this.lastAuthAction = 'login';

    const successBox = document.getElementById('auth-signup-success-box');
    const signupForm = document.getElementById('form-auth-signup');
    const loginForm = document.getElementById('form-auth-login');
    const tabContainer = document.getElementById('auth-tab-container');
    const errorBanner = document.getElementById('auth-error-banner');
    const boxTitle = document.getElementById('auth-success-box-title') || (successBox ? successBox.querySelector('.auth-success-box-title') : null);
    const boxSub = document.getElementById('auth-success-box-user-msg');
    const userNameSpan = document.getElementById('auth-success-box-user-name');
    const modalTitle = document.getElementById('auth-modal-title');
    const modalSub = document.getElementById('auth-modal-sub');

    // 1. Display inline green success banner with exact requested text in green theme
    this.setAuthSuccess('You login successful!');

    const displayName = (user && user.name) ? user.name : 'User';

    // 2. Set title and subtitle in green theme box
    if (boxTitle) {
      boxTitle.textContent = 'You login successful!';
    }
    if (userNameSpan) {
      userNameSpan.textContent = displayName;
    }
    if (boxSub) {
      boxSub.innerHTML = `Welcome back to VOZX RideCompare, <strong class="text-white" id="auth-success-box-user-name">${displayName}</strong>!`;
    }

    // 3. Hide forms & tabs, leaving the green success presentation front and center
    if (signupForm) signupForm.classList.add('hidden');
    if (loginForm) loginForm.classList.add('hidden');
    if (tabContainer) tabContainer.classList.add('hidden');
    if (errorBanner) errorBanner.classList.add('hidden');
    if (modalTitle) modalTitle.textContent = 'Login Successful';
    if (modalSub) modalSub.textContent = 'Authentication completed successfully';

    // 4. Show green theme success box
    if (successBox) {
      successBox.classList.remove('hidden');
    }

    this.updateAuthModalTheme();

    // 5. Automatically transition to dashboard after 1.8 seconds if user does not click "Continue"
    this.authRedirectTimer = setTimeout(() => {
      this.onAccountCreatedContinue();
    }, 1800);
  }

  // Display green theme "Your account created successfully!" box on account creation
  showAccountCreatedSuccessBox(user) {
    if (this.authRedirectTimer) {
      clearTimeout(this.authRedirectTimer);
      this.authRedirectTimer = null;
    }

    this.lastAuthAction = 'signup';

    const successBox = document.getElementById('auth-signup-success-box');
    const signupForm = document.getElementById('form-auth-signup');
    const loginForm = document.getElementById('form-auth-login');
    const tabContainer = document.getElementById('auth-tab-container');
    const errorBanner = document.getElementById('auth-error-banner');
    const boxTitle = document.getElementById('auth-success-box-title') || (successBox ? successBox.querySelector('.auth-success-box-title') : null);
    const boxSub = document.getElementById('auth-success-box-user-msg');
    const userNameSpan = document.getElementById('auth-success-box-user-name');
    const modalTitle = document.getElementById('auth-modal-title');
    const modalSub = document.getElementById('auth-modal-sub');

    // Display inline green success banner
    this.setAuthSuccess('Your account created successfully!');

    if (boxTitle) {
      boxTitle.textContent = 'Your account created successfully!';
    }
    const displayName = (user && user.name) ? user.name : 'User';
    if (userNameSpan) {
      userNameSpan.textContent = displayName;
    }
    if (boxSub) {
      boxSub.innerHTML = `Welcome to VOZX RideCompare, <strong class="text-white" id="auth-success-box-user-name">${displayName}</strong>!`;
    }
    if (signupForm) signupForm.classList.add('hidden');
    if (loginForm) loginForm.classList.add('hidden');
    if (tabContainer) tabContainer.classList.add('hidden');
    if (errorBanner) errorBanner.classList.add('hidden');
    if (modalTitle) modalTitle.textContent = 'Account Created';
    if (modalSub) modalSub.textContent = 'Registration completed successfully';

    if (successBox) {
      successBox.classList.remove('hidden');
    }

    this.updateAuthModalTheme();

    // Automatically transition to dashboard after 2.2 seconds if user does not click "Continue"
    this.authRedirectTimer = setTimeout(() => {
      this.onAccountCreatedContinue();
    }, 2200);
  }

  // Action when user clicks "Continue to Dashboard" or auto-redirect timer expires
  onAccountCreatedContinue() {
    if (this.authRedirectTimer) {
      clearTimeout(this.authRedirectTimer);
      this.authRedirectTimer = null;
    }
    this.closeAuthModal();
    localStorage.setItem('ridecompare_has_started', 'true');
    this.navigateTo('screen-home', false);
    window.location.hash = '#home';
    this.enforceResponsiveNav();
    this.renderUserProfile();
    this.renderRecentSearches();
    this.syncRecentSearchesFromBackend();
    const userName = (this.userProfile && this.userProfile.name) ? this.userProfile.name : 'User';
    if (this.lastAuthAction === 'login') {
      this.showToast(`✓ Welcome back, ${userName}! 🚀`, 'success');
    } else {
      this.showToast(`✓ Your account created successfully! Welcome, ${userName}! 🎉`, 'success');
    }
  }

  updateAuthModalTheme(isDark = false) {
    const isDarkMode = isDark || document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const modalPanel = document.querySelector('#auth-modal .auth-panel');
    if (!modalPanel) return;

    const title = document.getElementById('auth-modal-title');
    const sub = document.getElementById('auth-modal-sub');
    const inputs = modalPanel.querySelectorAll('.auth-input');
    const labels = modalPanel.querySelectorAll('.auth-label');
    const tabContainer = document.getElementById('auth-tab-container') || modalPanel.querySelector('.auth-tab-switcher');
    const errorBanner = document.getElementById('auth-error-banner');
    const errorText = document.getElementById('auth-error-text');
    const successBanner = document.getElementById('auth-success-banner');
    const successText = document.getElementById('auth-success-text');
    const successBox = document.getElementById('auth-signup-success-box');
    const closeBtn = document.querySelector('#auth-modal .auth-close-btn');
    const backBtn = document.querySelector('#auth-modal .auth-back-btn');
    const themeBtn = document.querySelector('#auth-modal .theme-toggle-btn');
    const brandName = document.querySelector('#auth-modal .auth-brand-name');
    const trustBadges = document.querySelector('#auth-modal .auth-trust-badges');

    if (isDarkMode) {
      modalPanel.style.removeProperty('background');
      modalPanel.style.removeProperty('background-color');
      modalPanel.style.removeProperty('border-color');
      modalPanel.style.removeProperty('color');
      modalPanel.style.removeProperty('box-shadow');
      if (title) title.style.removeProperty('color');
      if (sub) sub.style.removeProperty('color');
      if (brandName) brandName.style.removeProperty('color');
      if (trustBadges) trustBadges.style.removeProperty('color');
      if (closeBtn) {
        closeBtn.style.removeProperty('background-color');
        closeBtn.style.removeProperty('color');
        closeBtn.style.removeProperty('border-color');
      }
      if (backBtn) {
        backBtn.style.removeProperty('background-color');
        backBtn.style.removeProperty('color');
        backBtn.style.removeProperty('border-color');
      }
      if (themeBtn) {
        themeBtn.style.removeProperty('background-color');
        themeBtn.style.removeProperty('border-color');
      }
      labels.forEach(l => l.style.removeProperty('color'));
      inputs.forEach(inp => {
        inp.style.removeProperty('background-color');
        inp.style.removeProperty('border-color');
        inp.style.removeProperty('color');
      });
      if (tabContainer) {
        tabContainer.style.removeProperty('background');
        tabContainer.style.removeProperty('background-color');
        tabContainer.style.removeProperty('border-color');
        tabContainer.style.removeProperty('box-shadow');
      }
      if (errorBanner) {
        errorBanner.style.removeProperty('background');
        errorBanner.style.removeProperty('background-color');
        errorBanner.style.removeProperty('border-color');
        errorBanner.style.removeProperty('color');
        errorBanner.style.removeProperty('box-shadow');
      }
      if (errorText) {
        errorText.style.removeProperty('color');
      }
      if (successBanner) {
        successBanner.style.removeProperty('background');
        successBanner.style.removeProperty('background-color');
        successBanner.style.removeProperty('border-color');
        successBanner.style.removeProperty('color');
        successBanner.style.removeProperty('box-shadow');
      }
      if (successText) {
        successText.style.removeProperty('color');
      }
      if (successBox) {
        successBox.style.removeProperty('background');
        successBox.style.removeProperty('background-color');
        successBox.style.removeProperty('border-color');
        successBox.style.removeProperty('box-shadow');
        const boxTitle = document.getElementById('auth-success-box-title') || successBox.querySelector('.auth-success-box-title');
        const boxSub = document.getElementById('auth-success-box-user-msg');
        const boxRedirect = successBox.querySelector('.auth-success-box-redirect-msg');
        const boxUserSpan = document.getElementById('auth-success-box-user-name');
        if (boxTitle) boxTitle.style.removeProperty('color');
        if (boxSub) boxSub.style.removeProperty('color');
        if (boxRedirect) boxRedirect.style.removeProperty('color');
        if (boxUserSpan) boxUserSpan.style.removeProperty('color');
      }
    } else {
      modalPanel.style.setProperty('background', '#FFFFFF', 'important');
      modalPanel.style.setProperty('background-color', '#FFFFFF', 'important');
      modalPanel.style.setProperty('border-color', '#E2E8F0', 'important');
      modalPanel.style.setProperty('color', '#0F172A', 'important');
      modalPanel.style.setProperty('box-shadow', '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)', 'important');
      if (title) title.style.setProperty('color', '#0F172A', 'important');
      if (sub) sub.style.setProperty('color', '#64748B', 'important');
      if (brandName) brandName.style.setProperty('color', '#0F172A', 'important');
      if (trustBadges) trustBadges.style.setProperty('color', '#64748B', 'important');
      if (closeBtn) {
        closeBtn.style.setProperty('background-color', '#FFFFFF', 'important');
        closeBtn.style.setProperty('color', '#475569', 'important');
        closeBtn.style.setProperty('border-color', '#E2E8F0', 'important');
      }
      if (backBtn) {
        backBtn.style.setProperty('background-color', '#FFFFFF', 'important');
        backBtn.style.setProperty('color', '#334155', 'important');
        backBtn.style.setProperty('border-color', '#E2E8F0', 'important');
      }
      if (themeBtn) {
        themeBtn.style.setProperty('background-color', '#FFFFFF', 'important');
        themeBtn.style.setProperty('border-color', '#E2E8F0', 'important');
      }
      labels.forEach(l => l.style.setProperty('color', '#334155', 'important'));
      inputs.forEach(inp => {
        inp.style.setProperty('background-color', '#F8FAFC', 'important');
        inp.style.setProperty('border-color', '#CBD5E1', 'important');
        inp.style.setProperty('color', '#0F172A', 'important');
      });

      // 1. Tab Switcher Container: PURE WHITE / SLATE 100 BACKGROUND
      if (tabContainer) {
        tabContainer.style.setProperty('background', '#F1F5F9', 'important');
        tabContainer.style.setProperty('background-color', '#F1F5F9', 'important');
        tabContainer.style.setProperty('border-color', '#E2E8F0', 'important');
        tabContainer.style.setProperty('box-shadow', 'inset 0 1px 2px rgba(0, 0, 0, 0.04)', 'important');
      }

      // 2. Error / Alert Banner:
      if (errorBanner) {
        errorBanner.style.setProperty('background', '#FEF2F2', 'important');
        errorBanner.style.setProperty('background-color', '#FEF2F2', 'important');
        errorBanner.style.setProperty('border-color', '#FECACA', 'important');
        errorBanner.style.setProperty('color', '#DC2626', 'important');
        errorBanner.style.setProperty('box-shadow', '0 1px 4px rgba(239, 68, 68, 0.08)', 'important');
      }
      if (errorText) {
        errorText.style.setProperty('color', '#DC2626', 'important');
      }

      // 3. Success / Alert Banner: Green Theme in Light Mode
      if (successBanner) {
        successBanner.style.setProperty('background', '#F0FDF4', 'important');
        successBanner.style.setProperty('background-color', '#F0FDF4', 'important');
        successBanner.style.setProperty('border-color', '#86EFAC', 'important');
        successBanner.style.setProperty('color', '#15803D', 'important');
        successBanner.style.setProperty('box-shadow', '0 1px 4px rgba(34, 197, 94, 0.1)', 'important');
      }
      if (successText) {
        successText.style.setProperty('color', '#15803D', 'important');
      }

      // 4. Account Created & Login Success Box: Green Theme in Light Mode
      if (successBox) {
        successBox.style.setProperty('background', '#F0FDF4', 'important');
        successBox.style.setProperty('background-color', '#F0FDF4', 'important');
        successBox.style.setProperty('border-color', '#22C55E', 'important');
        successBox.style.setProperty('box-shadow', '0 15px 35px rgba(34, 197, 94, 0.18)', 'important');
        const boxTitle = document.getElementById('auth-success-box-title') || successBox.querySelector('.auth-success-box-title');
        const boxSub = document.getElementById('auth-success-box-user-msg');
        const boxRedirect = successBox.querySelector('.auth-success-box-redirect-msg');
        const boxUserSpan = document.getElementById('auth-success-box-user-name');
        if (boxTitle) boxTitle.style.setProperty('color', '#15803D', 'important');
        if (boxSub) boxSub.style.setProperty('color', '#166534', 'important');
        if (boxRedirect) boxRedirect.style.setProperty('color', '#15803D', 'important');
        if (boxUserSpan) boxUserSpan.style.setProperty('color', '#0F172A', 'important');
      }
    }
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

  // =========================================================================
  // RECENT SEARCHES: Dynamic Persistence & Empty State Management
  // =========================================================================
  getRecentSearchesStorageKey() {
    const userEmail = (this.userProfile && this.userProfile.email) ? this.userProfile.email.toLowerCase().trim() : '';
    if (userEmail && userEmail !== 'guest' && userEmail !== 'guest user') {
      return `ridecompare_recent_searches_${userEmail}`;
    }
    return 'ridecompare_recent_searches_guest';
  }

  getRecentSearches() {
    try {
      const key = this.getRecentSearchesStorageKey();
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading recent searches:', e);
    }
    return [];
  }

  saveRecentSearches(searches) {
    try {
      const key = this.getRecentSearchesStorageKey();
      localStorage.setItem(key, JSON.stringify(searches.slice(0, 8)));
    } catch (e) {
      console.warn('Error saving recent searches:', e);
    }
  }

  calculateEstimatedMinFare(dropName, pickupName) {
    if (!dropName) return '₹65';
    const lower = dropName.toLowerCase();
    if (lower.includes('sanjay ghodawat') || lower.includes('ghodawat') || lower.includes('atigre')) {
      return '₹78';
    }
    if (lower.includes('pune junction') || lower.includes('pune')) {
      return '₹240';
    }
    if (lower.includes('home')) {
      return '₹65';
    }
    if (lower.includes('temple') || lower.includes('mahalaxmi')) {
      return '₹60';
    }
    if (lower.includes('lake') || lower.includes('rankala')) {
      return '₹70';
    }
    if (lower.includes('hospital') || lower.includes('aastha')) {
      return '₹55';
    }
    if (lower.includes('station') || lower.includes('railway')) {
      return '₹50';
    }
    if (lower.includes('airport')) {
      return '₹180';
    }
    if (lower.includes('dy patil') || lower.includes('college')) {
      return '₹65';
    }

    try {
      const dropCoords = this.selectedDropCoords || this.getCoordinatesFor(dropName, null);
      const pickCoords = this.pickupCoords || { lat: 16.7050, lng: 74.2433 };
      if (dropCoords && pickCoords) {
        const dist = this.calculateHaversineDistance(pickCoords.lat, pickCoords.lng, dropCoords.lat, dropCoords.lng);
        const fare = Math.max(45, Math.round(dist * 13 + 30));
        return `₹${fare}`;
      }
    } catch (_) {}

    return '₹75';
  }

  async addRecentSearch(name, city, fare = null, pickup = '') {
    if (!name || name.trim() === '' || name === 'Select drop location' || name === 'Select destination') {
      return;
    }
    const cleanName = name.trim();
    const cleanCity = (city || 'Kolhapur').trim();
    const estimatedFare = fare || this.calculateEstimatedMinFare(cleanName, pickup);

    let searches = this.getRecentSearches();

    // Deduplicate: filter out previous entry with same destination name
    searches = searches.filter(item => item.name.toLowerCase() !== cleanName.toLowerCase());

    // Insert at beginning of list
    const newItem = {
      id: 'search_' + Date.now(),
      name: cleanName,
      city: cleanCity,
      fare: estimatedFare,
      pickup: pickup || 'Current Location',
      timestamp: Date.now()
    };
    searches.unshift(newItem);

    this.saveRecentSearches(searches);
    this.renderRecentSearches();

    // Cross-Device Sync: Persist to backend database for logged-in accounts
    if (window.RideCompareApi && typeof window.RideCompareApi.saveRecentSearch === 'function') {
      const email = this.userProfile?.email || '';
      if (email && email !== 'guest' && email !== 'guest user') {
        try {
          await window.RideCompareApi.saveRecentSearch({
            name: cleanName,
            city: cleanCity,
            fare: estimatedFare,
            pickup: pickup || 'Current Location'
          });
        } catch (_) {}
      }
    }
  }

  async syncRecentSearchesFromBackend() {
    let email = (this.userProfile && this.userProfile.email) ? this.userProfile.email.toLowerCase().trim() : '';
    if (!email || email === 'guest' || email === 'guest user') {
      try {
        const raw = localStorage.getItem('ridecompare_user_profile');
        if (raw) email = (JSON.parse(raw)?.email || '').toLowerCase().trim();
      } catch (_) {}
    }
    if (!email || email === 'guest' || email === 'guest user') {
      this.renderRecentSearches();
      return;
    }

    if (window.RideCompareApi && typeof window.RideCompareApi.getRecentSearches === 'function') {
      try {
        const backendSearches = await window.RideCompareApi.getRecentSearches(8);
        const localSearches = this.getRecentSearches();

        if (Array.isArray(backendSearches) && backendSearches.length > 0) {
          const merged = [];
          const seen = new Set();
          backendSearches.forEach(bs => {
            const k = (bs.name || '').toLowerCase().trim();
            if (k && !seen.has(k)) {
              seen.add(k);
              merged.push(bs);
            }
          });
          localSearches.forEach(ls => {
            const k = (ls.name || '').toLowerCase().trim();
            if (k && !seen.has(k)) {
              seen.add(k);
              merged.push(ls);
              // Also sync up to cloud so other devices receive it too
              window.RideCompareApi.saveRecentSearch(ls).catch(() => {});
            }
          });
          this.saveRecentSearches(merged.slice(0, 8));
          this.renderRecentSearches();
          return;
        } else if (localSearches.length > 0) {
          // If backend has no searches yet, push local searches to cloud
          for (const ls of localSearches) {
            window.RideCompareApi.saveRecentSearch(ls).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Backend sync recent searches error:', err);
      }
    }
    this.renderRecentSearches();
  }

  clearRecentSearches() {
    try {
      const key = this.getRecentSearchesStorageKey();
      localStorage.removeItem(key);
    } catch (_) {}
    if (window.RideCompareApi && typeof window.RideCompareApi.clearRecentSearches === 'function') {
      window.RideCompareApi.clearRecentSearches().catch(() => {});
    }
    this.renderRecentSearches();
  }

  renderRecentSearches() {
    const listContainer = document.getElementById('home-recent-searches-list');
    const seeAllBtn = document.getElementById('recent-searches-see-all');
    if (!listContainer) return;

    const searches = this.getRecentSearches();

    // Empty state if user has not searched yet
    if (!searches || searches.length === 0) {
      if (seeAllBtn) seeAllBtn.style.display = 'none';
      listContainer.innerHTML = `
        <div class="no-recent-searches-card">
          <div class="no-recent-icon-wrap">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h4 class="no-recent-title">No recent search</h4>
          <p class="no-recent-subtitle">Searches will appear here once you look for rides</p>
        </div>
      `;
      return;
    }

    // When searches exist, reveal "See all" button
    if (seeAllBtn) seeAllBtn.style.display = 'inline-block';

    // Render cards matching exact visual design in media_1791704736834_e094723a.png
    listContainer.innerHTML = searches.map(item => {
      const isHome = item.name.toLowerCase().includes('home');
      const iconSvg = isHome ? `
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      ` : `
        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      `;

      const safeName = item.name.replace(/'/g, "\\'");
      const safeCity = (item.city || '').replace(/'/g, "\\'");

      return `
        <div onclick="app.selectRecent('${safeName}', '${safeCity}')" class="recent-search-item">
          <div class="recent-item-left">
            <div class="recent-icon-badge">
              ${iconSvg}
            </div>
            <div class="recent-item-text">
              <h4 class="recent-item-title">${item.name}</h4>
              <p class="recent-item-subtitle">${item.city}</p>
            </div>
          </div>
          <span class="recent-fare-tag">${item.fare}</span>
        </div>
      `;
    }).join('');
  }

  // Selecting a Recent Search Item
  selectRecent(name, city) {
    if (window.soundFX) {
      window.soundFX.playTap();
    }

    this.selectedDestination = `${name}, ${city}`;
    this.selectedDropName = name;
    this.selectedDropSub = city;
    this.hasDropSelected = true;

    // Update Drop Location Card text on Home Screen
    const dropText = document.getElementById('home-drop-text');
    if (dropText) {
      dropText.textContent = name;
      dropText.classList.remove('placeholder');
      dropText.title = city;
    }

    // Ensure pickup is selected so search is ready
    if (!this.hasPickupSelected) {
      this.hasPickupSelected = true;
      this.pickupLocationName = 'Current Location';
      const pickupText = document.getElementById('home-pickup-text');
      if (pickupText) {
        pickupText.textContent = 'Current Location';
        pickupText.classList.remove('placeholder');
      }
    }

    this.updateResultsMapRoute();

    const panel = document.getElementById('home-results-panel');
    if (panel && panel.classList.contains('results-panel-visible')) {
      this.showToast(`Updated destination: ${name} 📍`);
      this.showResultsPanel();
    } else {
      this.showToast(`Selected: ${name} 📍`);
    }
  }

  // Primary "Search Rides" Click Handler — Validates pickup & drop selection before revealing comparison
  onSearchRides() {
    if (this.isCurrentlyOffline) {
      this.handleConnectivityChange(false);
      return;
    }

    const pickupText = document.getElementById('home-pickup-text');
    const dropText = document.getElementById('home-drop-text');
    const pickupCard = document.getElementById('home-pickup-card');
    const dropCard = document.getElementById('home-drop-card');

    const isPickupPlaceholder = !pickupText || pickupText.classList.contains('placeholder') || pickupText.textContent.trim() === 'Select pickup location';
    const isDropPlaceholder = !dropText || dropText.classList.contains('placeholder') || dropText.textContent.trim() === 'Select destination';

    const isPickupSelected = this.hasPickupSelected && !isPickupPlaceholder && (this.pickupLocationName || '').trim().length > 0;
    const isDropSelected = this.hasDropSelected && !isDropPlaceholder && (this.selectedDropName || '').trim().length > 0;

    // Case 1: NEITHER Pickup NOR Drop is selected
    if (!isPickupSelected && !isDropSelected) {
      if (window.soundFX && typeof window.soundFX.playError === 'function') {
        window.soundFX.playError();
      } else if (window.soundFX) {
        window.soundFX.playTap();
      }

      this.highlightCardAttention(pickupCard, 'pickup');
      this.highlightCardAttention(dropCard, 'drop');

      this.autoChainToDrop = true;
      this.openLocationPicker('pickup');
      return;
    }

    // Case 2: Pickup is missing
    if (!isPickupSelected) {
      if (window.soundFX && typeof window.soundFX.playError === 'function') {
        window.soundFX.playError();
      } else if (window.soundFX) {
        window.soundFX.playTap();
      }

      this.highlightCardAttention(pickupCard, 'pickup');
      this.autoChainToDrop = false;
      this.openLocationPicker('pickup');
      return;
    }

    // Case 3: Drop is missing
    if (!isDropSelected) {
      if (window.soundFX && typeof window.soundFX.playError === 'function') {
        window.soundFX.playError();
      } else if (window.soundFX) {
        window.soundFX.playTap();
      }

      this.highlightCardAttention(dropCard, 'drop');
      this.autoChainToDrop = false;
      this.openLocationPicker('drop');
      return;
    }

    // Case 4: BOTH locations are selected! Proceed to comparison view
    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }

    this.updateResultsMapRoute();
    this.showResultsPanel();

    // Register search into Recent Searches
    const searchedDrop = (this.selectedDropName || '').trim() || (dropText ? dropText.textContent.trim() : '');
    const searchedSub = (this.selectedDropSub || '').trim() || 'Kolhapur';
    const searchedPickup = (this.pickupLocationName || '').trim() || (pickupText ? pickupText.textContent.trim() : 'Current Location');
    if (searchedDrop && searchedDrop !== 'Select destination' && searchedDrop !== 'Select drop location') {
      this.addRecentSearch(searchedDrop, searchedSub, null, searchedPickup);
    }
  }

  // Updates the live route map header, subtitle, and pin badges to match selected pickup & drop locations
  updateResultsMapRoute() {
    const pickupText = document.getElementById('home-pickup-text');
    const dropText = document.getElementById('home-drop-text');

    let pickupName = (this.pickupLocationName || '').trim();
    if (!pickupName && pickupText && !pickupText.classList.contains('placeholder')) {
      pickupName = pickupText.textContent.trim();
    }
    if (!pickupName || pickupName === 'Select pickup location') {
      pickupName = 'Current Location';
    }

    let dropName = (this.selectedDropName || '').trim();
    if (!dropName && dropText && !dropText.classList.contains('placeholder')) {
      dropName = dropText.textContent.trim();
    }
    if (!dropName || dropName === 'Select drop location') {
      dropName = 'Destination';
    }

    // 1. Update Map Header Title
    const mapTitle = document.getElementById('map-route-title');
    if (mapTitle) {
      mapTitle.textContent = `${pickupName} ➔ ${dropName}`;
      mapTitle.title = `${pickupName} ➔ ${dropName}`;
    }

    // 2. Update Map Header Subtitle
    const mapSub = document.getElementById('map-route-sub');
    if (mapSub) {
      const dropDetail = this.selectedDropSub || dropName;
      mapSub.textContent = `Destination: ${dropDetail} • Live comparison updated`;
      mapSub.title = `Destination: ${dropDetail}`;
    }

    // 3. Update Pickup Marker Badge on Map Canvas
    const pickupBadge = document.getElementById('map-pickup-badge');
    if (pickupBadge) {
      pickupBadge.textContent = pickupName;
      pickupBadge.title = `Pickup: ${this.pickupLocationFull || pickupName}`;
    }

    // 4. Update Destination Marker Badge on Map Canvas
    const dropBadge = document.getElementById('map-drop-badge');
    if (dropBadge) {
      dropBadge.textContent = dropName;
      dropBadge.title = `Destination: ${this.selectedDropSub ? `${dropName}, ${this.selectedDropSub}` : dropName}`;
    }

    if (this.resultsMap) {
      this.renderLiveRoute();
    }
  }

  // Visual attention animation for unselected cards
  highlightCardAttention(card, type) {
    if (!card) return;
    const animClass = type === 'drop' ? 'card-attention-drop' : 'card-attention-pickup';
    card.classList.remove('card-attention-pickup', 'card-attention-drop');
    void card.offsetWidth; // Reflow to restart animation
    card.classList.add(animClass);
    setTimeout(() => {
      card.classList.remove(animClass);
    }, 1000);
  }

  // Smooth Reveal of Results Panel (Map + comparison cards)
  showResultsPanel() {
    this.updateResultsMapRoute();
    this.initResultsLiveMap();
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
  }

  // =========================================================================
  // LIVE REAL-TIME LEAFLET RESULTS MAP WITH DRIVING ROUTE POLYLINE
  // =========================================================================
  initResultsLiveMap() {
    if (typeof L === 'undefined') {
      console.warn('Leaflet library is not loaded');
      return;
    }

    const container = document.getElementById('results-live-leaflet-map');
    if (!container) return;

    const isDark = document.body.classList.contains('theme-dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';

    const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const darkTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    const tileUrl = isDark ? darkTileUrl : lightTileUrl;
    const subdomains = isDark ? ['server', 'services'] : ['a', 'b', 'c'];

    if (!this.resultsMap) {
      this.resultsMap = L.map('results-live-leaflet-map', {
        zoomControl: false,
        attributionControl: false
      }).setView([16.7050, 74.2433], 13);

      this.resultsTileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: subdomains
      }).addTo(this.resultsMap);

      L.control.zoom({ position: 'topright' }).addTo(this.resultsMap);
    } else {
      if (this.resultsTileLayer) {
        this.resultsTileLayer.setUrl(tileUrl);
      }
    }

    this.renderLiveRoute();

    setTimeout(() => {
      if (this.resultsMap) {
        this.resultsMap.invalidateSize();
      }
    }, 250);
  }

  recenterResultsMap() {
    if (this.currentRouteBounds && this.resultsMap) {
      this.resultsMap.fitBounds(this.currentRouteBounds, { padding: [70, 70], maxZoom: 16 });
    }
  }

  getCoordinatesFor(name, fallbackCoords) {
    if (!name) return fallbackCoords;
    const clean = name.toLowerCase().trim();
    const found = KNOWN_LOCATIONS.find(loc => {
      const locClean = loc.name.toLowerCase();
      return locClean === clean || 
             locClean.includes(clean) || 
             clean.includes(locClean) || 
             (loc.tags && loc.tags.some(t => clean.includes(t.toLowerCase())));
    });
    if (found) {
      return { lat: found.lat, lng: found.lng };
    }
    return fallbackCoords;
  }

  async renderLiveRoute() {
    if (!this.resultsMap || typeof L === 'undefined') return;

    const pickupText = document.getElementById('home-pickup-text');
    const dropText = document.getElementById('home-drop-text');

    let pickupName = (this.pickupLocationName || '').trim();
    if (!pickupName && pickupText && !pickupText.classList.contains('placeholder')) {
      pickupName = pickupText.textContent.trim();
    }
    if (!pickupName || pickupName === 'Select pickup location') {
      pickupName = 'Sanjay Ghodawat University';
    }

    let dropName = (this.selectedDropName || '').trim();
    if (!dropName && dropText && !dropText.classList.contains('placeholder')) {
      dropName = dropText.textContent.trim();
    }
    if (!dropName || dropName === 'Select drop location') {
      dropName = 'Aastha Hospital';
    }

    const pickupCoords = this.pickupCoords || this.getCoordinatesFor(pickupName, { lat: 16.7450, lng: 74.3720 });
    const dropCoords = this.selectedDropCoords || this.getCoordinatesFor(dropName, { lat: 16.7020, lng: 74.2460 });

    const mapTitle = document.getElementById('map-route-title');
    if (mapTitle) {
      mapTitle.textContent = `${pickupName} ➔ ${dropName}`;
      mapTitle.title = `${pickupName} ➔ ${dropName}`;
    }

    // Clear previous route layers & markers
    if (this.resultsRouteLayers) {
      this.resultsRouteLayers.forEach(l => {
        try { this.resultsMap.removeLayer(l); } catch (e) {}
      });
    }
    this.resultsRouteLayers = [];

    // 1. Pickup Marker (Radar Blue Pulse + Callout)
    const pickupIcon = L.divIcon({
      className: 'custom-live-map-marker',
      html: `
        <div class="live-map-marker-wrap pickup-marker-wrap">
          <div class="marker-pulse-ring"></div>
          <div class="marker-core-dot"></div>
          <div id="map-pickup-badge" class="marker-callout-badge marker-pickup-badge" title="${pickupName}">
            <span class="marker-dot-blue"></span>
            <span class="truncate">${pickupName}</span>
          </div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon }).addTo(this.resultsMap);
    this.resultsRouteLayers.push(pickupMarker);

    // 2. Drop Marker (Red Pin + Callout)
    const dropIcon = L.divIcon({
      className: 'custom-live-map-marker',
      html: `
        <div class="live-map-marker-wrap drop-marker-wrap">
          <div class="marker-pin-head">
            <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          </div>
          <div id="map-drop-badge" class="marker-callout-badge marker-drop-badge" title="${dropName}">
            <span class="marker-dot-red"></span>
            <span class="truncate">${dropName}</span>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const dropMarker = L.marker([dropCoords.lat, dropCoords.lng], { icon: dropIcon }).addTo(this.resultsMap);
    this.resultsRouteLayers.push(dropMarker);

    // 3. Fetch OSRM Live Driving Route
    let routeLatLngs = [];
    let distanceKm = null;
    let durationMins = null;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${dropCoords.lng},${dropCoords.lat}?overview=full&geometries=geojson`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          routeLatLngs = route.geometry.coordinates.map(pt => [pt[1], pt[0]]);
          distanceKm = (route.distance / 1000).toFixed(1);
          durationMins = Math.max(1, Math.round(route.duration / 60));
        }
      }
    } catch (e) {
      console.warn('OSRM route fetch failed, using fallback curve', e);
    }

    if (!routeLatLngs || routeLatLngs.length === 0) {
      routeLatLngs = this.generateFallbackRoute(pickupCoords, dropCoords);
      const dist = this.calculateHaversineDistance(pickupCoords.lat, pickupCoords.lng, dropCoords.lat, dropCoords.lng);
      distanceKm = dist.toFixed(1);
      durationMins = Math.max(5, Math.round(dist * 2.2));
    }

    const distBadge = document.getElementById('map-route-distance-badge');
    if (distBadge && distanceKm) {
      distBadge.textContent = `${distanceKm} km`;
    }

    const mapSub = document.getElementById('map-route-sub');
    if (mapSub) {
      const detail = this.selectedDropSub || dropName;
      mapSub.textContent = `Destination: ${detail} • ${distanceKm} km (${durationMins} min) • Live route active`;
    }

    // 4. Draw Route Polylines
    const glowLine = L.polyline(routeLatLngs, {
      color: '#0073FF',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.resultsMap);
    this.resultsRouteLayers.push(glowLine);

    const liveLine = L.polyline(routeLatLngs, {
      color: '#0073FF',
      weight: 4.5,
      opacity: 0.95,
      className: 'map-live-route-dash',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.resultsMap);
    this.resultsRouteLayers.push(liveLine);

    // 5. Place Moving Vehicle Markers Along Route
    if (routeLatLngs.length >= 4) {
      const p1 = routeLatLngs[Math.floor(routeLatLngs.length * 0.25)];
      const p2 = routeLatLngs[Math.floor(routeLatLngs.length * 0.50)];
      const p3 = routeLatLngs[Math.floor(routeLatLngs.length * 0.75)];

      const v1 = L.marker(p1, {
        icon: L.divIcon({ className: '', html: '<div class="live-vehicle-marker-icon" title="Ola Auto (4 min)">🛺</div>', iconSize: [32, 32], iconAnchor: [16, 16] })
      }).addTo(this.resultsMap);

      const v2 = L.marker(p2, {
        icon: L.divIcon({ className: '', html: '<div class="live-vehicle-marker-icon" title="Uber Go (3 min)">🚗</div>', iconSize: [32, 32], iconAnchor: [16, 16] })
      }).addTo(this.resultsMap);

      const v3 = L.marker(p3, {
        icon: L.divIcon({ className: '', html: '<div class="live-vehicle-marker-icon" title="Rapido Bike (2 min)">🏍️</div>', iconSize: [32, 32], iconAnchor: [16, 16] })
      }).addTo(this.resultsMap);

      this.resultsRouteLayers.push(v1, v2, v3);
    }

    // 6. Fit Map Bounds
    const bounds = L.latLngBounds(routeLatLngs);
    this.currentRouteBounds = bounds;
    this.resultsMap.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
  }

  generateFallbackRoute(start, end) {
    const points = [];
    const steps = 24;
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    const offset = 0.008;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = (1 - t) * (1 - t) * start.lat + 2 * (1 - t) * t * (midLat + offset) + t * t * end.lat;
      const lng = (1 - t) * (1 - t) * start.lng + 2 * (1 - t) * t * (midLng - offset) + t * t * end.lng;
      points.push([lat, lng]);
    }
    return points;
  }

  calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

  // =========================================================================
  // =========================================================================
  // LOCATION PICKERS (GPS Current Location + Interactive Map Selection)
  // Supports both Pickup Location and Drop Location modes seamlessly
  // =========================================================================

  // Location Picker Dispatcher (Pickup or Drop)
  openLocationPicker(type) {
    if (window.soundFX && typeof window.soundFX.playTap === 'function') {
      window.soundFX.playTap();
    }
    this.locationPickerMode = (type === 'pickup') ? 'pickup' : 'drop';
    this.openLocationMapModal(this.locationPickerMode);
  }

  // Legacy / Direct Call Aliases
  openDropMapModal() {
    this.openLocationPicker('drop');
  }

  openPickupMapModal() {
    this.openLocationPicker('pickup');
  }

  closeLocationMapModal() {
    if (window.soundFX && typeof window.soundFX.playTap === 'function') {
      window.soundFX.playTap();
    }
    const modal = document.getElementById('drop-location-map-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  closeDropMapModal() {
    this.closeLocationMapModal();
  }

  // -------------------------------------------------------------------------
  // 1. OPEN MAP MODAL & CONFIGURE MODE (Pickup vs Drop)
  // -------------------------------------------------------------------------
  openLocationMapModal(mode = 'pickup') {
    this.locationPickerMode = mode;
    const modal = document.getElementById('drop-location-map-modal');
    if (!modal) return;

    modal.classList.add('show');
    modal.classList.remove('opacity-0', 'pointer-events-none');

    const titleEl = document.getElementById('location-modal-title');
    const subtitleEl = document.getElementById('location-modal-subtitle');
    const iconBox = document.getElementById('location-modal-icon-box');
    const searchInput = document.getElementById('drop-map-search-input');
    const hintText = document.getElementById('location-modal-hint-text');
    const hintDot = document.getElementById('location-modal-hint-dot');
    const targetBadge = document.getElementById('location-modal-target-badge');
    const previewIcon = document.getElementById('location-modal-preview-icon');
    const selectedTitle = document.getElementById('drop-modal-selected-title');
    const selectedSub = document.getElementById('drop-modal-selected-sub');
    const confirmBtnText = document.getElementById('location-modal-confirm-btn-text');

    if (mode === 'pickup') {
      this.tempSelectedName = this.pickupLocationName || 'Current Location';
      this.tempSelectedSub = this.pickupLocationFull || 'Your detected position';
      this.tempSelectedCoords = this.pickupCoords || this.userCoords || { lat: 16.7050, lng: 74.2433 };

      if (titleEl) titleEl.textContent = 'Select Pickup Location';
      if (subtitleEl) subtitleEl.textContent = 'Choose on map, search address, or use current GPS';
      if (iconBox) {
        iconBox.className = 'w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500';
      }
      if (searchInput) {
        searchInput.placeholder = 'Search pickup address, landmark, college...';
        searchInput.value = '';
      }
      if (hintText) hintText.textContent = 'Tap anywhere on map to pin pickup point';
      if (hintDot) {
        hintDot.className = 'w-2 h-2 rounded-full bg-blue-500 animate-ping';
      }
      if (targetBadge) targetBadge.textContent = 'TARGET PICKUP';
      if (previewIcon) {
        previewIcon.className = 'w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 flex-shrink-0';
      }
      if (confirmBtnText) confirmBtnText.textContent = 'Select Pickup Location';

      this.renderLocationPresets('pickup');
    } else {
      this.tempSelectedName = this.selectedDropName || 'Sanjay Ghodawat University';
      this.tempSelectedSub = this.selectedDropSub || 'Kolhapur-Sangli Highway, Atigre';
      this.tempSelectedCoords = this.selectedDropCoords || { lat: 16.7450, lng: 74.3720 };

      if (titleEl) titleEl.textContent = 'Select Drop Location';
      if (subtitleEl) subtitleEl.textContent = 'Click anywhere on the map or pick a destination';
      if (iconBox) {
        iconBox.className = 'w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400';
      }
      if (searchInput) {
        searchInput.placeholder = 'Search destination address, college, landmark...';
        searchInput.value = '';
      }
      if (hintText) hintText.textContent = 'Tap anywhere on map to pin destination';
      if (hintDot) {
        hintDot.className = 'w-2 h-2 rounded-full bg-red-500 animate-ping';
      }
      if (targetBadge) targetBadge.textContent = 'TARGET DESTINATION';
      if (previewIcon) {
        previewIcon.className = 'w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0';
      }
      if (confirmBtnText) confirmBtnText.textContent = 'Select Drop Location';

      this.renderLocationPresets('drop');
    }

    if (selectedTitle) selectedTitle.textContent = this.tempSelectedName;
    if (selectedSub) selectedSub.textContent = this.tempSelectedSub;

    // Initialize or refresh map with appropriate pin color
    this.initDropMap();
  }

  // -------------------------------------------------------------------------
  // 2. RENDER PRESET DESTINATIONS ACCORDING TO MODE
  // -------------------------------------------------------------------------
  renderLocationPresets(mode) {
    const container = document.getElementById('location-modal-presets');
    if (!container) return;

    if (mode === 'pickup') {
      container.innerHTML = `
        <button type="button" id="btn-modal-preset-gps" onclick="app.fetchCurrentLocationInModal()" class="drop-preset-pill btn-modal-preset-gps px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-blue-600 text-white border border-blue-500 hover:bg-blue-700 transition-all flex items-center gap-1.5">
          <span class="gps-preset-dot w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span class="gps-preset-text">📍 Current Location (GPS)</span>
        </button>
        <button type="button" onclick="app.selectLocationPreset('Sanjay Ghodawat University', 'Kolhapur-Sangli Highway, Atigre', 16.7450, 74.3720)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🎓 Sanjay Ghodawat University
        </button>
        <button type="button" onclick="app.selectLocationPreset('Kolhapur Railway Station', 'Station Road, Shahupuri', 16.7028, 74.2405)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🚉 Railway Station
        </button>
        <button type="button" onclick="app.selectLocationPreset('Shri Ambabai Mahalaxmi Temple', 'Bhavani Mandap, Kolhapur', 16.6946, 74.2238)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🏛️ Mahalaxmi Temple
        </button>
        <button type="button" onclick="app.selectLocationPreset('Rankala Lake', 'Promenade, Kolhapur', 16.6894, 74.2144)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🌊 Rankala Lake
        </button>
        <button type="button" onclick="app.selectLocationPreset('DY Patil College', 'Kasaba Bawada, Kolhapur', 16.7212, 74.2541)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🏢 DY Patil College
        </button>
        <button type="button" onclick="app.selectLocationPreset('Home (Ichalkaranji)', 'Main Road, Ichalkaranji', 16.6965, 74.4628)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🏠 Home
        </button>
      `;
    } else {
      container.innerHTML = `
        <button type="button" onclick="app.selectLocationPreset('Sanjay Ghodawat University', 'Kolhapur-Sangli Highway, Atigre', 16.7450, 74.3720)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600 hover:text-white transition-all">
          🎓 Sanjay Ghodawat University
        </button>
        <button type="button" onclick="app.selectLocationPreset('Shri Ambabai Mahalaxmi Temple', 'Bhavani Mandap, Kolhapur', 16.6946, 74.2238)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🏛️ Mahalaxmi Temple
        </button>
        <button type="button" onclick="app.selectLocationPreset('Kolhapur Railway Station', 'Station Road, Shahupuri', 16.7028, 74.2405)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🚉 Railway Station
        </button>
        <button type="button" onclick="app.selectLocationPreset('Rankala Lake', 'Promenade, Kolhapur', 16.6894, 74.2144)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🌊 Rankala Lake
        </button>
        <button type="button" onclick="app.selectLocationPreset('DY Patil College', 'Kasaba Bawada, Kolhapur', 16.7212, 74.2541)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🏢 DY Patil College
        </button>
        <button type="button" onclick="app.selectLocationPreset('Pune Junction', 'Agarkar Nagar, Pune', 18.5284, 73.8739)" class="drop-preset-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all">
          🚉 Pune Junction
        </button>
      `;
    }
  }

  // -------------------------------------------------------------------------
  // 3. MAP INITIALIZATION & PIN ICON LOGIC
  // -------------------------------------------------------------------------
  getPinIcon(color = '#0073FF') {
    const pinIconHtml = `
      <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center;">
        <div style="background: ${color}; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px ${color}88; border: 2.5px solid #FFFFFF;">
          <div style="width: 10px; height: 10px; background: #FFFFFF; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
        <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.35); border-radius: 50%; margin-top: 2px; filter: blur(1px);"></div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-location-pin-marker',
      html: pinIconHtml,
      iconSize: [34, 42],
      iconAnchor: [17, 40]
    });
  }

  initDropMap() {
    if (typeof L === 'undefined') {
      console.warn('Leaflet library is not loaded');
      return;
    }

    const mapContainer = document.getElementById('drop-picker-leaflet-map');
    if (!mapContainer) return;

    const isPickup = (this.locationPickerMode === 'pickup');
    const pinColor = isPickup ? '#0073FF' : '#EF4444';
    const coords = this.tempSelectedCoords || (isPickup ? (this.pickupCoords || { lat: 16.7050, lng: 74.2433 }) : (this.selectedDropCoords || { lat: 16.7450, lng: 74.3720 }));
    const currentIcon = this.getPinIcon(pinColor);

    if (!this.dropMap) {
      this.dropMap = L.map('drop-picker-leaflet-map', {
        zoomControl: true,
        attributionControl: false
      }).setView([coords.lat, coords.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(this.dropMap);

      this.dropMarker = L.marker([coords.lat, coords.lng], {
        icon: currentIcon,
        draggable: true
      }).addTo(this.dropMap);

      this.dropMarker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        this.onDropMapClick(pos);
      });

      this.dropMap.on('click', (e) => {
        this.onDropMapClick(e.latlng);
      });
    } else {
      this.dropMap.setView([coords.lat, coords.lng], 14);
      if (this.dropMarker) {
        this.dropMarker.setIcon(currentIcon);
        this.dropMarker.setLatLng([coords.lat, coords.lng]);
      }
    }

    setTimeout(() => {
      if (this.dropMap) {
        this.dropMap.invalidateSize();
      }
    }, 250);
  }

  async onDropMapClick(latlng) {
    if (window.soundFX && typeof window.soundFX.playTap === 'function') {
      window.soundFX.playTap();
    }
    const lat = latlng.lat;
    const lng = latlng.lng;

    this.tempSelectedCoords = { lat, lng };

    if (this.dropMarker) {
      this.dropMarker.setLatLng([lat, lng]);
    }
    if (this.dropMap) {
      this.dropMap.panTo([lat, lng]);
    }

    const titleEl = document.getElementById('drop-modal-selected-title');
    const subEl = document.getElementById('drop-modal-selected-sub');
    if (titleEl) titleEl.textContent = 'Locating pinned point...';
    if (subEl) subEl.textContent = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    // Reset preset pill highlights
    document.querySelectorAll('.drop-preset-pill').forEach(pill => {
      pill.classList.remove('bg-blue-600', 'text-white', 'border-blue-500', 'active');
      pill.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-700');
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' }
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const a = data.address;
          const name = a.amenity || a.building || a.shop || a.tourism || a.road || a.suburb || a.neighbourhood || a.village || a.city_district || 'Pinned Location';
          const locality = a.city || a.town || a.county || a.state_district || a.state || '';
          const full = [name, a.suburb, locality].filter(Boolean).join(', ') || data.display_name?.split(',').slice(0, 3).join(',') || '';

          this.tempSelectedName = name;
          this.tempSelectedSub = full || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        } else if (data && data.display_name) {
          const parts = data.display_name.split(',');
          this.tempSelectedName = parts[0].trim();
          this.tempSelectedSub = parts.slice(1, 4).join(',').trim();
        } else {
          this.tempSelectedName = 'Pinned Location';
          this.tempSelectedSub = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
      } else {
        this.tempSelectedName = 'Pinned Location';
        this.tempSelectedSub = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    } catch (e) {
      this.tempSelectedName = 'Pinned Location';
      this.tempSelectedSub = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    if (titleEl) titleEl.textContent = this.tempSelectedName;
    if (subEl) subEl.textContent = this.tempSelectedSub;
  }

  selectLocationPreset(name, address, lat, lng) {
    this.navigateToLocation(name, address, lat, lng, true);
  }

  selectDropMapPreset(name, address, lat, lng) {
    this.navigateToLocation(name, address, lat, lng, true);
  }

  // Smoothly navigates the Leaflet map and moves the map marker icon to target coordinates
  navigateToLocation(name, address, lat, lng, updateInput = true) {
    if (window.soundFX && typeof window.soundFX.playTap === 'function') {
      window.soundFX.playTap();
    }
    this.tempSelectedCoords = { lat, lng };
    this.tempSelectedName = name;
    this.tempSelectedSub = address;

    const titleEl = document.getElementById('drop-modal-selected-title');
    const subEl = document.getElementById('drop-modal-selected-sub');
    if (titleEl) titleEl.textContent = name;
    if (subEl) subEl.textContent = address;

    if (updateInput) {
      const searchInput = document.getElementById('drop-map-search-input');
      if (searchInput) searchInput.value = name;
      const clearBtn = document.getElementById('btn-clear-map-search');
      if (clearBtn) clearBtn.classList.remove('hidden');
    }

    this.hideSearchSuggestions();

    // Smoothly fly map to location
    if (this.dropMap) {
      if (typeof this.dropMap.flyTo === 'function') {
        this.dropMap.flyTo([lat, lng], 16, {
          animate: true,
          duration: 1.1,
          easeLinearity: 0.25
        });
      } else {
        this.dropMap.setView([lat, lng], 16);
      }
    }

    // Move marker and trigger bounce animation
    if (this.dropMarker) {
      this.dropMarker.setLatLng([lat, lng]);
      const markerEl = this.dropMarker.getElement();
      if (markerEl) {
        markerEl.classList.remove('pin-bounce-navigate');
        void markerEl.offsetWidth; // force DOM reflow
        markerEl.classList.add('pin-bounce-navigate');
      }
    }

    // Update preset pills active highlight
    document.querySelectorAll('.drop-preset-pill').forEach(pill => {
      const match = pill.textContent.includes(name.split(' ')[0]) || pill.textContent.includes(name);
      if (match) {
        pill.classList.remove('bg-slate-800', 'text-slate-300', 'border-slate-700', 'bg-blue-600/20', 'text-blue-300', 'border-blue-500/40');
        pill.classList.add('bg-blue-600', 'text-white', 'border-blue-500', 'active');
      } else {
        pill.classList.remove('bg-blue-600', 'text-white', 'border-blue-500', 'active');
        pill.classList.add('bg-slate-800', 'text-slate-300', 'border-slate-700');
      }
    });

    this.showToast('📍 Navigated map to ' + name);
  }

  // Searches known local directory with fuzzy matching
  searchKnownLocations(query) {
    if (!query) return [];
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    return KNOWN_LOCATIONS.filter(item => {
      const nameL = item.name.toLowerCase();
      const addrL = item.address.toLowerCase();
      const tagsL = (item.tags || []).join(' ').toLowerCase();
      const haystack = nameL + ' ' + addrL + ' ' + tagsL;

      return tokens.every(token => haystack.includes(token));
    }).slice(0, 6);
  }

  // Live input handler when user types in search box
  onDropMapSearch(query) {
    clearTimeout(this.dropSearchDebounce);
    const q = (query || '').trim();
    const clearBtn = document.getElementById('btn-clear-map-search');
    if (clearBtn) {
      if (q.length > 0) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }

    if (!q || q.length < 2) {
      this.hideSearchSuggestions();
      return;
    }

    // 1. Instant local matching
    const localMatches = this.searchKnownLocations(q);
    if (localMatches.length > 0) {
      this.showSearchSuggestions(localMatches);
    }

    // 2. Query Nominatim in background with debounce to complement results
    this.dropSearchDebounce = setTimeout(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(
          'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(q) + '&limit=4&addressdetails=1',
          {
            signal: controller.signal,
            headers: { 'Accept-Language': 'en' }
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const results = await response.json();
          if (results && results.length > 0) {
            const onlineMatches = results.map(item => {
              const parts = (item.display_name || '').split(',');
              const name = parts[0].trim();
              const sub = parts.slice(1, 4).join(',').trim();
              return {
                name: name,
                address: sub || item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
              };
            });

            // Merge local and online matches without exact duplicates
            const combined = [...localMatches];
            for (const om of onlineMatches) {
              const exists = combined.some(c => 
                c.name.toLowerCase() === om.name.toLowerCase() ||
                (Math.abs(c.lat - om.lat) < 0.005 && Math.abs(c.lng - om.lng) < 0.005)
              );
              if (!exists && combined.length < 7) {
                combined.push(om);
              }
            }

            this.showSearchSuggestions(combined);
          }
        }
      } catch (e) {
        if (localMatches.length > 0) {
          this.showSearchSuggestions(localMatches);
        }
      }
    }, 380);
  }

  // Performs immediate search (on Enter key or "Go" button click)
  async performLocationSearch(query) {
    const q = (query || '').trim();
    if (!q) {
      this.showToast('Please type a location name or address', 'warning');
      return;
    }

    this.hideSearchSuggestions();
    this.showToast('🔍 Searching "' + q + '"...');

    // 1. Check local directory first
    const localMatches = this.searchKnownLocations(q);
    if (localMatches.length > 0) {
      const topMatch = localMatches[0];
      this.navigateToLocation(topMatch.name, topMatch.address, topMatch.lat, topMatch.lng, true);
      return;
    }

    // 2. Fetch from Nominatim if not found locally
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(
        'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(q) + '&limit=1&addressdetails=1',
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' }
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const parts = item.display_name.split(',');
          const name = parts[0].trim();
          const sub = parts.slice(1, 4).join(',').trim();
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          this.navigateToLocation(name, sub || item.display_name, lat, lng, true);
          return;
        }
      }
    } catch (e) {
      console.warn('Geocoding error', e);
    }

    this.showToast('Could not find "' + q + '". Please tap the map or choose a nearby landmark.', 'warning');
  }

  // Displays autocomplete suggestions dropdown
  showSearchSuggestions(suggestions) {
    const container = document.getElementById('drop-map-search-suggestions');
    if (!container || !suggestions || suggestions.length === 0) {
      this.hideSearchSuggestions();
      return;
    }

    container.innerHTML = suggestions.map(item => {
      const safeName = item.name.replace(/'/g, "\\'");
      const safeAddr = (item.address || '').replace(/'/g, "\\'");
      return '<div onclick="app.navigateToLocation(\'' + safeName + '\', \'' + safeAddr + '\', ' + item.lat + ', ' + item.lng + ', true)" class="search-suggestion-item">' +
        '<div class="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center flex-shrink-0">' +
          '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>' +
        '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="search-suggestion-title truncate">' + item.name + '</div>' +
          '<div class="search-suggestion-sub truncate">' + item.address + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    container.classList.remove('hidden');
  }

  hideSearchSuggestions() {
    const container = document.getElementById('drop-map-search-suggestions');
    if (container) container.classList.add('hidden');
  }

  clearMapSearch() {
    const searchInput = document.getElementById('drop-map-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    const clearBtn = document.getElementById('btn-clear-map-search');
    if (clearBtn) clearBtn.classList.add('hidden');
    this.hideSearchSuggestions();
  }

  centerDropMapOnUser() {
    if (window.soundFX && typeof window.soundFX.playTap === 'function') {
      window.soundFX.playTap();
    }
    if (this.userCoords) {
      this.navigateToLocation(
        'Current Location',
        this.pickupLocationFull || 'Your detected position',
        this.userCoords.lat,
        this.userCoords.lng,
        true
      );
      this.showToast('Centered on your current GPS location 📍');
      return;
    }

    if (navigator.geolocation) {
      this.showToast('📡 Locating your GPS position...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.userCoords = { lat, lng };
          this.navigateToLocation('Current Location', 'GPS Detected Position', lat, lng, true);
        },
        () => {
          this.showToast('Could not access GPS location', 'warning');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }

  async fetchCurrentLocationInModal() {
    if (window.soundFX && typeof window.soundFX.playTap === 'function') {
      window.soundFX.playTap();
    }
    const titleEl = document.getElementById('drop-modal-selected-title');
    const subEl = document.getElementById('drop-modal-selected-sub');
    if (titleEl) titleEl.textContent = '📍 Locating GPS...';
    if (subEl) subEl.textContent = 'Detecting current position...';

    if (!navigator.geolocation) {
      this.showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);
        this.userCoords = { lat, lng, accuracy };

        let name = 'Current Location';
        let detail = 'GPS Coordinates: ' + lat.toFixed(4) + ', ' + lng.toFixed(4);
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);
          const res = await fetch(
            'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&zoom=18&addressdetails=1',
            { signal: controller.signal, headers: { 'Accept-Language': 'en' } }
          );
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const a = data.address;
              name = a.amenity || a.building || a.shop || a.road || a.suburb || a.neighbourhood || a.village || a.city_district || 'Current Location';
              const secondary = a.city || a.town || a.county || a.state_district || a.state || '';
              detail = (secondary && secondary !== name) ? name + ', ' + secondary : (data.display_name ? data.display_name.split(',').slice(0, 3).join(',') : name);
            }
          }
        } catch (e) {}

        this.navigateToLocation(name, detail, lat, lng, true);
        this.showToast('📍 Located: ' + name + ' (±' + accuracy + 'm)', 'success');
      },
      () => {
        this.showToast('Could not access GPS location', 'warning');
        if (titleEl) titleEl.textContent = this.pickupLocationName || 'Current Location';
        if (subEl) subEl.textContent = this.pickupLocationFull || 'Default Location';
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  // -------------------------------------------------------------------------
  // 4. CONFIRMATION HANDLERS (Pickup vs Drop)
  // -------------------------------------------------------------------------
  confirmLocationSelection() {
    if (this.locationPickerMode === 'pickup') {
      this.confirmPickupLocation();
    } else {
      this.confirmDropLocation();
    }
  }

  confirmPickupLocation() {
    if (window.soundFX) {
      if (typeof window.soundFX.playConfirm === 'function') {
        window.soundFX.playConfirm();
      } else if (typeof window.soundFX.playTap === 'function') {
        window.soundFX.playTap();
      }
    }

    const selectedName = this.tempSelectedName || this.pickupLocationName || 'Current Location';
    const selectedSub = this.tempSelectedSub || this.pickupLocationFull || 'Your Location';

    this.pickupLocationName = selectedName;
    this.pickupLocationFull = selectedSub;
    this.hasPickupSelected = true;
    if (this.tempSelectedCoords) {
      this.pickupCoords = this.tempSelectedCoords;
    }

    // Update Pickup Card on Home Screen
    const pickupText = document.getElementById('home-pickup-text');
    if (pickupText) {
      pickupText.textContent = selectedName;
      pickupText.title = selectedSub;
      pickupText.classList.remove('placeholder');
      pickupText.classList.remove('animate-pulse');
    }

    this.updateResultsMapRoute();

    this.closeLocationMapModal();
    this.showToast(`Pickup location set: ${selectedName} 📍`, 'success');

    // If Search was initiated without either location, auto-chain to drop location
    if (this.autoChainToDrop && (!this.hasDropSelected || !this.selectedDropName)) {
      this.autoChainToDrop = false;
      setTimeout(() => {
        this.openLocationPicker('drop');
      }, 250);
      return;
    }
    this.autoChainToDrop = false;
  }

  confirmDropLocation() {
    if (window.soundFX) {
      if (typeof window.soundFX.playConfirm === 'function') {
        window.soundFX.playConfirm();
      } else if (typeof window.soundFX.playTap === 'function') {
        window.soundFX.playTap();
      }
    }

    const selectedName = this.tempSelectedName || this.selectedDropName || 'Sanjay Ghodawat University';
    const selectedSub = this.tempSelectedSub || this.selectedDropSub || 'Kolhapur';

    this.selectedDropName = selectedName;
    this.selectedDropSub = selectedSub;
    this.hasDropSelected = true;
    this.selectedDestination = `${selectedName}, ${selectedSub}`;
    if (this.tempSelectedCoords) {
      this.selectedDropCoords = this.tempSelectedCoords;
    }

    // Update Drop Location Card text on Home Screen
    const dropText = document.getElementById('home-drop-text');
    if (dropText) {
      dropText.textContent = selectedName;
      dropText.classList.remove('placeholder');
      dropText.classList.remove('animate-pulse');
      dropText.title = selectedSub;
    }

    this.updateResultsMapRoute();

    // Close the modal
    this.closeLocationMapModal();
    this.showToast(`Drop location set: ${selectedName} 📍`, 'success');
    this.addRecentSearch(selectedName, selectedSub, null, this.pickupLocationName || 'Current Location');
  }

  // -------------------------------------------------------------------------
  // 5. DIRECT GPS LOCATE ACTION (When GPS Button on Home Card is clicked)
  // -------------------------------------------------------------------------
  async fetchCurrentLocation() {
    if (window.soundFX && typeof window.soundFX.playTap === 'function') {
      window.soundFX.playTap();
    }

    const pickupText = document.getElementById('home-pickup-text');
    if (pickupText) {
      pickupText.textContent = '📍 Locating GPS...';
      pickupText.classList.add('animate-pulse');
    }
    this.showToast('📡 Detecting your current GPS location...');

    if (!navigator.geolocation) {
      if (pickupText) {
        pickupText.textContent = 'Current Location';
        pickupText.classList.remove('animate-pulse');
      }
      this.showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }

    this.isLocatingUser = true;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        this.isLocatingUser = false;
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);
        this.userCoords = { lat, lng, accuracy };
        this.pickupCoords = { lat, lng };

        let locationName = 'Current Location';
        let detailName = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              signal: controller.signal,
              headers: { 'Accept-Language': 'en' }
            }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
              const a = data.address;
              const primary = a.amenity || a.building || a.shop || a.tourism || a.road || a.suburb || a.neighbourhood || a.village || a.city_district || 'Current Location';
              const secondary = a.city || a.town || a.municipality || a.county || a.state_district || a.state || '';

              locationName = primary;
              if (secondary && secondary !== primary) {
                detailName = `${primary}, ${secondary}`;
              } else {
                detailName = data.display_name?.split(',').slice(0, 3).join(',') || primary;
              }
            } else if (data && data.display_name) {
              const parts = data.display_name.split(',');
              locationName = parts[0].trim();
              detailName = parts.slice(0, 3).join(',').trim();
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding timed out or failed, using coordinate fallback', err);
        }

        this.pickupLocationName = locationName;
        this.pickupLocationFull = detailName;
        this.hasPickupSelected = true;

        if (pickupText) {
          pickupText.textContent = locationName;
          pickupText.classList.remove('placeholder');
          pickupText.classList.remove('animate-pulse');
          pickupText.title = detailName;
        }

        this.updateResultsMapRoute();

        if (window.soundFX) {
          if (typeof window.soundFX.playConfirm === 'function') {
            window.soundFX.playConfirm();
          } else if (typeof window.soundFX.playTap === 'function') {
            window.soundFX.playTap();
          }
        }
        this.showToast(`📍 Pickup set to: ${locationName} (±${accuracy}m)`, 'success');
      },
      (err) => {
        this.isLocatingUser = false;
        if (pickupText) {
          if (!this.pickupLocationName) {
            pickupText.textContent = 'Select pickup location';
            pickupText.classList.add('placeholder');
          }
          pickupText.classList.remove('animate-pulse');
        }

        let errMsg = 'Could not access GPS';
        if (err.code === 1) {
          errMsg = 'Location permission denied. Please allow location access.';
        } else if (err.code === 2) {
          errMsg = 'Location signal unavailable. Using default location.';
        } else if (err.code === 3) {
          errMsg = 'Location request timed out. Please try again.';
        }

        if (window.soundFX) {
          if (typeof window.soundFX.playError === 'function') {
            window.soundFX.playError();
          } else if (typeof window.soundFX.playTap === 'function') {
            window.soundFX.playTap();
          }
        }
        this.showToast(errMsg, 'warning');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
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
    } else if (tab === 'status' || tab === 'system-status') {
      if (!this.isAdminOrDev()) {
        this.openAccessRestrictedModal();
        return;
      }
      this.navigateTo('screen-status', false);
      window.location.hash = '#system-status';
      this.initSystemStatus();
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

  // Log Out Action - Opens the Confirmation Modal
  logout() {
    if (window.soundFX && window.soundFX.playTap) {
      window.soundFX.playTap();
    }
    this.openLogoutConfirmModal();
  }

  openLogoutConfirmModal() {
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
      modal.classList.add('show');
      this.updateLogoutModalTheme();
    } else {
      this.confirmLogout();
    }
  }

  closeLogoutConfirmModal() {
    if (window.soundFX && window.soundFX.playTap) {
      window.soundFX.playTap();
    }
    const modal = document.getElementById('logout-confirm-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  async confirmLogout() {
    this.closeLogoutConfirmModal();
    const name = (this.userProfile && this.userProfile.name && this.userProfile.name !== 'Guest User') ? this.userProfile.name : 'User';

    // 1. Invalidate API and auth tokens
    if (window.RideCompareAuth) {
      try {
        await window.RideCompareAuth.logout();
      } catch (_) {}
    }

    // 2. Clear all local and session authentication state
    localStorage.removeItem('ridecompare_auth_token');
    localStorage.removeItem('ridecompare_has_started');
    localStorage.removeItem('ridecompare_user_profile');
    localStorage.removeItem('ridecompare_admin_access');
    sessionStorage.removeItem('ridecompare_admin_access');
    sessionStorage.removeItem('vozx_welcome_viewed');

    // 3. Reset application memory profile to Guest state
    this.userProfile = {
      name: 'Guest User',
      email: '',
      phone: '',
      city: 'Kolhapur',
      ridePref: 'all',
      avatarAccent: 'blue'
    };
    this.renderUserProfile();

    // 4. Clear input fields in login & signup forms
    const loginEmail = document.getElementById('auth-login-email');
    if (loginEmail) loginEmail.value = '';
    const loginPass = document.getElementById('auth-login-password');
    if (loginPass) loginPass.value = '';
    const signupName = document.getElementById('auth-signup-name');
    if (signupName) signupName.value = '';
    const signupEmail = document.getElementById('auth-signup-email');
    if (signupEmail) signupEmail.value = '';
    const signupPass = document.getElementById('auth-signup-password');
    if (signupPass) signupPass.value = '';
    const signupConf = document.getElementById('auth-signup-confirm');
    if (signupConf) signupConf.value = '';
    this.clearAuthErrors();
    this.clearAuthSuccess();

    // 5. Close any open dialogs / modals
    this.closeEditProfileModal();
    this.closeDeleteAccountModal();
    this.closeHistoryModal();
    this.closeAccessRestrictedModal();

    // 6. Navigate to Home base screen so dashboard is in background
    this.currentTab = 'home';
    this.navigateTo('screen-home', false);
    this.enforceResponsiveNav();

    // 7. Update URL hash to #login
    try {
      history.pushState(null, '', '#login');
    } catch (_) {
      window.location.hash = '#login';
    }

    // 8. Open the Login Page / Modal immediately
    setTimeout(() => {
      this.openAuthModal('login');
      this.showToast(`Logged out successfully. Please log in to continue. 👋`, 'info');
    }, 120);
  }

  updateLogoutModalTheme(isDark = false) {
    const isDarkMode = isDark || document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const modalPanel = document.querySelector('#logout-confirm-modal .logout-modal-panel');
    if (!modalPanel) return;

    const title = modalPanel.querySelector('.logout-modal-title');
    const sub = modalPanel.querySelector('.logout-modal-sub');
    const btnNo = modalPanel.querySelector('.btn-logout-no');
    const iconCircle = modalPanel.querySelector('.logout-icon-circle');

    if (isDarkMode) {
      modalPanel.style.removeProperty('background');
      modalPanel.style.removeProperty('background-color');
      modalPanel.style.removeProperty('border-color');
      modalPanel.style.removeProperty('color');
      if (title) title.style.removeProperty('color');
      if (sub) sub.style.removeProperty('color');
      if (btnNo) {
        btnNo.style.removeProperty('background-color');
        btnNo.style.removeProperty('color');
        btnNo.style.removeProperty('border-color');
      }
      if (iconCircle) {
        iconCircle.style.removeProperty('background-color');
        iconCircle.style.removeProperty('border-color');
        iconCircle.style.removeProperty('color');
      }
    } else {
      modalPanel.style.backgroundColor = '#FFFFFF';
      modalPanel.style.borderColor = '#E2E8F0';
      modalPanel.style.color = '#0F172A';
      if (title) title.style.color = '#0F172A';
      if (sub) sub.style.color = '#64748B';
      if (btnNo) {
        btnNo.style.backgroundColor = '#F8FAFC';
        btnNo.style.borderColor = '#CBD5E1';
        btnNo.style.color = '#334155';
      }
      if (iconCircle) {
        iconCircle.style.backgroundColor = '#FEE2E2';
        iconCircle.style.borderColor = '#FECACA';
        iconCircle.style.color = '#EF4444';
      }
    }
  }


  // =========================================================================
  // ADMIN & DEVELOPER ACCESS GATE (System Status Protection)
  // =========================================================================
  isAdminOrDev() {
    return sessionStorage.getItem('ridecompare_admin_access') === 'true' ||
           localStorage.getItem('ridecompare_admin_access') === 'true';
  }

  openAccessRestrictedModal() {
    if (window.soundFX && window.soundFX.playTap) {
      try { window.soundFX.playTap(); } catch (_) {}
    }
    this.showToast('Access Restricted: Only admin or developer can access it', 'error');

    const modal = document.getElementById('system-status-restricted-modal');
    if (modal) {
      modal.classList.add('show');
      const err = document.getElementById('admin-passcode-error');
      if (err) err.classList.add('hidden');
      const input = document.getElementById('admin-passcode-input');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 200);
      }
      this.updateRestrictedModalTheme();
    }
  }

  closeAccessRestrictedModal() {
    if (window.soundFX && window.soundFX.playTap) {
      try { window.soundFX.playTap(); } catch (_) {}
    }
    const modal = document.getElementById('system-status-restricted-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  verifyAdminPasscode(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('admin-passcode-input');
    const err = document.getElementById('admin-passcode-error');
    const val = (input ? input.value : '').trim().toLowerCase();

    // Accepted passcodes for admin / developer access
    const validCodes = ['admin', 'developer', 'admin123', 'dev', 'dev123', 'vozx', '2026', '1234'];

    if (validCodes.includes(val)) {
      sessionStorage.setItem('ridecompare_admin_access', 'true');
      this.closeAccessRestrictedModal();
      this.showToast('Developer / Admin Access Granted ⚡');
      if (window.soundFX && window.soundFX.playTap) {
        try { window.soundFX.playTap(); } catch (_) {}
      }
      this.navigateTo('screen-status', false);
      try { history.pushState(null, '', '#system-status'); } catch (_) {}
      this.currentTab = 'status';
      this.updateActiveNavs('status');
      this.initSystemStatus();
    } else {
      if (err) {
        err.textContent = 'Invalid Passcode. Only admin or developer can access it.';
        err.classList.remove('hidden');
      }
      this.showToast('Access Denied: Only admin or developer can access it', 'error');
      if (input) {
        input.classList.add('ring-2', 'ring-red-500');
        input.focus();
        setTimeout(() => input.classList.remove('ring-2', 'ring-red-500'), 1500);
      }
    }
  }

  lockAdminAccess() {
    sessionStorage.removeItem('ridecompare_admin_access');
    localStorage.removeItem('ridecompare_admin_access');
    this.showToast('Admin Mode Locked 🔒');
    this.switchTab('home');
  }

  updateRestrictedModalTheme() {
    const isDarkMode = document.body.classList.contains('theme-dark') || 
                       document.documentElement.getAttribute('data-theme') === 'dark';
    const modal = document.getElementById('system-status-restricted-modal');
    if (!modal) return;
    const panel = modal.querySelector('.restricted-modal-panel');
    const title = modal.querySelector('.restricted-modal-title');
    const sub = modal.querySelector('.restricted-modal-sub');
    const input = document.getElementById('admin-passcode-input');
    const btnBack = modal.querySelector('.btn-restricted-back');

    if (!panel) return;

    if (isDarkMode) {
      panel.style.removeProperty('background');
      panel.style.removeProperty('background-color');
      panel.style.removeProperty('border-color');
      panel.style.removeProperty('color');
      if (title) title.style.removeProperty('color');
      if (sub) sub.style.removeProperty('color');
      if (input) {
        input.style.removeProperty('background-color');
        input.style.removeProperty('border-color');
        input.style.removeProperty('color');
      }
      if (btnBack) {
        btnBack.style.removeProperty('background-color');
        btnBack.style.removeProperty('border-color');
        btnBack.style.removeProperty('color');
      }
    } else {
      panel.style.backgroundColor = '#FFFFFF';
      panel.style.borderColor = '#E2E8F0';
      panel.style.color = '#0F172A';
      if (title) title.style.color = '#0F172A';
      if (sub) sub.style.color = '#475569';
      if (input) {
        input.style.backgroundColor = '#F8FAFC';
        input.style.borderColor = '#CBD5E1';
        input.style.color = '#0F172A';
      }
      if (btnBack) {
        btnBack.style.backgroundColor = '#F1F5F9';
        btnBack.style.borderColor = '#CBD5E1';
        btnBack.style.color = '#334155';
      }
    }
  }

  openDeleteAccountModal() {
    if (window.soundFX && window.soundFX.playTap) {
      window.soundFX.playTap();
    }
    const modal = document.getElementById('delete-account-modal');
    if (modal) {
      modal.classList.add('show');
      this.updateDeleteAccountModalTheme();
    } else if (confirm('Are you sure you want to permanently delete your account from the database?')) {
      this.confirmDeleteAccount();
    }
  }

  closeDeleteAccountModal() {
    if (window.soundFX && window.soundFX.playTap) {
      window.soundFX.playTap();
    }
    const modal = document.getElementById('delete-account-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  async confirmDeleteAccount() {
    const confirmBtn = document.getElementById('btn-delete-account-confirm');
    const originalText = confirmBtn ? confirmBtn.innerHTML : 'Confirm';
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `
        <svg class="w-4 h-4 animate-spin mr-1.5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Deleting...</span>
      `;
    }

    try {
      if (window.RideCompareAuth && typeof window.RideCompareAuth.deleteAccount === 'function') {
        await window.RideCompareAuth.deleteAccount();
      } else if (window.RideCompareApi && typeof window.RideCompareApi.deleteAccount === 'function') {
        await window.RideCompareApi.deleteAccount();
      }
    } catch (err) {
      console.warn('Backend delete account error:', err);
    } finally {
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
      }
      this.closeDeleteAccountModal();

      // Clear all local session and authentication storage
      localStorage.removeItem('ridecompare_jwt_token');
      localStorage.removeItem('ridecompare_auth_token');
      localStorage.removeItem('ridecompare_has_started');
      localStorage.removeItem('ridecompare_user_profile');
      sessionStorage.removeItem('vozx_welcome_viewed');

      this.userProfile = {
        name: 'Varun Reddy',
        email: 'varunreddy@gmail.com',
        phone: '+91 98765 43210',
        city: 'Ichalkaranji, Kolhapur',
        ridePref: 'all',
        avatarAccent: 'blue'
      };
      this.renderUserProfile();
      this.showToast('Your account has been permanently deleted from database');

      this.currentTab = 'home';
      this.navigateTo('screen-splash', false);
      try {
        history.pushState(null, '', '#splash');
      } catch (_) {
        window.location.hash = '#splash';
      }
      this.enforceResponsiveNav();
    }
  }

  updateDeleteAccountModalTheme(isDark = false) {
    const isDarkMode = isDark || document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const modalPanel = document.querySelector('#delete-account-modal .delete-account-modal-panel');
    if (!modalPanel) return;

    const title = modalPanel.querySelector('.delete-account-modal-title');
    const sub = modalPanel.querySelector('.delete-account-modal-sub');
    const btnBack = modalPanel.querySelector('.btn-delete-account-back');

    if (isDarkMode) {
      modalPanel.style.removeProperty('background');
      modalPanel.style.removeProperty('background-color');
      modalPanel.style.removeProperty('border-color');
      modalPanel.style.removeProperty('color');
      if (title) title.style.removeProperty('color');
      if (sub) sub.style.removeProperty('color');
      if (btnBack) {
        btnBack.style.removeProperty('background-color');
        btnBack.style.removeProperty('color');
        btnBack.style.removeProperty('border-color');
      }
    } else {
      modalPanel.style.backgroundColor = '#FFFFFF';
      modalPanel.style.borderColor = '#FED7D7';
      modalPanel.style.color = '#0F172A';
      if (title) title.style.color = '#0F172A';
      if (sub) sub.style.color = '#64748B';
      if (btnBack) {
        btnBack.style.backgroundColor = '#F1F5F9';
        btnBack.style.borderColor = '#CBD5E1';
        btnBack.style.color = '#334155';
      }
    }
  }

  // =========================================================================
  // USER PROFILE & EDIT PROFILE SYSTEM
  // =========================================================================
  initUserProfile() {
    const isAuth = !!(localStorage.getItem('ridecompare_auth_token') || localStorage.getItem('ridecompare_has_started'));
    const guestProfile = {
      name: 'Guest User',
      email: '',
      phone: '',
      city: 'Kolhapur',
      ridePref: 'all',
      avatarAccent: 'blue'
    };
    try {
      const saved = localStorage.getItem('ridecompare_user_profile');
      if (saved) {
        this.userProfile = JSON.parse(saved);
      } else if (isAuth && window.RideCompareAuth && window.RideCompareAuth.currentUser) {
        this.userProfile = window.RideCompareAuth.currentUser;
      } else {
        this.userProfile = guestProfile;
      }
    } catch (e) {
      this.userProfile = guestProfile;
    }
    this.renderUserProfile();

    // Verify authenticated session with backend Supabase via GET /api/auth/me or direct cloud
    if (window.RideCompareAuth && window.RideCompareAuth.token) {
      window.RideCompareAuth.checkSession().then(user => {
        if (user) {
          this.userProfile = Object.assign({}, this.userProfile, {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || this.userProfile.phone
          });
          localStorage.setItem('ridecompare_user_profile', JSON.stringify(this.userProfile));
          this.renderUserProfile();
          this.syncRecentSearchesFromBackend();
        }
      }).catch(() => {});
    }
  }

  renderUserProfile() {
    const isGuest = !this.userProfile || this.userProfile.name === 'Guest User' || (!localStorage.getItem('ridecompare_auth_token') && !localStorage.getItem('ridecompare_has_started'));
    const p = this.userProfile || { name: 'Guest User' };

    // 1. Update text elements across screens (ALL sidebars, headers, and profile screen)
    const displayName = isGuest ? 'Guest User' : (p.name || 'User');
    document.querySelectorAll('.sidebar-user-name, #sidebar-profile-name, #desk-home-profile-name, #desk-history-profile-name, #status-sidebar-profile-name').forEach(el => {
      el.textContent = displayName;
    });

    // Update connection status badges across sidebars
    document.querySelectorAll('.sidebar-user-status').forEach(el => {
      if (isGuest) {
        el.textContent = '○ Not Logged In';
        el.classList.remove('text-green-400');
        el.classList.add('text-slate-400');
      } else {
        el.textContent = '● Connected';
        el.classList.add('text-green-400');
        el.classList.remove('text-slate-400');
      }
    });

    const name = displayName;
    document.querySelectorAll('.sidebar-user-name, #sidebar-profile-name, #desk-home-profile-name, #desk-history-profile-name, #status-sidebar-profile-name').forEach(el => {
      el.textContent = name;
    });

    const nameEl = document.getElementById('profile-display-name');
    if (nameEl) nameEl.textContent = name;

    const emailEl = document.getElementById('profile-display-email');
    if (emailEl) emailEl.textContent = isGuest ? '' : (p.email || '');

    const phoneEl = document.getElementById('profile-display-phone');
    if (phoneEl) phoneEl.textContent = isGuest ? '' : (p.phone || '+91 98765 43210');

    // Update avatar button tooltips
    const deskProfileBtn = document.getElementById('btn-topbar-profile') || document.querySelector('button[title*="View Profile"]');
    if (deskProfileBtn) deskProfileBtn.setAttribute('title', `View Profile (${name})`);

    const mobProfileBtn = document.getElementById('btn-mob-topbar-profile') || document.querySelector('button[aria-label*="Profile"]');
    if (mobProfileBtn) {
      mobProfileBtn.setAttribute('aria-label', `Profile (${name})`);
      mobProfileBtn.setAttribute('title', `Profile (${name})`);
    }

    // 2. Avatar Accents
    const accents = {
      blue: { bg: '#93C5FD', text: '#1E3A8A', border: '#60A5FA' },
      purple: { bg: '#C4B5FD', text: '#4C1D95', border: '#A78BFA' },
      emerald: { bg: '#A7F3D0', text: '#064E3B', border: '#34D399' },
      amber: { bg: '#FDE68A', text: '#78350F', border: '#FBBF24' }
    };
    const accent = accents[p.avatarAccent] || accents.blue;

    const avatars = document.querySelectorAll(
      '#profile-avatar-display, #sidebar-avatar-badge, #edit-modal-avatar-preview, #btn-topbar-profile, #btn-mob-topbar-profile, #desk-home-avatar-badge, #desk-history-avatar-badge, .user-avatar-badge, .sidebar-avatar-badge'
    );
    avatars.forEach(av => {
      av.style.setProperty('background', accent.bg, 'important');
      av.style.setProperty('background-color', accent.bg, 'important');
      if (av.tagName === 'BUTTON') {
        av.style.setProperty('border-color', accent.border, 'important');
      }
      const svg = av.querySelector('svg');
      if (svg) {
        svg.style.setProperty('color', accent.text, 'important');
        svg.style.setProperty('fill', 'currentColor', 'important');
      }
    });

    this.renderRecentSearches();
    this.syncRecentSearchesFromBackend();
  }

  openEditProfileModal() {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;

    const p = this.userProfile || {
      name: 'Varun Reddy',
      email: 'varunreddy@gmail.com',
      phone: '+91 98765 43210',
      city: 'Ichalkaranji, Kolhapur',
      ridePref: 'all',
      avatarAccent: 'blue'
    };

    const nameInp = document.getElementById('edit-profile-name');
    const emailInp = document.getElementById('edit-profile-email');
    const phoneInp = document.getElementById('edit-profile-phone');
    const cityInp = document.getElementById('edit-profile-city');
    const prefInp = document.getElementById('edit-profile-pref');

    if (nameInp) nameInp.value = p.name;
    if (emailInp) emailInp.value = p.email;
    if (phoneInp) phoneInp.value = p.phone || '';
    if (cityInp) cityInp.value = p.city || '';
    if (prefInp) prefInp.value = p.ridePref || 'all';

    this.tempAvatarAccent = p.avatarAccent || 'blue';
    this.updateModalAvatarAccentButtons(this.tempAvatarAccent);
    this.selectAvatarTheme(this.tempAvatarAccent);

    modal.classList.add('show');
    this.updateEditProfileModalTheme();
  }

  closeEditProfileModal() {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  selectAvatarTheme(colorKey) {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    this.tempAvatarAccent = colorKey;
    this.updateModalAvatarAccentButtons(colorKey);

    const accents = {
      blue: { bg: '#93C5FD', text: '#1E3A8A', border: '#60A5FA' },
      purple: { bg: '#C4B5FD', text: '#4C1D95', border: '#A78BFA' },
      emerald: { bg: '#A7F3D0', text: '#064E3B', border: '#34D399' },
      amber: { bg: '#FDE68A', text: '#78350F', border: '#FBBF24' }
    };
    const accent = accents[colorKey] || accents.blue;
    const modalAv = document.getElementById('edit-modal-avatar-preview');
    if (modalAv) {
      modalAv.style.setProperty('background', accent.bg, 'important');
      modalAv.style.setProperty('background-color', accent.bg, 'important');
      const svg = modalAv.querySelector('svg');
      if (svg) {
        svg.style.setProperty('color', accent.text, 'important');
        svg.style.setProperty('fill', 'currentColor', 'important');
      }
    }
  }

  updateModalAvatarAccentButtons(selectedKey) {
    const btns = document.querySelectorAll('.avatar-accent-btn');
    btns.forEach(btn => {
      const key = btn.getAttribute('data-accent');
      if (key === selectedKey) {
        btn.classList.add('ring-2', 'ring-blue-500', 'border-white', 'scale-110');
      } else {
        btn.classList.remove('ring-2', 'ring-blue-500', 'border-white', 'scale-110');
      }
    });
  }

  async saveProfile(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInp = document.getElementById('edit-profile-name');
    const emailInp = document.getElementById('edit-profile-email');
    const phoneInp = document.getElementById('edit-profile-phone');
    const cityInp = document.getElementById('edit-profile-city');
    const prefInp = document.getElementById('edit-profile-pref');

    const newName = nameInp ? nameInp.value.trim() : '';
    const newEmail = emailInp ? emailInp.value.trim() : '';
    const newPhone = phoneInp ? phoneInp.value.trim() : '';
    const newCity = cityInp ? cityInp.value.trim() : '';
    const newPref = prefInp ? prefInp.value : 'all';

    if (!newName) {
      this.showToast('⚠️ Please enter your full name');
      if (nameInp) nameInp.focus();
      return;
    }
    if (!newEmail || !newEmail.includes('@')) {
      this.showToast('⚠️ Please enter a valid email address');
      if (emailInp) emailInp.focus();
      return;
    }

    // Persist to Supabase PostgreSQL if authenticated
    if (window.RideCompareAuth && window.RideCompareAuth.isAuthenticated) {
      try {
        await window.RideCompareAuth.updateProfile({ name: newName, phone: newPhone });
      } catch (err) {
        console.warn('Could not sync profile update to backend:', err);
      }
    }

    this.userProfile = {
      ...(this.userProfile || {}),
      name: newName,
      email: newEmail,
      phone: newPhone,
      city: newCity,
      ridePref: newPref,
      avatarAccent: this.tempAvatarAccent || (this.userProfile && this.userProfile.avatarAccent) || 'blue'
    };

    localStorage.setItem('ridecompare_user_profile', JSON.stringify(this.userProfile));
    this.renderUserProfile();
    this.closeEditProfileModal();

    if (window.soundFX && window.soundFX.playGetStarted) {
      window.soundFX.playGetStarted();
    }
    this.showToast('Profile updated successfully! ✨');
  }

  updateEditProfileModalTheme(isDark = false) {
    const isDarkMode = isDark || document.body.classList.contains('theme-dark') || document.documentElement.getAttribute('data-theme') === 'dark';
    const modalPanel = document.querySelector('#edit-profile-modal .edit-profile-panel');
    if (!modalPanel) return;

    const inputs = modalPanel.querySelectorAll('.edit-profile-input');
    const labels = modalPanel.querySelectorAll('.edit-profile-label');
    const title = modalPanel.querySelector('.edit-profile-header-title');
    const sub = modalPanel.querySelector('.edit-profile-header-sub');
    const closeBtn = modalPanel.querySelector('.edit-profile-close-btn');
    const cancelBtn = modalPanel.querySelector('.btn-cancel-profile');

    if (isDarkMode) {
      modalPanel.style.removeProperty('background');
      modalPanel.style.removeProperty('background-color');
      modalPanel.style.removeProperty('border-color');
      modalPanel.style.removeProperty('color');
      if (title) title.style.removeProperty('color');
      if (sub) sub.style.removeProperty('color');
      if (closeBtn) {
        closeBtn.style.removeProperty('background-color');
        closeBtn.style.removeProperty('color');
      }
      if (cancelBtn) {
        cancelBtn.style.removeProperty('background-color');
        cancelBtn.style.removeProperty('color');
        cancelBtn.style.removeProperty('border-color');
      }
      labels.forEach(l => l.style.removeProperty('color'));
      inputs.forEach(inp => {
        inp.style.removeProperty('background-color');
        inp.style.removeProperty('border-color');
        inp.style.removeProperty('color');
      });
    } else {
      modalPanel.style.setProperty('background', '#FFFFFF', 'important');
      modalPanel.style.setProperty('background-color', '#FFFFFF', 'important');
      modalPanel.style.setProperty('border-color', '#E2E8F0', 'important');
      modalPanel.style.setProperty('color', '#0F172A', 'important');
      if (title) title.style.setProperty('color', '#0F172A', 'important');
      if (sub) sub.style.setProperty('color', '#64748B', 'important');
      if (closeBtn) {
        closeBtn.style.setProperty('background-color', '#F1F5F9', 'important');
        closeBtn.style.setProperty('color', '#475569', 'important');
      }
      if (cancelBtn) {
        cancelBtn.style.setProperty('background-color', '#F1F5F9', 'important');
        cancelBtn.style.setProperty('color', '#475569', 'important');
        cancelBtn.style.setProperty('border-color', '#CBD5E1', 'important');
      }
      labels.forEach(l => l.style.setProperty('color', '#334155', 'important'));
      inputs.forEach(inp => {
        inp.style.setProperty('background-color', '#F8FAFC', 'important');
        inp.style.setProperty('border-color', '#CBD5E1', 'important');
        inp.style.setProperty('color', '#0F172A', 'important');
      });
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
    this.updateHistoryReceiptTheme();
    const recBadge = document.getElementById('receipt-provider-badge');
    if (recBadge) {
      recBadge.textContent = `${trip.provider} • ${trip.vehicle}`;
      recBadge.className = `px-2.5 py-1 rounded-full text-xs font-bold ${trip.badgeClass}`;
      if (trip.providerCategory === 'uber' || trip.badgeClass.includes('bg-black')) {
        recBadge.style.setProperty('color', '#FFFFFF', 'important');
      } else {
        recBadge.style.removeProperty('color');
      }
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

    // Sync Mobile / Tablet Modal Fare Breakdown
    const modBase = document.getElementById('modal-base-fare');
    if (modBase) modBase.textContent = trip.baseFare;
    const modDistFare = document.getElementById('modal-dist-fare');
    if (modDistFare) modDistFare.textContent = trip.distFare;
    const modTax = document.getElementById('modal-tax-fare');
    if (modTax) modTax.textContent = trip.taxFare;
    const modFinal = document.getElementById('modal-final-fare');
    if (modFinal) modFinal.textContent = `₹${trip.fare}.00`;

    // 2. Open Mobile / Tablet Slide-up Modal if on smaller screens
    if (openMobileModal && window.innerWidth < 1024) {
      const modal = document.getElementById('history-detail-modal');
      const modBadge = document.getElementById('modal-provider-badge');
      if (modBadge) {
        modBadge.textContent = `${trip.provider} • ${trip.vehicle}`;
        modBadge.className = `px-2.5 py-1 rounded-full text-xs font-bold ${trip.badgeClass}`;
        if (trip.providerCategory === 'uber' || trip.badgeClass.includes('bg-black')) {
          modBadge.style.setProperty('color', '#FFFFFF', 'important');
        } else {
          modBadge.style.removeProperty('color');
        }
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
    if (this.isCurrentlyOffline) {
      this.closeHistoryModal();
      this.handleConnectivityChange(false);
      return;
    }
    const trip = this.historyTrips.find(t => t.id === this.selectedHistoryTripId) || this.historyTrips[0];
    this.closeHistoryModal();

    if (window.soundFX) {
      window.soundFX.playGetStarted();
    }

    // Set pickup & destination
    this.selectedDestination = trip.destination;
    this.selectedDropName = trip.destination;
    this.pickupLocationName = trip.origin;
    this.hasPickupSelected = true;
    this.hasDropSelected = true;

    const pickupText = document.getElementById('home-pickup-text');
    if (pickupText) {
      pickupText.textContent = trip.origin;
      pickupText.classList.remove('placeholder');
    }
    const dropText = document.getElementById('home-drop-text');
    if (dropText) {
      dropText.textContent = trip.destination;
      dropText.classList.remove('placeholder');
    }

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

  // Toast feedback popup system - Permanently disabled across all devices per user request
  showToast(message, type = 'info') {
    // Disabled: all popup text messages removed across all devices
    const toast = document.getElementById('app-toast');
    if (toast) {
      toast.classList.remove('visible', 'toast-success');
      toast.style.display = 'none';
      toast.style.visibility = 'hidden';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
    }
    return;
  }

  // =========================================================================
  // OFFLINE CONNECTIVITY SYSTEM (Matches media_1790748145684.png)
  // =========================================================================
  initConnectivity() {
    this.isOnline = true;
    this.isCurrentlyOffline = false;

    // 1. Immediate Network Event Listeners
    window.addEventListener('offline', () => {
      this.handleConnectivityChange(false);
    });
    window.addEventListener('online', () => {
      this.checkRealInternet(true);
    });

    // 2. Active Real Ping Check Immediately
    this.checkRealInternet(false);

    // 3. Heartbeat for active connection validation (checks every 2.5s)
    // Critical for Windows systems with VMware/WSL/Tailscale virtual adapters
    this.startConnectivityHeartbeat();
  }

  // Active Real-World Ping Test
  async checkRealInternet(isRecoveryCheck = false) {
    if (this.isForcedOffline) return false;

    // If browser itself reports offline
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      if (!this.isCurrentlyOffline) {
        this.handleConnectivityChange(false);
      }
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      await fetch('https://www.gstatic.com/generate_204?' + Date.now(), {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      // Ping succeeded -> Real internet is working!
      if (this.isCurrentlyOffline || isRecoveryCheck) {
        this.handleConnectivityChange(true);
      }
      return true;
    } catch (err) {
      // Ping failed -> No public internet! (e.g. Wi-Fi disconnected or router down)
      if (!this.isCurrentlyOffline) {
        this.handleConnectivityChange(false);
      }
      return false;
    }
  }

  startConnectivityHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      this.checkRealInternet(false);
    }, 2500);
  }

  handleConnectivityChange(isOnline) {
    this.isOnline = isOnline;
    this.isCurrentlyOffline = !isOnline;
    const offlineScreen = document.getElementById('screen-offline');
    if (!isOnline) {
      document.documentElement.classList.add('is-offline');
      document.body.classList.add('is-offline');
      if (offlineScreen) {
        offlineScreen.classList.add('active');
      }
    } else {
      document.documentElement.classList.remove('is-offline');
      document.body.classList.remove('is-offline');
      if (offlineScreen && offlineScreen.classList.contains('active')) {
        offlineScreen.classList.remove('active');
        this.showToast('🟢 Connection restored! Back online.');
      }
    }
  }

  // Check Connectivity (Triggered by 'Try Again' button)
  async checkConnectivity(isUserClick = false) {
    const retryBtn = document.getElementById('btn-offline-retry');
    const retryIcon = document.getElementById('offline-retry-icon');
    
    if (window.soundFX) {
      window.soundFX.playTap();
    }

    if (retryIcon) retryIcon.classList.add('animate-spin');
    if (retryBtn) retryBtn.disabled = true;

    const isConnected = await this.checkRealInternet(true);

    setTimeout(() => {
      if (retryIcon) retryIcon.classList.remove('animate-spin');
      if (retryBtn) retryBtn.disabled = false;

      if (isConnected && !this.isForcedOffline) {
        this.handleConnectivityChange(true);
      } else {
        this.handleConnectivityChange(false);
        if (isUserClick) {
          this.showToast('⚠️ Still offline. Please check your internet connection.');
        }
      }
    }, 400);
  }

  // Developer / Testing helper to simulate offline mode
  setOffline(forced = true) {
    this.isForcedOffline = forced;
    this.handleConnectivityChange(!forced);
  }

  // =========================================================================
  // SYSTEM STATUS & CONNECTION MONITOR (DEVELOPER PANEL)
  // =========================================================================
  initSystemStatus() {
    this.detectSystemUrls();
    this.checkSystemStatus(false);
  }

  detectSystemUrls() {
    try {
      // 1. Detect Frontend URL & Environment
      const feOrigin = window.location.origin || `${window.location.protocol}//${window.location.host}`;
      const feHost = window.location.hostname || 'localhost';
      const fePort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
      const isLocal = feHost === 'localhost' || feHost === '127.0.0.1' || feHost.startsWith('192.168.') || feHost.startsWith('10.') || feHost.startsWith('172.');
      const envMode = isLocal ? 'Development' : 'Production';

      // 2. Detect Backend API URL (prioritizing VITE_API_URL, then api client base, then fallback)
      const beApiUrl = (typeof window !== 'undefined' && window.VITE_API_URL) || 
                       (window.RideCompareApi && window.RideCompareApi.getBaseUrl && window.RideCompareApi.getBaseUrl()) || 
                       `${feOrigin}/api`;

      let bePort = '5000';
      try {
        const parsedUrl = new URL(beApiUrl);
        bePort = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');
      } catch (_) {}

      // 3. Update DOM Elements
      const websiteUrlEls = [
        document.getElementById('status-website-url'),
        document.getElementById('status-fe-fullurl')
      ];
      websiteUrlEls.forEach(el => {
        if (el) el.textContent = feOrigin;
      });

      const feEnvEl = document.getElementById('status-fe-env');
      if (feEnvEl) feEnvEl.textContent = envMode;

      const fePortEl = document.getElementById('status-fe-port');
      if (fePortEl) fePortEl.textContent = fePort;

      const websiteEnvTag = document.getElementById('status-website-env-tag');
      if (websiteEnvTag) {
        websiteEnvTag.textContent = isLocal ? 'Local Dev' : 'Production';
        websiteEnvTag.className = isLocal 
          ? 'flex-shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200'
          : 'flex-shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200';
      }

      const beUrlEl = document.getElementById('status-be-url');
      if (beUrlEl) beUrlEl.textContent = beApiUrl;

      const bePortEl = document.getElementById('status-be-port');
      if (bePortEl) bePortEl.textContent = bePort;

    } catch (err) {
      console.warn('[SystemStatus] Error detecting URLs:', err);
    }
  }

  async checkSystemStatus(isManual = false) {
    const refreshIcons = document.querySelectorAll('.refresh-icon-desktop, .refresh-icon-mobile, .refresh-icon-action');
    refreshIcons.forEach(icon => icon.classList.add('spin-refresh'));

    // Set Checking States
    this.updateStatusBadge('status-be-badge', 'status-be-dot', 'status-be-state', 'Checking...', 'checking');
    this.updateStatusBadge('status-db-badge', 'status-db-dot', 'status-db-state', 'Checking...', 'checking');
    const overallLabel = document.getElementById('status-overall-label');
    const overallDot = document.getElementById('status-overall-dot');
    const overallPill = document.getElementById('status-overall-pill');
    if (overallLabel) overallLabel.textContent = 'Checking Services...';
    if (overallDot) overallDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse';
    if (overallPill) overallPill.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs';

    try {
      const healthData = await (window.RideCompareApi ? window.RideCompareApi.checkHealth() : null);
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      const timeEls = [
        document.getElementById('status-timestamp-desktop'),
        document.getElementById('status-timestamp-mobile')
      ];
      timeEls.forEach(el => {
        if (el) el.textContent = timeStr;
      });

      const isApiOnline = !!(healthData && (healthData.success || healthData.status === 'online'));
      const dbStatus = healthData?.database || healthData?.data?.database;
      const isDbConnected = dbStatus === 'connected';

      // 1. Update Frontend
      this.updateStatusBadge('status-fe-badge', null, 'status-fe-state', 'Online', 'online');

      // 2. Update Backend
      if (isApiOnline) {
        this.updateStatusBadge('status-be-badge', 'status-be-dot', 'status-be-state', 'Online', 'online');
        if (healthData.data?.port) {
          const portEl = document.getElementById('status-be-port');
          if (portEl) portEl.textContent = healthData.data.port;
        }
      } else {
        this.updateStatusBadge('status-be-badge', 'status-be-dot', 'status-be-state', 'Offline', 'offline');
      }

      // 3. Update Database
      if (isDbConnected) {
        this.updateStatusBadge('status-db-badge', 'status-db-dot', 'status-db-state', 'Connected', 'online');
        const dbEnvEl = document.getElementById('status-db-env');
        if (dbEnvEl && healthData?.data?.environment) {
          dbEnvEl.textContent = healthData.data.environment === 'production' ? 'Production' : 'Development';
        }
        const dbPingEl = document.getElementById('status-db-ping');
        if (dbPingEl) {
          dbPingEl.textContent = 'Active & Verified';
          dbPingEl.className = 'text-emerald-600 font-semibold';
        }
      } else if (isApiOnline) {
        this.updateStatusBadge('status-db-badge', 'status-db-dot', 'status-db-state', 'Disconnected', 'offline');
        const dbPingEl = document.getElementById('status-db-ping');
        if (dbPingEl) {
          dbPingEl.textContent = 'Disconnected';
          dbPingEl.className = 'text-rose-600 font-semibold';
        }
      } else {
        this.updateStatusBadge('status-db-badge', 'status-db-dot', 'status-db-state', 'Unknown / Unreachable', 'offline');
        const dbPingEl = document.getElementById('status-db-ping');
        if (dbPingEl) {
          dbPingEl.textContent = 'Backend Offline';
          dbPingEl.className = 'text-slate-400 font-semibold';
        }
      }

      // 4. Update Overall Pill
      if (isApiOnline && isDbConnected) {
        if (overallLabel) overallLabel.textContent = 'All Systems Operational';
        if (overallDot) overallDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500';
        if (overallPill) overallPill.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs';
      } else if (isApiOnline) {
        if (overallLabel) overallLabel.textContent = 'Database Disconnected';
        if (overallDot) overallDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500';
        if (overallPill) overallPill.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs';
      } else {
        if (overallLabel) overallLabel.textContent = 'Backend API Offline';
        if (overallDot) overallDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500';
        if (overallPill) overallPill.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs';
      }

    } catch (e) {
      this.updateStatusBadge('status-be-badge', 'status-be-dot', 'status-be-state', 'Offline', 'offline');
      this.updateStatusBadge('status-db-badge', 'status-db-dot', 'status-db-state', 'Unknown / Unreachable', 'offline');
      if (overallLabel) overallLabel.textContent = 'Connection Error';
      if (overallDot) overallDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500';
      if (overallPill) overallPill.className = 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold shadow-xs';
    } finally {
      setTimeout(() => {
        refreshIcons.forEach(icon => icon.classList.remove('spin-refresh'));
      }, 400);
    }
  }

  updateStatusBadge(badgeId, dotId, labelId, text, state) {
    const badge = document.getElementById(badgeId);
    const dot = dotId ? document.getElementById(dotId) : null;
    const label = document.getElementById(labelId);

    if (label) label.textContent = text;

    if (badge) {
      if (state === 'online') {
        badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold';
        if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500';
      } else if (state === 'offline') {
        badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold';
        if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500';
      } else {
        badge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold';
        if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse';
      }
    }
  }

  refreshSystemStatus() {
    if (window.soundFX && window.soundFX.playTap) {
      window.soundFX.playTap();
    }
    this.detectSystemUrls();
    this.checkSystemStatus(true);
  }

  copyWebsiteUrl(btnElement) {
    const url = window.location.origin || `${window.location.protocol}//${window.location.host}`;
    this.copyText(url, btnElement);
  }

  copyApiUrl(btnElement) {
    const urlEl = document.getElementById('status-be-url');
    const url = urlEl ? urlEl.textContent : 'http://localhost:5000/api';
    this.copyText(url, btnElement);
  }

  openWebsite() {
    if (window.soundFX && window.soundFX.playTap) {
      window.soundFX.playTap();
    }
    const origin = window.location.origin || `${window.location.protocol}//${window.location.host}`;
    window.open(origin, '_blank');
  }

  copyText(text, btnElement) {
    if (!text) return;
    if (window.soundFX && window.soundFX.playTap) {
      window.soundFX.playTap();
    }

    const copyFeedback = () => {
      if (!btnElement) return;
      const copyTextEl = btnElement.querySelector('.copy-text, .copy-label');
      const originalText = copyTextEl ? copyTextEl.textContent : btnElement.textContent;
      
      btnElement.classList.add('btn-copied-state');
      if (copyTextEl) {
        copyTextEl.textContent = 'Copied!';
      } else {
        btnElement.textContent = 'Copied!';
      }

      setTimeout(() => {
        btnElement.classList.remove('btn-copied-state');
        if (copyTextEl) {
          copyTextEl.textContent = originalText;
        } else {
          btnElement.textContent = originalText;
        }
      }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(copyFeedback).catch(() => {
        this.fallbackCopyText(text, copyFeedback);
      });
    } else {
      this.fallbackCopyText(text, copyFeedback);
    }
  }

  fallbackCopyText(text, callback) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (callback) callback();
    } catch (_) {}
  }

  copyDiagnostics(btnElement) {
    const feOrigin = window.location.origin || `${window.location.protocol}//${window.location.host}`;
    const fePort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
    const beApiUrl = (typeof window !== 'undefined' && window.VITE_API_URL) || 
                     (window.RideCompareApi && window.RideCompareApi.getBaseUrl && window.RideCompareApi.getBaseUrl()) || 
                     `${feOrigin}/api`;

    const diag = {
      app: 'VOZX RideCompare',
      environment: window.location.hostname === 'localhost' ? 'development' : 'production',
      timestamp: new Date().toISOString(),
      frontend: {
        status: 'online',
        origin: feOrigin,
        port: fePort,
        framework: 'HTML5 / Vanilla JS SPA (Vite Compatible)'
      },
      backendApi: {
        status: window.RideCompareApi?.isBackendOnline ? 'online' : 'checked',
        url: beApiUrl,
        framework: 'Node.js / Express',
        healthEndpoint: '/api/health'
      },
      database: {
        engine: 'Supabase PostgreSQL',
        orm: 'Prisma',
        exposure: 'Zero Direct Frontend Exposure (Express Gateway Only)'
      }
    };

    this.copyText(JSON.stringify(diag, null, 2), btnElement);
  }
}

window.app = new RideCompareApp();
window.reloadApp = () => {
  if (window.app && window.app.reloadPage) {
    window.app.reloadPage();
  } else {
    window.location.reload();
  }
};
window.reloadPage = window.reloadApp;

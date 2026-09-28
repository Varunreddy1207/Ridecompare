// VOZX RideCompare - Core Application Logic & Router

class VozxApp {
  constructor() {
    this.currentScreen = 'screen-splash';
    this.historyStack = [];
    this.selectedRide = null;
    this.selectedCategory = 'all';
    this.onboardingStep = 0;
    this.otpTimer = null;
    this.otpSeconds = 30;
    this.deviceMode = 'iphone'; // 'iphone', 'pixel', 'fullscreen'
    this.activeTab = 'home';
    this.currentDestination = APP_DATA.defaultRoute.destination;
    this.currentPickup = APP_DATA.defaultRoute.pickup;
    this.searchQuery = '';
    this.isComparing = false;
    this.bookedRide = null;
    this.activeFilter = 'all';
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.bindEvents();
      this.renderRecentSearches();
      this.renderSavedPlaces();
      this.renderRideList();
      this.renderRideHistory();
      this.renderOffers();
      this.renderWalletTransactions();
      this.renderNotifications();
      this.initScratchCards();
      this.renderPredictionChart();
      this.updateDynamicIsland('VOZX Ready');

      // Initialize default view
      this.navigateTo('screen-splash', false);
    });
  }

  // Navigation Router
  navigateTo(screenId, pushHistory = true) {
    if (this.currentScreen === screenId) return;

    if (pushHistory && this.currentScreen) {
      this.historyStack.push(this.currentScreen);
    }

    const previousScreenEl = document.getElementById(this.currentScreen);
    if (previousScreenEl) {
      previousScreenEl.classList.remove('active');
    }

    const targetScreenEl = document.getElementById(screenId);
    if (targetScreenEl) {
      targetScreenEl.classList.add('active');
      this.currentScreen = screenId;
    }

    // Sound feedback
    if (window.soundFX) window.soundFX.playTap();

    // Contextual screen actions
    this.handleScreenLifecycle(screenId);
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
      this.handleScreenLifecycle(prev);
    } else {
      this.navigateTo('screen-home', false);
    }
  }

  handleScreenLifecycle(screenId) {
    // Hide bottom nav on splash, onboarding, auth, details, tracking
    const bottomNav = document.getElementById('bottom-nav-bar');
    const floatingAi = document.getElementById('floating-ai-btn');

    const fullScreenViews = ['screen-splash', 'screen-onboarding', 'screen-auth', 'screen-tracking', 'screen-details'];
    if (bottomNav) {
      if (fullScreenViews.includes(screenId)) {
        bottomNav.classList.add('hidden');
        if (floatingAi) floatingAi.classList.add('hidden');
      } else {
        bottomNav.classList.remove('hidden');
        if (floatingAi) floatingAi.classList.remove('hidden');
      }
    }

    // Dynamic Island updates
    if (screenId === 'screen-splash') {
      this.updateDynamicIsland('VOZX');
    } else if (screenId === 'screen-home') {
      this.updateDynamicIsland('Ichalkaranji · 28°C');
      this.updateBottomNavState('home');
      setTimeout(() => window.vozxMap && window.vozxMap.initPreviewMap(), 100);
    } else if (screenId === 'screen-comparison') {
      this.updateDynamicIsland('Comparing 5 Apps...');
      setTimeout(() => {
        if (window.vozxMap) {
          window.vozxMap.initFullMap();
          window.vozxMap.recenter();
        }
      }, 100);
    } else if (screenId === 'screen-tracking') {
      this.updateDynamicIsland('Driver 3m Away');
      setTimeout(() => {
        if (window.vozxMap) {
          window.vozxMap.initFullMap('tracking-map-container');
          window.vozxMap.startDriverTracking(this.bookedRide ? this.bookedRide.category : 'bike');
        }
      }, 100);
    } else if (screenId === 'screen-history') {
      this.updateBottomNavState('trips');
    } else if (screenId === 'screen-wallet') {
      this.updateBottomNavState('wallet');
    } else if (screenId === 'screen-offers') {
      this.updateBottomNavState('offers');
    } else if (screenId === 'screen-profile') {
      this.updateBottomNavState('profile');
    }
  }

  updateDynamicIsland(text) {
    const diText = document.getElementById('dynamic-island-text');
    if (diText) {
      diText.textContent = text;
    }
  }

  updateBottomNavState(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.nav-tab').forEach(tab => {
      const currentTab = tab.getAttribute('data-tab');
      if (currentTab === tabName) {
        tab.classList.add('active');
        const icon = tab.querySelector('.nav-icon');
        if (icon) icon.classList.add('text-cyan-400');
        const label = tab.querySelector('.nav-label');
        if (label) label.classList.add('text-cyan-400', 'font-semibold');
      } else {
        tab.classList.remove('active');
        const icon = tab.querySelector('.nav-icon');
        if (icon) icon.classList.remove('text-cyan-400');
        const label = tab.querySelector('.nav-label');
        if (label) label.classList.remove('text-cyan-400', 'font-semibold');
      }
    });

    // Move the glow indicator
    const indicator = document.getElementById('nav-indicator');
    const activeTabEl = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
    if (indicator && activeTabEl) {
      const left = activeTabEl.offsetLeft + activeTabEl.offsetWidth / 2 - 12;
      indicator.style.left = `${left}px`;
    }
  }

  // Device Frame Switcher
  setDeviceMode(mode) {
    this.deviceMode = mode;
    const container = document.getElementById('device-frame-container');
    const notchEl = document.getElementById('device-notch-area');
    const homeIndicator = document.getElementById('device-home-bar');

    if (!container) return;

    // Reset buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
      if (btn.getAttribute('data-device') === mode) {
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-[0_0_10px_#2563EB]');
        btn.classList.remove('bg-slate-800', 'text-slate-400');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-[0_0_10px_#2563EB]');
        btn.classList.add('bg-slate-800', 'text-slate-400');
      }
    });

    container.className = 'device-container';
    if (mode === 'iphone') {
      container.classList.add('frame-iphone');
      if (notchEl) notchEl.innerHTML = `
        <div class="dynamic-island flex items-center justify-between px-3 text-[11px] text-cyan-300">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span id="dynamic-island-text" class="text-[10px] font-medium tracking-tight">VOZX</span>
          </div>
          <div class="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
        </div>
      `;
      if (homeIndicator) homeIndicator.style.display = 'block';
    } else if (mode === 'pixel') {
      container.classList.add('frame-pixel');
      if (notchEl) notchEl.innerHTML = `
        <div class="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 mx-auto shadow-inner"></div>
      `;
      if (homeIndicator) homeIndicator.style.display = 'block';
    } else {
      container.classList.add('frame-fullscreen');
      if (notchEl) notchEl.innerHTML = `
        <div class="flex items-center justify-between w-full px-4 text-xs text-slate-400">
          <span>9:41</span>
          <span class="text-cyan-400 font-bold tracking-wider">VOZX</span>
          <span>100%</span>
        </div>
      `;
      if (homeIndicator) homeIndicator.style.display = 'none';
    }

    if (window.vozxMap) {
      setTimeout(() => {
        if (window.vozxMap.mapInstance) window.vozxMap.mapInstance.invalidateSize();
        if (window.vozxMap.previewMapInstance) window.vozxMap.previewMapInstance.invalidateSize();
      }, 350);
    }
  }

  // Event Listeners & Interactive Handlers
  bindEvents() {
    // Device switch buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-device');
        this.setDeviceMode(mode);
      });
    });

    // Audio mute toggle
    const audioToggleBtn = document.getElementById('btn-toggle-audio');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        const muted = window.soundFX ? window.soundFX.toggleMute() : false;
        audioToggleBtn.innerHTML = muted
          ? `<svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>`
          : `<svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>`;
      });
    }

    // Splash buttons
    const btnGetStarted = document.getElementById('btn-splash-get-started');
    if (btnGetStarted) {
      btnGetStarted.addEventListener('click', () => {
        this.navigateTo('screen-onboarding');
      });
    }

    const btnSplashLogin = document.getElementById('btn-splash-login');
    if (btnSplashLogin) {
      btnSplashLogin.addEventListener('click', () => {
        this.navigateTo('screen-auth');
      });
    }

    // Onboarding carousel steps
    const btnNextOnboarding = document.getElementById('btn-onboard-next');
    if (btnNextOnboarding) {
      btnNextOnboarding.addEventListener('click', () => {
        this.nextOnboardingStep();
      });
    }

    const btnSkipOnboarding = document.getElementById('btn-onboard-skip');
    if (btnSkipOnboarding) {
      btnSkipOnboarding.addEventListener('click', () => {
        this.navigateTo('screen-home');
      });
    }

    // Auth screen tabs
    const btnPhoneAuth = document.getElementById('btn-auth-phone');
    const btnEmailAuth = document.getElementById('btn-auth-email');
    if (btnPhoneAuth) {
      btnPhoneAuth.addEventListener('click', () => {
        document.getElementById('auth-phone-section').classList.remove('hidden');
        document.getElementById('auth-email-section').classList.add('hidden');
        btnPhoneAuth.classList.add('border-cyan-400', 'text-cyan-300');
        btnEmailAuth.classList.remove('border-cyan-400', 'text-cyan-300');
      });
    }
    if (btnEmailAuth) {
      btnEmailAuth.addEventListener('click', () => {
        document.getElementById('auth-email-section').classList.remove('hidden');
        document.getElementById('auth-phone-section').classList.add('hidden');
        btnEmailAuth.classList.add('border-cyan-400', 'text-cyan-300');
        btnPhoneAuth.classList.remove('border-cyan-400', 'text-cyan-300');
      });
    }

    // Send OTP button
    const btnSendOtp = document.getElementById('btn-send-otp');
    if (btnSendOtp) {
      btnSendOtp.addEventListener('click', () => {
        const phone = document.getElementById('input-phone').value;
        if (!phone || phone.length < 10) {
          this.showToast('Please enter a valid 10-digit number');
          return;
        }
        document.getElementById('otp-verify-drawer').classList.remove('hidden');
        this.startOtpTimer();
        this.showToast('OTP sent to ' + phone + ' (Code: 4921)');
      });
    }

    // Verify OTP button
    const btnVerifyOtp = document.getElementById('btn-verify-otp');
    if (btnVerifyOtp) {
      btnVerifyOtp.addEventListener('click', () => {
        this.showToast('Verified successfully! Welcome, Varun');
        if (window.soundFX) window.soundFX.playSuccess();
        setTimeout(() => this.navigateTo('screen-home'), 400);
      });
    }

    // Social login buttons
    document.querySelectorAll('.btn-social-login').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const provider = e.currentTarget.getAttribute('data-provider');
        this.showToast(`Signing in with ${provider}...`);
        if (window.soundFX) window.soundFX.playSuccess();
        setTimeout(() => this.navigateTo('screen-home'), 500);
      });
    });

    // Home Screen buttons
    const btnSearchRide = document.getElementById('btn-home-search-rides');
    if (btnSearchRide) {
      btnSearchRide.addEventListener('click', () => {
        this.startLiveComparison();
      });
    }

    const dropCardHome = document.getElementById('home-drop-selector');
    if (dropCardHome) {
      dropCardHome.addEventListener('click', () => {
        this.navigateTo('screen-search');
      });
    }

    // Floating AI button
    const floatingAiBtn = document.getElementById('floating-ai-btn');
    if (floatingAiBtn) {
      floatingAiBtn.addEventListener('click', () => {
        this.navigateTo('screen-ai-recommendation');
      });
    }

    // Bottom Navigation clicks
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab');
        if (targetTab === 'home') this.navigateTo('screen-home');
        else if (targetTab === 'trips') this.navigateTo('screen-history');
        else if (targetTab === 'wallet') this.navigateTo('screen-wallet');
        else if (targetTab === 'offers') this.navigateTo('screen-offers');
        else if (targetTab === 'profile') this.navigateTo('screen-profile');
      });
    });

    // Search screen destination input
    const searchInput = document.getElementById('destination-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearchFilter(e.target.value);
      });
    }

    // Voice search button
    const btnVoiceSearch = document.getElementById('btn-voice-search');
    if (btnVoiceSearch) {
      btnVoiceSearch.addEventListener('click', () => {
        this.triggerVoiceSearchModal();
      });
    }

    // Comparison Category Filter Pills
    document.querySelectorAll('.category-filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const category = e.currentTarget.getAttribute('data-category');
        this.filterRidesByCategory(category);
      });
    });

    // Traffic Toggle
    const btnToggleTraffic = document.getElementById('btn-toggle-traffic');
    if (btnToggleTraffic) {
      btnToggleTraffic.addEventListener('click', () => {
        if (window.vozxMap) {
          const visible = window.vozxMap.toggleTraffic();
          this.showToast(visible ? 'Traffic layer enabled' : 'Traffic layer disabled');
        }
      });
    }

    // AI Predictor Quick Button
    const btnAiPredictor = document.getElementById('btn-open-ai-predictor');
    if (btnAiPredictor) {
      btnAiPredictor.addEventListener('click', () => {
        document.getElementById('modal-price-predictor').classList.remove('hidden');
      });
    }

    // Split Fare Button
    const btnSplitFare = document.getElementById('btn-open-split-fare');
    if (btnSplitFare) {
      btnSplitFare.addEventListener('click', () => {
        document.getElementById('modal-split-fare').classList.remove('hidden');
      });
    }

    // Emergency SOS Button
    const btnSosTrigger = document.getElementById('btn-trigger-sos');
    if (btnSosTrigger) {
      btnSosTrigger.addEventListener('click', () => {
        this.openSosModal();
      });
    }

    // Close Modal triggers
    document.querySelectorAll('.modal-close-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.currentTarget.closest('.modal-overlay');
        if (modal) modal.classList.add('hidden');
      });
    });

    // Book Ride Button on Details Screen
    const btnBookNow = document.getElementById('btn-book-now');
    if (btnBookNow) {
      btnBookNow.addEventListener('click', () => {
        this.confirmBooking();
      });
    }

    // Ride Tracking Actions
    const btnCallDriver = document.getElementById('btn-call-driver');
    if (btnCallDriver) {
      btnCallDriver.addEventListener('click', () => {
        document.getElementById('modal-driver-call').classList.remove('hidden');
      });
    }

    const btnChatDriver = document.getElementById('btn-chat-driver');
    if (btnChatDriver) {
      btnChatDriver.addEventListener('click', () => {
        document.getElementById('drawer-driver-chat').classList.remove('hidden');
      });
    }

    const btnCancelRide = document.getElementById('btn-cancel-ride');
    if (btnCancelRide) {
      btnCancelRide.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel this ride?')) {
          if (window.vozxMap) window.vozxMap.stopDriverTracking();
          this.showToast('Ride cancelled');
          this.navigateTo('screen-home');
        }
      });
    }

    // Quick chat send
    const btnSendChat = document.getElementById('btn-send-chat');
    const inputChat = document.getElementById('input-chat-message');
    if (btnSendChat && inputChat) {
      const sendMsg = () => {
        const val = inputChat.value.trim();
        if (!val) return;
        this.appendChatMessage(val, true);
        inputChat.value = '';
        setTimeout(() => {
          this.appendChatMessage("Understood, I'm arriving at the gate shortly! 👍", false);
        }, 1200);
      };
      btnSendChat.addEventListener('click', sendMsg);
      inputChat.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMsg();
      });
    }

    // Quick chat suggestion chips
    document.querySelectorAll('.quick-chat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.currentTarget.textContent.trim();
        this.appendChatMessage(text, true);
        setTimeout(() => {
          this.appendChatMessage("Got it! On my way.", false);
        }, 1200);
      });
    });

    // Add Money to Wallet
    document.querySelectorAll('.wallet-quick-add').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const amount = parseInt(e.currentTarget.getAttribute('data-amount'));
        APP_DATA.wallet.balance += amount;
        this.updateWalletDisplay();
        this.showToast(`₹${amount} added to VOZX Wallet via UPI`);
        if (window.soundFX) window.soundFX.playSuccess();
      });
    });

    // Saved places add modal
    const btnAddSavedPlace = document.getElementById('btn-add-saved-place');
    if (btnAddSavedPlace) {
      btnAddSavedPlace.addEventListener('click', () => {
        document.getElementById('modal-add-place').classList.remove('hidden');
      });
    }

    const btnSaveNewPlace = document.getElementById('btn-save-new-place');
    if (btnSaveNewPlace) {
      btnSaveNewPlace.addEventListener('click', () => {
        const title = document.getElementById('input-place-name').value;
        const address = document.getElementById('input-place-address').value;
        if (!title || !address) {
          this.showToast('Please fill in both name and address');
          return;
        }
        APP_DATA.savedPlaces.push({
          id: 'saved-' + Date.now(),
          type: 'custom',
          title: title,
          address: address,
          icon: 'map-pin',
          tag: 'Saved',
          lat: 16.71,
          lng: 74.42
        });
        this.renderSavedPlaces();
        document.getElementById('modal-add-place').classList.add('hidden');
        this.showToast(`"${title}" added to saved places!`);
      });
    }

    // Repeat ride trigger in ride history
    document.addEventListener('click', (e) => {
      const repeatBtn = e.target.closest('.btn-repeat-ride');
      if (repeatBtn) {
        const tripId = repeatBtn.getAttribute('data-trip-id');
        const trip = APP_DATA.rideHistory.find(t => t.id === tripId);
        if (trip) {
          this.currentDestination = {
            name: trip.to,
            address: trip.to + ", Ichalkaranji",
            lat: 16.7450,
            lng: 74.3725
          };
          this.startLiveComparison();
        }
      }

      const invoiceBtn = e.target.closest('.btn-view-invoice');
      if (invoiceBtn) {
        const tripId = invoiceBtn.getAttribute('data-trip-id');
        this.showInvoiceModal(tripId);
      }
    });

    // Promo code apply in wallet
    const btnApplyPromo = document.getElementById('btn-apply-promo');
    if (btnApplyPromo) {
      btnApplyPromo.addEventListener('click', () => {
        const code = document.getElementById('input-promo-code').value.trim();
        if (code === 'VOZX50' || code === 'UBERVOZX30' || code === 'VOZXAI') {
          APP_DATA.wallet.balance += 50;
          this.updateWalletDisplay();
          this.showToast(`Coupon "${code}" applied! ₹50 credited`);
          if (window.soundFX) window.soundFX.playSuccess();
        } else {
          this.showToast('Invalid or expired coupon code');
        }
      });
    }

    // Back button triggers
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => {
        this.goBack();
      });
    });
  }

  // Onboarding Carousel
  nextOnboardingStep() {
    const steps = [
      {
        title: "Compare ride prices instantly.",
        desc: "Find the cheapest ride from Rapido, Uber, Ola, and BluSmart within seconds.",
        img: "assets/images/splash_hero.jpg",
        badge: "Live Multi-App Comparison"
      },
      {
        title: "Save money every single trip.",
        desc: "See cheapest, fastest, and best rated rides side by side with transparent fares.",
        img: "assets/images/reference_mockup.jpg",
        badge: "Save Up To 35%"
      },
      {
        title: "AI recommends the smartest ride.",
        desc: "Based on real-time price, live traffic, rain surcharge, and driver proximity.",
        img: "assets/images/ai_chip.jpg",
        badge: "VOZX Quantum Engine"
      }
    ];

    this.onboardingStep++;
    if (this.onboardingStep >= steps.length) {
      this.navigateTo('screen-auth');
      return;
    }

    const currentData = steps[this.onboardingStep];
    document.getElementById('onboard-title').textContent = currentData.title;
    document.getElementById('onboard-desc').textContent = currentData.desc;
    document.getElementById('onboard-badge').textContent = currentData.badge;
    document.getElementById('onboard-img').src = currentData.img;

    // Update dots
    document.querySelectorAll('.onboard-dot').forEach((dot, idx) => {
      if (idx === this.onboardingStep) {
        dot.className = 'onboard-dot w-6 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE] transition-all';
      } else {
        dot.className = 'onboard-dot w-2 h-2 rounded-full bg-slate-700 transition-all';
      }
    });

    if (this.onboardingStep === steps.length - 1) {
      document.getElementById('btn-onboard-next').textContent = "Start Riding";
    }

    if (window.soundFX) window.soundFX.playSelect();
  }

  // OTP Timer
  startOtpTimer() {
    this.otpSeconds = 30;
    const timerEl = document.getElementById('otp-timer-count');
    if (this.otpTimer) clearInterval(this.otpTimer);

    this.otpTimer = setInterval(() => {
      this.otpSeconds--;
      if (timerEl) timerEl.textContent = `(${this.otpSeconds}s)`;
      if (this.otpSeconds <= 0) {
        clearInterval(this.otpTimer);
        if (timerEl) timerEl.textContent = '';
      }
    }, 1000);
  }

  // Start Live Ride Comparison with loading animation
  startLiveComparison() {
    this.navigateTo('screen-comparison');
    const loadingCard = document.getElementById('comparison-loading-state');
    const resultsContainer = document.getElementById('comparison-results-list');
    
    if (loadingCard && resultsContainer) {
      loadingCard.classList.remove('hidden');
      resultsContainer.classList.add('opacity-40');
      this.isComparing = true;

      if (window.soundFX) window.soundFX.playAiBeep();

      setTimeout(() => {
        loadingCard.classList.add('hidden');
        resultsContainer.classList.remove('opacity-40');
        this.isComparing = false;
        this.showToast('Found 10 rides across 5 providers!');
        if (window.soundFX) window.soundFX.playSuccess();
      }, 1200);
    }
  }

  // Filter rides by category
  filterRidesByCategory(category) {
    this.selectedCategory = category;
    document.querySelectorAll('.category-filter-pill').forEach(pill => {
      const cat = pill.getAttribute('data-category');
      if (cat === category) {
        pill.classList.add('bg-blue-600', 'text-white', 'border-cyan-400', 'shadow-[0_0_12px_#2563EB]');
        pill.classList.remove('bg-slate-900', 'text-slate-400', 'border-slate-800');
      } else {
        pill.classList.remove('bg-blue-600', 'text-white', 'border-cyan-400', 'shadow-[0_0_12px_#2563EB]');
        pill.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
      }
    });

    this.renderRideList();
    if (window.soundFX) window.soundFX.playSelect();
  }

  // Render ride cards
  renderRideList() {
    const container = document.getElementById('comparison-results-list');
    if (!container) return;

    let filtered = APP_DATA.rides;
    if (this.selectedCategory !== 'all') {
      filtered = APP_DATA.rides.filter(r => r.category === this.selectedCategory);
    }

    container.innerHTML = filtered.map(ride => {
      const providerLogoHtml = this.getProviderLogo(ride.provider);
      const badgeHtml = ride.badge ? `
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
          ride.badgeColor === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          ride.badgeColor === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
          ride.badgeColor === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }">${ride.badge}</span>
      ` : '';

      return `
        <div class="glass-panel p-3.5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between group" onclick="app.selectRide('${ride.id}')">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              ${providerLogoHtml}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">${ride.vehicleName}</h4>
                ${badgeHtml}
              </div>
              <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>${ride.categoryName}</span>
                <span>•</span>
                <span class="text-cyan-400 font-medium">${ride.etaMins} min</span>
                <span>•</span>
                <span class="text-amber-400 flex items-center text-[11px]">★ ${ride.rating}</span>
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors">₹${ride.price}</div>
            <div class="text-[10px] text-slate-500 line-through">₹${ride.originalPrice}</div>
            <div class="text-[10px] text-emerald-400 font-medium">${ride.discount}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  getProviderLogo(provider) {
    if (provider === 'Rapido') {
      return `
        <div class="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.3)]">
          <svg class="w-7 h-7 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/>
          </svg>
        </div>
      `;
    } else if (provider === 'Uber') {
      return `
        <div class="w-12 h-12 rounded-xl bg-black border border-slate-700 flex items-center justify-center shadow-lg">
          <span class="text-white font-extrabold text-xs tracking-tight">Uber</span>
        </div>
      `;
    } else if (provider === 'Ola') {
      return `
        <div class="w-12 h-12 rounded-xl bg-black border border-slate-700 flex items-center justify-center shadow-lg">
          <div class="w-7 h-7 rounded-full border-4 border-lime-400 flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-lime-400"></div>
          </div>
        </div>
      `;
    } else if (provider === 'BluSmart') {
      return `
        <div class="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.3)]">
          <svg class="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
      `;
    } else {
      // Namma Yatri
      return `
        <div class="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.3)]">
          <span class="text-white font-black text-[10px] tracking-tight">NY</span>
        </div>
      `;
    }
  }

  // Select Ride & View Details Screen
  selectRide(rideId) {
    const ride = APP_DATA.rides.find(r => r.id === rideId);
    if (!ride) return;
    this.selectedRide = ride;

    // Populate Details Screen
    document.getElementById('details-provider-name').textContent = ride.vehicleName;
    document.getElementById('details-provider-category').textContent = `${ride.categoryName} · ${ride.features[0]}`;
    document.getElementById('details-price').textContent = `₹${ride.price}`;
    document.getElementById('details-original-price').textContent = `₹${ride.originalPrice}`;
    document.getElementById('details-eta').textContent = `${ride.etaMins} mins`;
    document.getElementById('details-driver-min').textContent = `${ride.driverDistanceMin} min away`;
    document.getElementById('details-rating').textContent = `${ride.rating} (${ride.reviews} ratings)`;
    
    // Logo
    document.getElementById('details-logo-container').innerHTML = this.getProviderLogo(ride.provider);

    // Route info
    document.getElementById('details-pickup-text').textContent = this.currentPickup.name;
    document.getElementById('details-pickup-sub').textContent = this.currentPickup.address;
    document.getElementById('details-drop-text').textContent = this.currentDestination.name;
    document.getElementById('details-drop-sub').textContent = this.currentDestination.address;

    // Fare breakdown
    const b = ride.fareBreakdown;
    document.getElementById('details-fare-base').textContent = `₹${b.baseFare}`;
    document.getElementById('details-fare-dist').textContent = `₹${b.distanceFare}`;
    document.getElementById('details-fare-tax').textContent = `₹${b.taxes}`;
    document.getElementById('details-fare-platform').textContent = b.platformFee === 0 ? 'FREE' : `₹${b.platformFee}`;
    document.getElementById('details-fare-coupon').textContent = `-₹${b.couponDiscount}`;
    document.getElementById('details-fare-total').textContent = `₹${ride.price}`;

    this.navigateTo('screen-details');
  }

  confirmBooking() {
    this.bookedRide = this.selectedRide;
    if (window.soundFX) window.soundFX.playSuccess();
    this.showToast(`Ride booked with ${this.selectedRide.provider}! Driver assigned.`);
    
    // Setup Tracking Screen
    const d = this.selectedRide.driver;
    document.getElementById('tracking-driver-name').textContent = d.name;
    document.getElementById('tracking-driver-rating').textContent = `★ ${d.rating} (${d.trips} rides)`;
    document.getElementById('tracking-driver-vehicle').textContent = d.vehicle;
    document.getElementById('tracking-driver-plate').textContent = d.plate;
    document.getElementById('tracking-otp-pin').textContent = d.otp;

    this.navigateTo('screen-tracking');
  }

  // Voice Search Simulation
  triggerVoiceSearchModal() {
    const modal = document.getElementById('modal-voice-search');
    modal.classList.remove('hidden');
    if (window.soundFX) window.soundFX.playAiBeep();

    const voiceStatus = document.getElementById('voice-search-status');
    const voiceText = document.getElementById('voice-transcribed-text');
    voiceStatus.textContent = "Listening for destination...";
    voiceText.textContent = "";

    setTimeout(() => {
      voiceText.textContent = '"Take me to Sanjay Ghodawat University"';
      voiceStatus.textContent = "Recognized destination!";
    }, 1800);

    setTimeout(() => {
      modal.classList.add('hidden');
      this.currentDestination = APP_DATA.defaultRoute.destination;
      this.startLiveComparison();
    }, 3200);
  }

  // Search filtering
  handleSearchFilter(query) {
    this.searchQuery = query.toLowerCase();
    const resultsContainer = document.getElementById('search-live-results');
    if (!resultsContainer) return;

    if (!query) {
      this.renderRecentSearches();
      return;
    }

    const matches = APP_DATA.recentDestinations.filter(d =>
      d.name.toLowerCase().includes(this.searchQuery) ||
      d.subtitle.toLowerCase().includes(this.searchQuery) ||
      d.city.toLowerCase().includes(this.searchQuery)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center py-8 text-slate-500 text-xs">
          No matching places found. Try searching "University", "Pune", or "Home".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(item => `
      <div class="glass-panel p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:border-cyan-500/40 transition-all mb-2" onclick="app.selectDestination('${item.id}')">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
          </div>
          <div>
            <h5 class="text-sm font-semibold text-white">${item.name}</h5>
            <p class="text-[11px] text-slate-400">${item.subtitle}</p>
          </div>
        </div>
        <div class="text-xs text-cyan-400 font-medium">${item.distance}</div>
      </div>
    `).join('');
  }

  selectDestination(destId) {
    const dest = APP_DATA.recentDestinations.find(d => d.id === destId);
    if (!dest) return;
    this.currentDestination = dest;
    this.startLiveComparison();
  }

  // Render recent searches
  renderRecentSearches() {
    const container = document.getElementById('search-live-results');
    const homeRecentContainer = document.getElementById('home-recent-list');
    
    const itemsHtml = APP_DATA.recentDestinations.slice(0, 3).map(item => `
      <div class="glass-panel p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:border-cyan-500/40 transition-all mb-2 group" onclick="app.selectDestination('${item.id}')">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h5 class="text-xs font-semibold text-white group-hover:text-cyan-300">${item.name}</h5>
            <p class="text-[10px] text-slate-400">${item.city}</p>
          </div>
        </div>
        <svg class="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </div>
    `).join('');

    if (container) container.innerHTML = itemsHtml;
    if (homeRecentContainer) homeRecentContainer.innerHTML = itemsHtml;
  }

  // Render Saved Places
  renderSavedPlaces() {
    const container = document.getElementById('saved-places-list');
    const homeChipsContainer = document.getElementById('home-saved-chips');

    if (container) {
      container.innerHTML = APP_DATA.savedPlaces.map(place => `
        <div class="glass-panel p-3.5 rounded-2xl flex items-center justify-between mb-3 border border-slate-800/80 hover:border-cyan-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-950/50 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold text-white">${place.title}</h4>
                <span class="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">${place.tag}</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">${place.address}</p>
            </div>
          </div>
          <button class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-xs text-cyan-400 font-medium" onclick="app.selectSavedDestination('${place.id}')">
            Ride
          </button>
        </div>
      `).join('');
    }

    if (homeChipsContainer) {
      homeChipsContainer.innerHTML = APP_DATA.savedPlaces.slice(0, 4).map(place => `
        <button class="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-cyan-400 text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 shrink-0 transition-all" onclick="app.selectSavedDestination('${place.id}')">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>${place.title}</span>
        </button>
      `).join('');
    }
  }

  selectSavedDestination(placeId) {
    const place = APP_DATA.savedPlaces.find(p => p.id === placeId);
    if (!place) return;
    this.currentDestination = {
      name: place.title,
      address: place.address,
      lat: place.lat,
      lng: place.lng
    };
    this.startLiveComparison();
  }

  // Render Ride History
  renderRideHistory() {
    const container = document.getElementById('history-trips-list');
    if (!container) return;

    container.innerHTML = APP_DATA.rideHistory.map(trip => `
      <div class="glass-panel p-4 rounded-2xl border border-slate-800/80 mb-3 hover:border-cyan-500/30 transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm text-white">${trip.provider}</span>
            <span class="text-xs text-slate-400">• ${trip.vehicleType}</span>
          </div>
          <span class="font-extrabold text-sm text-cyan-400">₹${trip.price}</span>
        </div>
        <div class="text-xs text-slate-300 space-y-1 mb-3">
          <div class="flex items-center gap-1.5 text-slate-400">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span class="truncate">${trip.from}</span>
          </div>
          <div class="flex items-center gap-1.5 text-slate-300">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span class="truncate font-medium">${trip.to}</span>
          </div>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span>${trip.date}</span>
          <div class="flex items-center gap-2">
            <button class="btn-repeat-ride text-cyan-400 hover:text-cyan-300 font-semibold" data-trip-id="${trip.id}">Repeat</button>
            <span>•</span>
            <button class="btn-view-invoice text-slate-400 hover:text-white" data-trip-id="${trip.id}">Invoice</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Offers & Scratch Cards
  renderOffers() {
    const container = document.getElementById('offers-cards-list');
    if (!container) return;

    container.innerHTML = APP_DATA.offers.map(off => `
      <div class="glass-panel p-4 rounded-2xl border border-slate-800 mb-3 hover:border-cyan-500/40 transition-all">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold uppercase tracking-wider text-cyan-400">${off.provider}</span>
          <span class="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">${off.tag}</span>
        </div>
        <h4 class="text-sm font-bold text-white mb-1">${off.title}</h4>
        <p class="text-xs text-slate-400 mb-3">${off.desc}</p>
        <div class="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-dashed border-slate-700">
          <span class="text-xs font-mono font-bold text-cyan-300 tracking-wider">${off.code}</span>
          <button class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg font-medium shadow-[0_0_8px_#2563EB]" onclick="app.copyCoupon('${off.code}')">
            Copy
          </button>
        </div>
      </div>
    `).join('');
  }

  copyCoupon(code) {
    navigator.clipboard?.writeText(code);
    this.showToast(`Coupon "${code}" copied to clipboard!`);
    if (window.soundFX) window.soundFX.playSelect();
  }

  // Scratch card initialization
  initScratchCards() {
    const cardEl = document.getElementById('scratch-card-box');
    const canvas = document.getElementById('scratch-canvas');
    if (!cardEl || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = cardEl.offsetWidth || 280;
    canvas.height = cardEl.offsetHeight || 140;

    // Draw metallic scratch overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(0.5, '#334155');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE TO WIN ✨', canvas.width / 2, canvas.height / 2 + 5);

    let isScratching = false;

    const scratch = (e) => {
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      if (window.soundFX && Math.random() > 0.6) {
        window.soundFX.playScratch();
      }
    };

    canvas.addEventListener('mousedown', () => isScratching = true);
    window.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      scratch(e);
    });
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', () => isScratching = false);
  }

  // Render Wallet Transactions
  renderWalletTransactions() {
    const container = document.getElementById('wallet-tx-list');
    if (!container) return;

    this.updateWalletDisplay();

    container.innerHTML = APP_DATA.wallet.transactions.map(tx => `
      <div class="glass-panel p-3 rounded-2xl flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} flex items-center justify-center">
            ${tx.type === 'credit' ? '↓' : '↑'}
          </div>
          <div>
            <h5 class="text-xs font-semibold text-white">${tx.title}</h5>
            <p class="text-[10px] text-slate-400">${tx.date}</p>
          </div>
        </div>
        <span class="text-xs font-extrabold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-300'}">
          ${tx.type === 'credit' ? '+' : '-'}₹${tx.amount.toFixed(2)}
        </span>
      </div>
    `).join('');
  }

  updateWalletDisplay() {
    const balEl = document.getElementById('wallet-total-balance');
    const cashEl = document.getElementById('wallet-total-cashback');
    if (balEl) balEl.textContent = `₹${APP_DATA.wallet.balance.toFixed(2)}`;
    if (cashEl) cashEl.textContent = `₹${APP_DATA.wallet.cashbackEarned.toFixed(2)}`;
  }

  // Render Notifications
  renderNotifications() {
    const container = document.getElementById('notifications-list');
    if (!container) return;

    container.innerHTML = APP_DATA.notifications.map(n => `
      <div class="glass-panel p-3.5 rounded-2xl border ${n.unread ? 'border-cyan-500/50 bg-slate-900/90' : 'border-slate-800/80'} mb-2.5 flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 ${n.iconColor}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-white">${n.title}</h4>
            <span class="text-[10px] text-slate-500">${n.time}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">${n.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // 30-Minute AI Price Predictor Chart
  renderPredictionChart() {
    const container = document.getElementById('price-predictor-chart');
    if (!container) return;

    const data = APP_DATA.pricePredictionSeries;
    const maxPrice = 100;
    const minPrice = 50;

    const width = 320;
    const height = 110;
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 40) + 20;
      const y = height - ((d.price - minPrice) / (maxPrice - minPrice)) * (height - 30) - 15;
      return { x, y, ...d };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#22D3EE" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Area -->
        <path d="${areaD}" fill="url(#chartGrad)"/>
        <!-- Line -->
        <path d="${pathD}" fill="none" stroke="#22D3EE" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 0 6px #22D3EE)"/>
        <!-- Points -->
        ${points.map(p => `
          <g>
            <circle cx="${p.x}" cy="${p.y}" r="${p.minute === '+10m' ? 6 : 4}" fill="${p.minute === '+10m' ? '#22C55E' : '#22D3EE'}" stroke="#030712" stroke-width="2"/>
            <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="${p.minute === '+10m' ? '#22C55E' : '#94a3b8'}" font-size="10" font-weight="bold">₹${p.price}</text>
            <text x="${p.x}" y="${height + 14}" text-anchor="middle" fill="#64748b" font-size="9">${p.minute}</text>
          </g>
        `).join('')}
      </svg>
    `;
  }

  // SOS Emergency Trigger
  openSosModal() {
    const modal = document.getElementById('modal-sos-emergency');
    modal.classList.remove('hidden');
    if (window.soundFX) window.soundFX.startSiren();
  }

  closeSosModal() {
    const modal = document.getElementById('modal-sos-emergency');
    modal.classList.add('hidden');
    if (window.soundFX) window.soundFX.stopSiren();
  }

  // In-app chat messaging
  appendChatMessage(text, isMe = true) {
    const chatBox = document.getElementById('chat-messages-container');
    if (!chatBox) return;

    const div = document.createElement('div');
    div.className = `flex ${isMe ? 'justify-end' : 'justify-start'} mb-2.5`;
    div.innerHTML = `
      <div class="max-w-[75%] p-2.5 rounded-2xl text-xs ${isMe ? 'bg-blue-600 text-white rounded-br-none shadow-[0_0_8px_#2563EB]' : 'bg-slate-800 text-slate-200 rounded-bl-none'}">
        ${text}
      </div>
    `;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (window.soundFX) window.soundFX.playTap();
  }

  // Invoice viewer modal
  showInvoiceModal(tripId) {
    const trip = APP_DATA.rideHistory.find(t => t.id === tripId);
    if (!trip) return;

    document.getElementById('invoice-trip-route').textContent = `${trip.from} → ${trip.to}`;
    document.getElementById('invoice-trip-date').textContent = trip.date;
    document.getElementById('invoice-trip-price').textContent = `₹${trip.price}`;
    document.getElementById('invoice-trip-id').textContent = trip.invoiceNumber;
    document.getElementById('modal-invoice').classList.remove('hidden');
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 2800);
  }
}

window.app = new VozxApp();

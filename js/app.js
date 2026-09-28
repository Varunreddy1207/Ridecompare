// VOZX RideCompare - Exact UI Controller & Interaction Router

class ExactAppController {
  constructor() {
    this.currentMode = 'board'; // 'board' (2x4 Figma grid) or 'focus' (single interactive phone simulator)
    this.currentScreen = 'screen-splash';
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.bindEvents();
      this.renderInteractiveScreen(this.currentScreen);
    });
  }

  bindEvents() {
    // Top Floating Mode Controls
    const btnBoard = document.getElementById('btn-mode-board');
    const btnFocus = document.getElementById('btn-mode-focus');
    const btnSound = document.getElementById('btn-toggle-sound');

    if (btnBoard) {
      btnBoard.addEventListener('click', () => this.setMode('board'));
    }
    if (btnFocus) {
      btnFocus.addEventListener('click', () => this.setMode('focus'));
    }
    if (btnSound) {
      btnSound.addEventListener('click', () => this.toggleSound());
    }
  }

  setMode(mode) {
    this.currentMode = mode;
    const boardContainer = document.getElementById('board-view');
    const focusContainer = document.getElementById('focus-view');
    const btnBoard = document.getElementById('btn-mode-board');
    const btnFocus = document.getElementById('btn-mode-focus');

    if (mode === 'board') {
      if (boardContainer) boardContainer.classList.remove('hidden');
      if (focusContainer) focusContainer.classList.add('hidden');

      if (btnBoard) {
        btnBoard.className = 'px-4 py-1.5 rounded-full text-xs font-bold bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] flex items-center gap-1.5 transition-all';
      }
      if (btnFocus) {
        btnFocus.className = 'px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-all';
      }
      this.showToast('Showing exact 2x4 Figma Board');
    } else {
      if (boardContainer) boardContainer.classList.add('hidden');
      if (focusContainer) focusContainer.classList.remove('hidden');

      if (btnFocus) {
        btnFocus.className = 'px-4 py-1.5 rounded-full text-xs font-bold bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] flex items-center gap-1.5 transition-all';
      }
      if (btnBoard) {
        btnBoard.className = 'px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-all';
      }
      this.renderInteractiveScreen(this.currentScreen);
      this.showToast('Interactive Simulator Active — Tap to Navigate');
    }

    if (window.soundFX) window.soundFX.playSelect();
  }

  toggleSound() {
    if (!window.soundFX) return;
    const isMuted = window.soundFX.toggleMute();
    const soundText = document.getElementById('sound-status-text');
    const soundIcon = document.getElementById('sound-icon');

    if (isMuted) {
      if (soundText) soundText.textContent = 'Muted';
      if (soundIcon) soundIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>`;
      this.showToast('Audio Muted');
    } else {
      if (soundText) soundText.textContent = 'Sound ON';
      if (soundIcon) soundIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;
      window.soundFX.playSuccess();
      this.showToast('Futuristic Tesla UI Audio Enabled');
    }
  }

  jumpToScreen(screenId) {
    this.currentScreen = screenId;
    this.setMode('focus');
  }

  navigateTo(screenId) {
    this.currentScreen = screenId;
    if (window.soundFX) window.soundFX.playTap();
    this.renderInteractiveScreen(screenId);
  }

  renderInteractiveScreen(screenId) {
    const viewport = document.getElementById('simulator-viewport');
    if (!viewport) return;

    if (screenId === 'screen-splash') {
      viewport.innerHTML = `
        <div class="flex-1 flex flex-col justify-between p-6 text-center relative overflow-hidden animate-fadeIn">
          <div class="absolute inset-0 z-0">
            <img src="assets/images/splash_hero.jpg" alt="Luxury Sports Car" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent"></div>
          </div>
          <div class="relative z-10 pt-10">
            <div class="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
              <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_16px_#38BDF8]">
                <defs>
                  <linearGradient id="simSplashGradR" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38BDF8"/>
                    <stop offset="45%" stop-color="#2563EB"/>
                    <stop offset="100%" stop-color="#818CF8"/>
                  </linearGradient>
                </defs>
                <path d="M25 15 H60 C75 15 85 25 85 40 C85 53 76 62 64 64 L85 90 H65 L48 68 H40 V90 H25 V15 Z M40 30 V53 H58 C66 53 71 49 71 41 C71 34 66 30 58 30 H40 Z" fill="url(#simSplashGradR)"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold tracking-tight text-white mb-1">
              Ride<span class="text-[#2563EB]">Compare</span>
            </h2>
            <p class="text-xs text-[#94A3B8] font-medium tracking-wide">One Ride. All Prices.</p>
          </div>
          <div class="relative z-10 space-y-4 pb-4">
            <p class="text-xs text-slate-300 px-3 leading-relaxed">
              Compare prices from all ride apps. Choose the best. Save money. Travel smarter.
            </p>
            <button onclick="app.navigateTo('screen-home')" class="btn-primary-blue text-btn py-3.5">
              Get Started
            </button>
            <button onclick="app.navigateTo('screen-home')" class="text-xs text-[#2563EB] hover:text-[#38BDF8] font-semibold block mx-auto transition-colors">
              Login
            </button>
          </div>
        </div>
      `;
    } else if (screenId === 'screen-home') {
      viewport.innerHTML = `
        <div class="flex-1 p-5 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            <!-- Header -->
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <svg viewBox="0 0 100 100" class="w-6 h-6 filter drop-shadow-[0_0_6px_#38BDF8]">
                  <path d="M25 15 H60 C75 15 85 25 85 40 C85 53 76 62 64 64 L85 90 H65 L48 68 H40 V90 H25 V15 Z M40 30 V53 H58 C66 53 71 49 71 41 C71 34 66 30 58 30 H40 Z" fill="#2563EB"/>
                </svg>
                <span class="text-base font-bold text-white tracking-tight">Ride<span class="text-[#2563EB]">Compare</span></span>
              </div>
              <div onclick="app.navigateTo('screen-profile')" class="w-9 h-9 rounded-full bg-[#0B1220] border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-slate-300 cursor-pointer hover:border-blue-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
            </div>

            <!-- Greeting -->
            <h2 class="text-h font-bold text-white mb-5 leading-tight">
              Where do you want<br>to go?
            </h2>

            <!-- Pickup Location Card -->
            <div onclick="app.showToast('GPS: Current Location locked')" class="card-surface p-3.5 mb-2.5 flex items-center justify-between cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 flex items-center justify-center text-[#94A3B8]">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <span class="text-[11px] text-[#94A3B8] font-medium block">Pickup Location</span>
                  <span class="text-body font-bold text-white">Current Location</span>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>

            <!-- Drop Location Card -->
            <div onclick="app.navigateTo('screen-map')" class="card-surface p-3.5 mb-5 flex items-center justify-between cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 flex items-center justify-center text-[#94A3B8]">
                  <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <span class="text-[11px] text-[#94A3B8] font-medium block">Drop Location</span>
                  <span class="text-body font-medium text-slate-300">Select destination</span>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>

            <!-- Large Search Button -->
            <button onclick="app.navigateTo('screen-map')" class="btn-primary-blue rounded-[20px] py-3.5 text-btn mb-6">
              Search Rides
            </button>

            <!-- Recent Searches -->
            <div class="flex items-center justify-between mb-3">
              <span class="text-sub font-bold text-white">Recent Searches</span>
              <button onclick="app.showToast('Showing all history')" class="text-caption text-[#2563EB] font-bold hover:underline">See all</button>
            </div>

            <div class="space-y-2.5">
              <div onclick="app.navigateTo('screen-map')" class="flex items-center gap-3 py-2 cursor-pointer border-b border-[#0f172a] group">
                <div class="w-8 h-8 rounded-full bg-[#0B1220] border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-slate-400 group-hover:text-[#38BDF8]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h4 class="text-caption font-semibold text-white group-hover:text-[#38BDF8]">Sanjay Ghodawat University</h4>
                  <p class="text-[10px] text-[#94A3B8]">Ichalkaranji</p>
                </div>
              </div>

              <div onclick="app.navigateTo('screen-map')" class="flex items-center gap-3 py-2 cursor-pointer border-b border-[#0f172a] group">
                <div class="w-8 h-8 rounded-full bg-[#0B1220] border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-slate-400 group-hover:text-[#38BDF8]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h4 class="text-caption font-semibold text-white group-hover:text-[#38BDF8]">Pune Junction</h4>
                  <p class="text-[10px] text-[#94A3B8]">Pune</p>
                </div>
              </div>

              <div onclick="app.navigateTo('screen-map')" class="flex items-center gap-3 py-2 cursor-pointer group">
                <div class="w-8 h-8 rounded-full bg-[#0B1220] border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-slate-400 group-hover:text-[#38BDF8]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                </div>
                <div>
                  <h4 class="text-caption font-semibold text-white group-hover:text-[#38BDF8]">Home</h4>
                  <p class="text-[10px] text-[#94A3B8]">Ichalkaranji</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Navigation -->
          <div class="bottom-nav">
            <div class="nav-link active"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span>Home</span></div>
            <div onclick="app.navigateTo('screen-history')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>History</span></div>
            <div onclick="app.showToast('Saved Places')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg><span>Saved</span></div>
            <div onclick="app.navigateTo('screen-profile')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg><span>More</span></div>
          </div>
        </div>
      `;
    } else if (screenId === 'screen-map') {
      viewport.innerHTML = `
        <div class="flex-1 map-canvas flex flex-col justify-between p-3.5 relative overflow-hidden animate-fadeIn">
          <!-- Route SVG Overlay -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 600">
            <path d="M 0 140 L 340 180 M 80 0 L 100 600 M 260 0 L 240 600" stroke="#0e172a" stroke-width="2"/>
            <path d="M 70 430 Q 150 410, 190 350 T 240 190" fill="none" stroke="#2563EB" stroke-width="6" stroke-linecap="round" filter="drop-shadow(0 0 8px #38BDF8)"/>
            <path d="M 70 430 Q 150 410, 190 350 T 240 190" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="70" cy="430" r="7" fill="#2563EB" stroke="#FFFFFF" stroke-width="2.5"/>
            <text x="50" y="460" fill="#94A3B8" font-size="11" font-weight="700">Ichalkaranji</text>
            <circle cx="240" cy="190" r="7" fill="#EF4444" stroke="#FFFFFF" stroke-width="2.5"/>
          </svg>

          <!-- Top Floating Search Card -->
          <div class="relative z-10 flex items-center gap-2">
            <button onclick="app.navigateTo('screen-home')" class="w-8 h-8 rounded-full bg-[#0B1220] border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-white shrink-0 hover:border-blue-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>

            <div class="flex-1 bg-[#0B1220]/95 backdrop-blur-md border border-[rgba(59,130,246,0.18)] rounded-2xl p-2.5 px-3 flex items-center justify-between text-caption shadow-xl">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span class="text-slate-300 font-medium text-[11px]">Current Location</span>
                </div>
                <div class="h-px bg-slate-800"></div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  <span class="text-white font-bold text-[11px]">Sanjay Ghodawat University</span>
                </div>
              </div>
              <button onclick="app.showToast('Add stop feature')" class="w-6 h-6 rounded-full bg-[#161F30] text-white flex items-center justify-center text-xs font-bold hover:bg-blue-600">+</button>
            </div>
          </div>

          <!-- Bottom Floating Sheet -->
          <div class="relative z-10 space-y-2">
            <!-- GPS target crosshair -->
            <div class="flex justify-end pr-1">
              <div onclick="app.showToast('Re-centering map GPS')" class="w-8 h-8 rounded-full bg-[#0B1220]/95 backdrop-blur-md border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-slate-300 cursor-pointer hover:text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path stroke-linecap="round" stroke-width="2" d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
              </div>
            </div>

            <div class="bg-[#0B1220]/95 backdrop-blur-md border border-[rgba(59,130,246,0.18)] rounded-2xl p-3 shadow-2xl space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-[#94A3B8] flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
                  Comparing prices across 4 ride apps...
                </span>
                <span class="text-[9px] text-[#22C55E] font-bold">LIVE</span>
              </div>

              <!-- 4 Provider Buttons -->
              <div class="flex items-center justify-around py-0.5">
                <div onclick="app.navigateTo('screen-options')" class="flex flex-col items-center gap-1 cursor-pointer group">
                  <div class="w-11 h-11 rounded-2xl bg-black border border-[#1E293B] flex items-center justify-center text-white text-[11px] font-extrabold group-hover:border-blue-500">Uber</div>
                  <span class="text-[9px] text-[#94A3B8]">Uber</span>
                </div>
                <div onclick="app.navigateTo('screen-ola-details')" class="flex flex-col items-center gap-1 cursor-pointer group">
                  <div class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                    <div class="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                      <div class="w-4 h-4 rounded-full border-2 border-[#84CC16] flex items-center justify-center"><div class="w-1 h-1 bg-[#84CC16] rounded-full"></div></div>
                    </div>
                  </div>
                  <span class="text-[9px] text-[#94A3B8]">Ola</span>
                </div>
                <div onclick="app.navigateTo('screen-rapido-details')" class="flex flex-col items-center gap-1 cursor-pointer group">
                  <div class="w-11 h-11 rounded-2xl bg-[#FACC15] flex items-center justify-center text-black shadow group-hover:scale-105 transition-transform">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>
                  </div>
                  <span class="text-[9px] text-[#94A3B8] font-semibold text-white">Rapido</span>
                </div>
                <div onclick="app.navigateTo('screen-options')" class="flex flex-col items-center gap-1 cursor-pointer group">
                  <div class="w-11 h-11 rounded-2xl bg-[#111827] border border-[#1E293B] text-[#38BDF8] flex items-center justify-center font-bold text-base group-hover:border-cyan-400">+</div>
                  <span class="text-[9px] text-[#94A3B8]">Others</span>
                </div>
              </div>

              <!-- Best Price Card -->
              <div onclick="app.navigateTo('screen-rapido-details')" class="card-surface p-2.5 flex items-center justify-between cursor-pointer hover:border-green-400">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-[#FACC15] flex items-center justify-center">
                    <svg class="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>
                  </div>
                  <div>
                    <span class="text-[9px] text-[#22C55E] font-bold block flex items-center gap-1">✦ Best Price</span>
                    <h5 class="text-xs font-bold text-white">Rapido</h5>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-[#22C55E]">₹78</span>
                  <span class="text-[8px] text-[#94A3B8] block">(Estimated)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (screenId === 'screen-options') {
      viewport.innerHTML = `
        <div class="flex-1 p-4 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            <div class="flex items-center gap-2.5 mb-1.5">
              <button onclick="app.navigateTo('screen-map')" class="w-8 h-8 rounded-full bg-[#0B1220] border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-white hover:border-blue-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <h2 class="text-sub font-bold text-white">Ride Options</h2>
            </div>
            <div class="mb-3.5">
              <p class="text-caption text-slate-300 font-medium">Current Location &rarr; Sanjay Ghodawat University</p>
              <p class="text-[10px] text-[#94A3B8]">4.2 km &bull; 12 min (approx)</p>
            </div>

            <!-- Scrollable 84px Cards -->
            <div class="space-y-2">
              <div onclick="app.navigateTo('screen-rapido-details')" class="card-ride">
                <div class="flex items-center gap-3">
                  <div class="logo-rapido-sq">
                    <svg class="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>
                  </div>
                  <div>
                    <h4 class="text-body font-bold text-white">Rapido</h4>
                    <p class="text-caption text-[#94A3B8]">Bike &bull; 12 min</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="text-right">
                    <span class="text-body font-bold text-white block">₹78</span>
                    <span class="badge-green">Cheapest</span>
                  </div>
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.navigateTo('screen-ola-details')" class="card-ride">
                <div class="flex items-center gap-3">
                  <div class="logo-ola-sq">
                    <div class="logo-ola-black-circle"><div class="ring-ola"><div class="dot-ola"></div></div></div>
                  </div>
                  <div>
                    <h4 class="text-body font-bold text-white">Ola</h4>
                    <p class="text-caption text-[#94A3B8]">Bike &bull; 14 min</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-body font-bold text-white">₹92</span>
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.showToast('Uber Bike selected: ₹105')" class="card-ride">
                <div class="flex items-center gap-3">
                  <div class="logo-uber-sq">Uber</div>
                  <div>
                    <h4 class="text-body font-bold text-white">Uber</h4>
                    <p class="text-caption text-[#94A3B8]">Bike &bull; 15 min</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-body font-bold text-white">₹105</span>
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.navigateTo('screen-rapido-details')" class="card-ride">
                <div class="flex items-center gap-3">
                  <div class="logo-rapido-sq">
                    <svg class="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                  </div>
                  <div>
                    <h4 class="text-body font-bold text-white">Rapido</h4>
                    <p class="text-caption text-[#94A3B8]">Auto &bull; 16 min</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-body font-bold text-white">₹118</span>
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.navigateTo('screen-ola-details')" class="card-ride">
                <div class="flex items-center gap-3">
                  <div class="logo-ola-sq">
                    <div class="logo-ola-black-circle"><div class="ring-ola"><div class="dot-ola"></div></div></div>
                  </div>
                  <div>
                    <h4 class="text-body font-bold text-white">Ola</h4>
                    <p class="text-caption text-[#94A3B8]">Auto &bull; 18 min</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-body font-bold text-white">₹142</span>
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.showToast('Uber Car selected: ₹168')" class="card-ride">
                <div class="flex items-center gap-3">
                  <div class="logo-uber-sq">Uber</div>
                  <div>
                    <h4 class="text-body font-bold text-white">Uber</h4>
                    <p class="text-caption text-[#94A3B8]">Car &bull; 20 min</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-body font-bold text-white">₹168</span>
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (screenId === 'screen-rapido-details') {
      viewport.innerHTML = `
        <div class="flex-1 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            <!-- Top Map Header -->
            <div class="h-28 w-full map-canvas relative flex items-start p-4 border-b border-[#161F30]">
              <button onclick="app.navigateTo('screen-options')" class="w-8 h-8 rounded-full bg-[#0B1220]/90 border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-white backdrop-blur-md hover:border-blue-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
            </div>

            <div class="p-4 -mt-4">
              <!-- Provider Card -->
              <div class="card-surface p-3.5 mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-13 h-13 rounded-2xl bg-[#FACC15] flex items-center justify-center text-black shadow-lg p-2.5">
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>
                  </div>
                  <div>
                    <h3 class="text-sub font-bold text-white">Rapido</h3>
                    <p class="text-caption text-[#94A3B8]">Bike</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sub font-bold text-white block">₹78</span>
                  <span class="text-caption text-[#94A3B8]">12 min</span>
                </div>
              </div>

              <!-- Ride Details -->
              <div class="space-y-3 mb-5">
                <h4 class="text-sub font-bold text-white">Ride Details</h4>

                <div class="space-y-3 text-caption">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Pickup</span>
                      <span class="text-body font-semibold text-white">Your Location</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Drop</span>
                      <span class="text-body font-semibold text-white">Sanjay Ghodawat University</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 12l3-3"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Distance</span>
                      <span class="text-body font-semibold text-white">4.2 km</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 7v5l3 3"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Estimated Time</span>
                      <span class="text-body font-semibold text-white">12 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- About Rapido -->
              <div class="space-y-0.5 pt-2 border-t border-[#161F30]">
                <h4 class="text-sub font-bold text-white">About Rapido</h4>
                <p class="text-caption text-[#94A3B8]">Fast &bull; Affordable &bull; Bike Taxi</p>
                <p class="text-caption text-slate-300 flex items-center gap-1">
                  <span class="text-[#FACC15]">⭐</span> 4.2 (1M+ reviews)
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 pt-0">
            <button onclick="app.bookRide('Rapido Bike', 78)" class="btn-primary-blue text-btn py-3.5">
              Book Now
            </button>
          </div>
        </div>
      `;
    } else if (screenId === 'screen-ola-details') {
      viewport.innerHTML = `
        <div class="flex-1 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            <!-- Top Map Header -->
            <div class="h-28 w-full map-canvas relative flex items-start p-4 border-b border-[#161F30]">
              <button onclick="app.navigateTo('screen-options')" class="w-8 h-8 rounded-full bg-[#0B1220]/90 border border-[rgba(59,130,246,0.18)] flex items-center justify-center text-white backdrop-blur-md hover:border-blue-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
            </div>

            <div class="p-4 -mt-4">
              <!-- Provider Card -->
              <div class="card-surface p-3.5 mb-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-13 h-13 rounded-2xl bg-white flex items-center justify-center shadow-lg p-2.5">
                    <div class="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                      <div class="w-5 h-5 rounded-full border-2 border-[#84CC16] flex items-center justify-center"><div class="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></div></div>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-sub font-bold text-white">Ola</h3>
                    <p class="text-caption text-[#94A3B8]">Car</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sub font-bold text-white block">₹142</span>
                  <span class="text-caption text-[#94A3B8]">18 min</span>
                </div>
              </div>

              <!-- Ride Details -->
              <div class="space-y-3 mb-5">
                <h4 class="text-sub font-bold text-white">Ride Details</h4>

                <div class="space-y-3 text-caption">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Pickup</span>
                      <span class="text-body font-semibold text-white">Your Location</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Drop</span>
                      <span class="text-body font-semibold text-white">Sanjay Ghodawat University</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 12l3-3"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Distance</span>
                      <span class="text-body font-semibold text-white">4.2 km</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 7v5l3 3"/></svg>
                    <div>
                      <span class="text-[10px] text-[#94A3B8] block">Estimated Time</span>
                      <span class="text-body font-semibold text-white">18 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- About Ola -->
              <div class="space-y-0.5 pt-2 border-t border-[#161F30]">
                <h4 class="text-sub font-bold text-white">About Ola</h4>
                <p class="text-caption text-[#94A3B8]">Reliable &bull; Safe &bull; Comfortable</p>
                <p class="text-caption text-slate-300 flex items-center gap-1">
                  <span class="text-[#FACC15]">⭐</span> 4.1 (2M+ reviews)
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 pt-0">
            <button onclick="app.bookRide('Ola Car', 142)" class="btn-primary-blue text-btn py-3.5">
              Book Now
            </button>
          </div>
        </div>
      `;
    } else if (screenId === 'screen-history') {
      viewport.innerHTML = `
        <div class="flex-1 p-4 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            <h2 class="text-sub font-bold text-white mb-3.5">Ride History</h2>

            <div class="space-y-2">
              <div onclick="app.showToast('Ola Bike Receipt #VOX-8821')" class="card-surface p-3 flex items-center justify-between cursor-pointer hover:border-blue-400">
                <div class="flex items-center gap-2.5">
                  <div class="logo-ola-sq w-10 h-10">
                    <div class="logo-ola-black-circle w-7 h-7"><div class="ring-ola w-4 h-4"><div class="dot-ola w-1 h-1"></div></div></div>
                  </div>
                  <div>
                    <h4 class="text-caption font-bold text-white">Ola &bull; <span class="font-normal text-[#94A3B8]">Bike</span></h4>
                    <p class="text-[10px] text-slate-300">Sanjay Ghodawat University &rarr; Home</p>
                    <p class="text-[9px] text-[#94A3B8]">12 Sep, 07:45 PM</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-caption font-bold text-white">₹96</span>
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.showToast('Rapido Bike Receipt #VOX-8819')" class="card-surface p-3 flex items-center justify-between cursor-pointer hover:border-blue-400">
                <div class="flex items-center gap-2.5">
                  <div class="logo-rapido-sq w-10 h-10">
                    <svg class="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>
                  </div>
                  <div>
                    <h4 class="text-caption font-bold text-white">Rapido &bull; <span class="font-normal text-[#94A3B8]">Bike</span></h4>
                    <p class="text-[10px] text-slate-300">College &rarr; City Center</p>
                    <p class="text-[9px] text-[#94A3B8]">10 Sep, 06:20 PM</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-caption font-bold text-white">₹82</span>
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.showToast('Uber Auto Receipt #VOX-8815')" class="card-surface p-3 flex items-center justify-between cursor-pointer hover:border-blue-400">
                <div class="flex items-center gap-2.5">
                  <div class="logo-uber-sq w-10 h-10 text-[10px]">Uber</div>
                  <div>
                    <h4 class="text-caption font-bold text-white">Uber &bull; <span class="font-normal text-[#94A3B8]">Auto</span></h4>
                    <p class="text-[10px] text-slate-300">Railway Station &rarr; College</p>
                    <p class="text-[9px] text-[#94A3B8]">8 Sep, 05:10 PM</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-caption font-bold text-white">₹138</span>
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.showToast('Ola Car Receipt #VOX-8809')" class="card-surface p-3 flex items-center justify-between cursor-pointer hover:border-blue-400">
                <div class="flex items-center gap-2.5">
                  <div class="logo-ola-sq w-10 h-10">
                    <div class="logo-ola-black-circle w-7 h-7"><div class="ring-ola w-4 h-4"><div class="dot-ola w-1 h-1"></div></div></div>
                  </div>
                  <div>
                    <h4 class="text-caption font-bold text-white">Ola &bull; <span class="font-normal text-[#94A3B8]">Car</span></h4>
                    <p class="text-[10px] text-slate-300">Airport &rarr; Home</p>
                    <p class="text-[9px] text-[#94A3B8]">5 Sep, 09:30 AM</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-caption font-bold text-white">₹165</span>
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>

              <div onclick="app.showToast('Rapido Bike Receipt #VOX-8802')" class="card-surface p-3 flex items-center justify-between cursor-pointer hover:border-blue-400">
                <div class="flex items-center gap-2.5">
                  <div class="logo-rapido-sq w-10 h-10">
                    <svg class="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13.5A2.5 2.5 0 1 1 21.5 16 2.5 2.5 0 0 1 19 13.5m-14 0A2.5 2.5 0 1 1 7.5 16 2.5 2.5 0 0 1 5 13.5m10.5-8.5l-3.5 5h-4l3-5h4.5M19 11h-2l-2-3h-4l-2 3H3v2h2.2a4.49 4.49 0 0 1 7.6 0h2.4a4.49 4.49 0 0 1 7.6 0H21v-2h-2z"/></svg>
                  </div>
                  <div>
                    <h4 class="text-caption font-bold text-white">Rapido &bull; <span class="font-normal text-[#94A3B8]">Bike</span></h4>
                    <p class="text-[10px] text-slate-300">College &rarr; Market</p>
                    <p class="text-[9px] text-[#94A3B8]">2 Sep, 08:15 PM</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-caption font-bold text-white">₹74</span>
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Navigation -->
          <div class="bottom-nav">
            <div onclick="app.navigateTo('screen-home')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span>Home</span></div>
            <div class="nav-link active"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>History</span></div>
            <div onclick="app.showToast('Saved Places')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg><span>Saved</span></div>
            <div onclick="app.navigateTo('screen-profile')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg><span>More</span></div>
          </div>
        </div>
      `;
    } else if (screenId === 'screen-profile') {
      viewport.innerHTML = `
        <div class="flex-1 p-4 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div>
            <h2 class="text-sub font-bold text-white mb-3.5">Profile</h2>

            <!-- Avatar -->
            <div class="flex items-center gap-3.5 mb-5">
              <div class="w-13 h-13 rounded-full bg-slate-500/80 border-2 border-slate-400/30 flex items-center justify-center text-white">
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div>
                <h3 class="text-caption font-bold text-white">Varun Reddy</h3>
                <p class="text-[10px] text-[#94A3B8]">varunreddy@gmail.com</p>
              </div>
            </div>

            <!-- Menu List -->
            <div class="space-y-3 mb-5 text-caption text-slate-300">
              <div onclick="app.showToast('Saved Locations: Home, College, Gym')" class="flex items-center justify-between cursor-pointer hover:text-white py-1">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                  <span>Saved Locations</span>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>

              <div onclick="app.showToast('Payment Methods: UPI, GPay, Cards')" class="flex items-center justify-between cursor-pointer hover:text-white py-1">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  <span>Payment Methods</span>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>

              <div onclick="app.showToast('Ride Preferences: Cheapest First')" class="flex items-center justify-between cursor-pointer hover:text-white py-1">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                  <div>
                    <span class="block">Ride Preferences</span>
                    <span class="text-[9px] text-[#94A3B8]">Bike, Auto, Car</span>
                  </div>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>

              <div onclick="app.showToast('Push Notifications Active')" class="flex items-center justify-between cursor-pointer hover:text-white py-1">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  <span>Notifications</span>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>

              <div onclick="app.showToast('24/7 AI Support Desk')" class="flex items-center justify-between cursor-pointer hover:text-white py-1">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"/></svg>
                  <span>Help & Support</span>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>

              <div onclick="app.showToast('VOZX RideCompare v2.4.0 (Tesla Edition)')" class="flex items-center justify-between cursor-pointer hover:text-white py-1">
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"/></svg>
                  <span>About RideCompare</span>
                </div>
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>

          <div>
            <button onclick="app.navigateTo('screen-splash')" class="btn-logout-pill mb-3">
              Log Out
            </button>

            <!-- Bottom Navigation -->
            <div class="bottom-nav">
              <div onclick="app.navigateTo('screen-home')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg><span>Home</span></div>
              <div onclick="app.navigateTo('screen-history')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>History</span></div>
              <div onclick="app.showToast('Saved Places')" class="nav-link"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg><span>Saved</span></div>
              <div class="nav-link active"><svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg><span>More</span></div>
            </div>
          </div>
        </div>
      `;
    }
  }

  bookRide(provider, price) {
    if (window.soundFX) window.soundFX.playSuccess();
    this.showToast(`Ride Confirmed! ${provider} for ₹${price}`);
    setTimeout(() => {
      this.navigateTo('screen-history');
    }, 1200);
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (window.soundFX && !window.soundFX.isMuted) {
      window.soundFX.playTap();
    }

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 2400);
  }
}

window.app = new ExactAppController();

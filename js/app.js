// VOZX RideCompare - Interactive Simulator Controller

class SimulatorApp {
  constructor() {
    this.currentScreen = 'sim-screen-splash';
    this.deviceMode = 'mobile';
    this.toastTimer = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('VOZX RideCompare Interactive Simulator ready.');
    });
  }

  // 1. Splash Screen -> Home Page (When "Get Started" is clicked)
  goToHomeScreen() {
    if (window.soundFX) {
      window.soundFX.playSuccess();
      setTimeout(() => {
        if (window.soundFX) window.soundFX.playEngine();
      }, 100);
    }

    this.goToScreen('sim-screen-home');
    this.showToast('Welcome to RideCompare!');
  }

  // 2. Return to Splash Screen (On Logout or Brand Logo click)
  goToSplashScreen() {
    if (window.soundFX) window.soundFX.playSelect();
    this.goToScreen('sim-screen-splash');
    this.showToast('Back to Welcome Screen');
  }

  // 3. Screen Router inside Simulator
  goToScreen(screenId) {
    if (window.soundFX && screenId !== 'sim-screen-splash' && screenId !== 'sim-screen-home') {
      window.soundFX.playTap();
    }

    this.currentScreen = screenId;

    // Hide all screens
    const screens = document.querySelectorAll('.sim-screen');
    screens.forEach(s => s.classList.remove('active'));

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
    }

    // Sync Bottom Navigation Tabs on all screens
    const navMap = {
      'sim-screen-home': 0,
      'sim-screen-history': 1,
      'sim-screen-saved': 2,
      'sim-screen-profile': 3
    };

    if (navMap[screenId] !== undefined) {
      const activeIndex = navMap[screenId];
      const allNavs = document.querySelectorAll('.bottom-nav-exact');
      allNavs.forEach(nav => {
        const buttons = nav.querySelectorAll('.nav-link-exact');
        buttons.forEach((b, i) => {
          if (i === activeIndex) b.classList.add('active');
          else b.classList.remove('active');
        });
      });
    }
  }

  // 4. Select Recent Destination
  selectRecent(name, city) {
    if (window.soundFX) window.soundFX.playSelect();
    const dropText = document.getElementById('sim-home-drop-text');
    if (dropText) {
      dropText.textContent = `${name}, ${city}`;
      dropText.classList.remove('text-[#94A3B8]');
      dropText.classList.add('text-white', 'font-bold');
    }

    this.showToast(`Destination: ${name}`);
    setTimeout(() => {
      this.goToScreen('sim-screen-compare');
    }, 250);
  }

  // 5. Open Ride Details
  openRideDetails(rideId) {
    if (window.soundFX) window.soundFX.playSelect();

    const data = {
      'rapido-bike': { name: 'Rapido Bike', price: '₹78', total: '₹78.00' },
      'ola-bike': { name: 'Ola Bike', price: '₹92', total: '₹92.00' },
      'uber-moto': { name: 'Uber Moto', price: '₹105', total: '₹105.00' },
      'rapido-auto': { name: 'Rapido Auto', price: '₹110', total: '₹110.00' },
      'uber-auto': { name: 'Uber Auto', price: '₹118', total: '₹118.00' },
      'ola-auto': { name: 'Ola Auto', price: '₹142', total: '₹142.00' },
      'uber-car': { name: 'Uber Go Car', price: '₹168', total: '₹168.00' }
    };

    const item = data[rideId] || data['rapido-bike'];

    const nameEl = document.getElementById('sim-detail-name');
    const priceEl = document.getElementById('sim-detail-price');
    const totalEl = document.getElementById('sim-detail-total');

    if (nameEl) nameEl.textContent = item.name;
    if (priceEl) priceEl.textContent = item.price;
    if (totalEl) totalEl.textContent = item.total;

    this.goToScreen('sim-screen-details');
  }

  // 6. Confirm Booking Action
  bookRideAction() {
    if (window.soundFX) {
      window.soundFX.playSuccess();
      setTimeout(() => {
        if (window.soundFX) window.soundFX.playEngine();
      }, 120);
    }

    this.showToast('Ride Confirmed! Driver arriving in 3 mins (OTP: 4921)');
    setTimeout(() => {
      this.goToScreen('sim-screen-compare');
    }, 1400);
  }

  // 7. Device Frame Size Switcher (Phone / Tablet / Desktop Full)
  setDeviceFrame(mode) {
    if (window.soundFX) window.soundFX.playSelect();
    this.deviceMode = mode;

    const frame = document.getElementById('interactive-phone-frame');
    if (!frame) return;

    frame.classList.remove('mode-tablet', 'mode-full');

    ['mobile', 'tablet', 'full'].forEach(m => {
      const btn = document.getElementById(`btn-device-${m}`);
      if (btn) {
        if (m === mode) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    if (mode === 'tablet') {
      frame.classList.add('mode-tablet');
      this.showToast('Simulating iPad Tablet Frame (680px)');
    } else if (mode === 'full') {
      frame.classList.add('mode-full');
      this.showToast('Expanded Desktop Simulator View');
    } else {
      this.showToast('Phone Simulator Frame (395px)');
    }
  }

  // 8. Toggle Tesla Sound FX
  toggleSound() {
    if (!window.soundFX) return;
    const isMuted = window.soundFX.toggleMute();
    const textEl = document.getElementById('sound-text-top');
    const iconEl = document.getElementById('sound-icon-top');

    if (isMuted) {
      if (textEl) textEl.textContent = 'Muted';
      if (iconEl) iconEl.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>`;
      this.showToast('Audio Muted');
    } else {
      if (textEl) textEl.textContent = 'Tesla Sound ON';
      if (iconEl) iconEl.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;
      window.soundFX.playSuccess();
      this.showToast('Tesla UI Audio Active');
    }
  }

  // 9. Floating Toast Notification
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
    }, 2400);
  }
}

// Global App Instance
window.app = new SimulatorApp();

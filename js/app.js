// VOZX RideCompare - Exact Responsive Controller (Splash to Home Flow)

class RideCompareApp {
  constructor() {
    this.currentScreen = 'screen-splash';
    this.simMode = 'auto';
    this.toastTimer = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('VOZX RideCompare initialized. Initial screen: screen-splash');
    });
  }

  // 1. Splash Screen -> Home Page Transition (On "Get Started")
  goToHomeScreen() {
    if (window.soundFX) {
      window.soundFX.playSuccess();
      setTimeout(() => {
        if (window.soundFX) window.soundFX.playEngine();
      }, 100);
    }

    this.navigateTo('screen-home');
    this.showToast('Welcome to RideCompare!');
  }

  // Return to Splash Screen (On Logout or Logo click)
  goToSplashScreen() {
    if (window.soundFX) window.soundFX.playSelect();
    this.navigateTo('screen-splash');
    this.showToast('Back to Welcome Screen');
  }

  // Screen Navigation Router
  navigateTo(screenId) {
    if (window.soundFX && screenId !== 'screen-splash' && screenId !== 'screen-home') {
      window.soundFX.playTap();
    }

    this.currentScreen = screenId;

    // Hide all screens
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(s => s.classList.remove('active'));

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sync Bottom Navigation active state
    const navMap = {
      'screen-home': 0,
      'screen-history': 1,
      'screen-saved': 2,
      'screen-profile': 3
    };

    const navButtons = document.querySelectorAll('.exact-nav-link');
    navButtons.forEach(btn => btn.classList.remove('active'));

    if (navMap[screenId] !== undefined && navButtons[navMap[screenId]]) {
      navButtons[navMap[screenId]].classList.add('active');
    }
  }

  // Select Recent Destination & proceed to comparison
  selectRecent(name, city) {
    if (window.soundFX) window.soundFX.playSelect();
    const dropText = document.getElementById('home-drop-text');
    if (dropText) {
      dropText.textContent = `${name}, ${city}`;
      dropText.classList.remove('text-[#94A3B8]');
      dropText.classList.add('text-white', 'font-bold');
    }

    this.showToast(`Selected: ${name}`);
    setTimeout(() => {
      this.navigateTo('screen-compare');
    }, 250);
  }

  // Open Ride Details
  openRideDetails(rideId) {
    if (window.soundFX) window.soundFX.playSelect();
    const rideData = {
      'rapido-bike': { title: 'Rapido Bike', price: '₹78', total: '₹78.00' },
      'ola-bike': { title: 'Ola Bike', price: '₹92', total: '₹92.00' },
      'uber-moto': { title: 'Uber Moto', price: '₹105', total: '₹105.00' },
      'rapido-auto': { title: 'Rapido Auto', price: '₹110', total: '₹110.00' },
      'uber-auto': { title: 'Uber Auto', price: '₹118', total: '₹118.00' },
      'ola-auto': { title: 'Ola Auto', price: '₹142', total: '₹142.00' },
      'uber-car': { title: 'Uber Go Car', price: '₹168', total: '₹168.00' }
    };

    const item = rideData[rideId] || rideData['rapido-bike'];
    const titleEl = document.getElementById('detail-title');
    const badgeEl = document.getElementById('detail-price-badge');
    const totalEl = document.getElementById('detail-total-price');

    if (titleEl) titleEl.textContent = item.title;
    if (badgeEl) badgeEl.textContent = item.price;
    if (totalEl) totalEl.textContent = item.total;

    this.navigateTo('screen-details');
  }

  // Book Ride Success
  bookRideSuccess() {
    if (window.soundFX) window.soundFX.playSuccess();
    this.showToast('Ride Confirmed! Driver arriving in 3 mins');
    setTimeout(() => {
      this.navigateTo('screen-compare');
    }, 1200);
  }

  // Toggle Audio FX
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
      if (textEl) textEl.textContent = 'Tesla Audio ON';
      if (iconEl) iconEl.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;
      window.soundFX.playSuccess();
      this.showToast('Tesla UI Audio Active');
    }
  }

  // Device Simulation Controls (Auto, Desktop, Tablet, Mobile)
  setSimMode(mode) {
    if (window.soundFX) window.soundFX.playSelect();
    this.simMode = mode;

    const container = document.getElementById('app-canvas-container');

    ['auto', 'desktop', 'tablet', 'mobile'].forEach(m => {
      const btn = document.getElementById(`btn-device-${m}`);
      if (btn) {
        if (m === mode) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    if (container) {
      container.classList.remove('sim-frame-mobile', 'sim-frame-tablet');
    }

    if (mode === 'mobile') {
      if (container) container.classList.add('sim-frame-mobile');
      this.showToast('Simulating Mobile Viewport (iPhone 390px)');
    } else if (mode === 'tablet') {
      if (container) container.classList.add('sim-frame-tablet');
      this.showToast('Simulating Tablet Viewport (iPad 768px)');
    } else if (mode === 'desktop') {
      this.showToast('Desktop Viewport Mode');
    } else {
      this.showToast('Auto Responsive Window Sizing');
    }
  }

  // Toast Notification
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
window.app = new RideCompareApp();

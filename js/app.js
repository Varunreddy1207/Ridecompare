// VOZX RideCompare - Exact Responsive UI Controller & Simulator Router

class RideCompareApp {
  constructor() {
    this.currentMode = 'auto'; // 'auto', 'desktop', 'tablet', 'mobile'
    this.toastTimeout = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('VOZX RideCompare Responsive App initialized.');
      // Auto-detect if opened in mobile viewport
      if (window.innerWidth < 640) {
        this.setDeviceMode('auto');
      }
    });
  }

  // Device Switcher Handler: 'auto', 'desktop', 'tablet', 'mobile'
  setDeviceMode(mode) {
    this.currentMode = mode;
    const canvas = document.getElementById('splash-ui-canvas');
    if (!canvas) return;

    // Reset classes
    canvas.classList.remove('mode-auto', 'mode-desktop', 'mode-tablet', 'mode-mobile');
    canvas.classList.add(`mode-${mode}`);

    // Update button states
    ['auto', 'desktop', 'tablet', 'mobile'].forEach((m) => {
      const btn = document.getElementById(`btn-device-${m}`);
      if (btn) {
        if (m === mode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });

    if (window.soundFX) window.soundFX.playSelect();

    const modeLabels = {
      auto: 'Auto Responsive (Window Sizing)',
      desktop: 'Desktop Widescreen View',
      tablet: 'Tablet (iPad) 768px View',
      mobile: 'Mobile (iPhone) 390px View'
    };

    this.showToast(`Switched to: ${modeLabels[mode] || mode}`);
  }

  // Primary CTA Handler: "Get Started"
  handleGetStarted() {
    if (window.soundFX) {
      window.soundFX.playSuccess();
      setTimeout(() => {
        if (window.soundFX) window.soundFX.playEngine();
      }, 100);
    }

    const modal = document.getElementById('modal-comparison');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close Comparison Modal
  closeComparisonModal() {
    if (window.soundFX) window.soundFX.playTap();
    const modal = document.getElementById('modal-comparison');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Secondary CTA Handler: "Login"
  handleLogin() {
    if (window.soundFX) window.soundFX.playTap();
    const modal = document.getElementById('modal-login');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close Login Modal
  closeLoginModal() {
    if (window.soundFX) window.soundFX.playTap();
    const modal = document.getElementById('modal-login');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Book Ride Action
  bookRide(provider, price) {
    if (window.soundFX) window.soundFX.playChime();
    this.showToast(`Confirmed ${provider} (₹${price})! Driver arriving in 3 mins`);
    setTimeout(() => {
      this.closeComparisonModal();
    }, 1500);
  }

  // Authentication Mock
  authenticate(method) {
    if (window.soundFX) window.soundFX.playSuccess();
    this.showToast(`Signed in successfully via ${method}!`);
    setTimeout(() => {
      this.closeLoginModal();
    }, 800);
  }

  // Sound Toggle: Mute / Unmute
  toggleSound() {
    if (!window.soundFX) return;
    const isMuted = window.soundFX.toggleMute();

    const barText = document.getElementById('sound-text-bar');
    const barIcon = document.getElementById('sound-icon-bar');
    const floatText = document.getElementById('sound-text-float');
    const floatIcon = document.getElementById('sound-icon-float');

    const soundOnSVG = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
    `;
    const soundOffSVG = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
    `;

    if (isMuted) {
      if (barText) barText.textContent = 'Audio Muted';
      if (barIcon) barIcon.innerHTML = soundOffSVG;
      if (floatText) floatText.textContent = 'Audio Muted';
      if (floatIcon) floatIcon.innerHTML = soundOffSVG;
      this.showToast('Audio Muted');
    } else {
      if (barText) barText.textContent = 'Tesla Audio ON';
      if (barIcon) barIcon.innerHTML = soundOnSVG;
      if (floatText) floatText.textContent = 'Tesla Audio ON';
      if (floatIcon) floatIcon.innerHTML = soundOnSVG;
      window.soundFX.playSuccess();
      this.showToast('Tesla UI Audio Active');
    }
  }

  // Toast Notification System
  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 12px)';
    }, 2500);
  }
}

// Global Instance
window.app = new RideCompareApp();

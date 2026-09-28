// VOZX RideCompare - Device View Controller (Desktop, Tablet & Mobile)

class DeviceViewController {
  constructor() {
    this.currentMode = 'desktop';
    this.isMuted = false;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Auto-detect optimal initial mode based on screen width
      const width = window.innerWidth;
      if (width <= 640) {
        this.setDeviceMode('mobile', false);
      } else if (width <= 1024) {
        this.setDeviceMode('tablet', false);
      } else {
        this.setDeviceMode('desktop', false);
      }

      // Warm up audio on first user touch/click
      document.body.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.init();
      }, { once: true });
    });
  }

  setDeviceMode(mode, playSound = true) {
    this.currentMode = mode;

    const viewMobile = document.getElementById('view-mobile');
    const viewTablet = document.getElementById('view-tablet');
    const viewDesktop = document.getElementById('view-desktop');

    const btnDesktop = document.getElementById('btn-view-desktop');
    const btnTablet = document.getElementById('btn-view-tablet');
    const btnMobile = document.getElementById('btn-view-mobile');

    // Reset button states
    [btnDesktop, btnTablet, btnMobile].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    // Hide all views first
    if (viewMobile) viewMobile.classList.add('hidden');
    if (viewTablet) viewTablet.classList.add('hidden');
    if (viewDesktop) viewDesktop.classList.add('hidden');

    // Activate selected view
    if (mode === 'desktop') {
      if (viewDesktop) viewDesktop.classList.remove('hidden');
      if (btnDesktop) btnDesktop.classList.add('active');
      if (playSound) this.showToast('🖥️ Switched to Desktop View (Automotive Dashboard)');
    } else if (mode === 'tablet') {
      if (viewTablet) viewTablet.classList.remove('hidden');
      if (btnTablet) btnTablet.classList.add('active');
      if (playSound) this.showToast('📱 Switched to Tablet View (iPad 768px)');
    } else if (mode === 'mobile') {
      if (viewMobile) viewMobile.classList.remove('hidden');
      if (btnMobile) btnMobile.classList.add('active');
      if (playSound) this.showToast('📱 Switched to Mobile View (iPhone 15 Pro)');
    }

    if (playSound && window.soundFX) {
      window.soundFX.playSelect();
    }
  }

  handleGetStarted() {
    if (window.soundFX) window.soundFX.playSuccess();
    this.showToast('🚀 Launching VOZX RideCompare live comparison...');
  }

  handleLogin() {
    if (window.soundFX) window.soundFX.playTap();
    this.showToast('🔑 Opening Secure VOZX Account Login...');
  }

  toggleSound() {
    if (!window.soundFX) return;
    const muted = window.soundFX.toggleMute();
    this.isMuted = muted;

    const soundText = document.getElementById('sound-status-text');
    const soundIcon = document.getElementById('sound-icon');

    if (muted) {
      if (soundText) soundText.textContent = 'Muted';
      if (soundIcon) soundIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>`;
      this.showToast('Audio Muted');
    } else {
      if (soundText) soundText.textContent = 'Tesla Sound ON';
      if (soundIcon) soundIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;
      window.soundFX.playSuccess();
      this.showToast('Tesla UI Audio Enabled');
    }
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (window.soundFX && !this.isMuted) {
      window.soundFX.playTap();
    }

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 2200);
  }
}

window.app = new DeviceViewController();

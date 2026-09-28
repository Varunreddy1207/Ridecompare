// VOZX RideCompare - Native Responsive Application Controller

class ResponsiveAppController {
  constructor() {
    this.isMuted = false;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Warm up audio context on first user interaction
      document.body.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.init();
      }, { once: true });
    });
  }

  handleGetStarted() {
    if (window.soundFX) window.soundFX.playSuccess();
    this.showToast('🚀 Launching VOZX RideCompare...');
  }

  handleLogin() {
    if (window.soundFX) window.soundFX.playTap();
    this.showToast('🔑 Opening VOZX Secure Login...');
  }

  toggleSound() {
    if (!window.soundFX) return;
    const muted = window.soundFX.toggleMute();
    this.isMuted = muted;

    const desktopText = document.getElementById('sound-status-desktop');
    const desktopIcon = document.getElementById('sound-icon-desktop');

    if (muted) {
      if (desktopText) desktopText.textContent = 'Muted';
      if (desktopIcon) {
        desktopIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>`;
      }
      this.showToast('Audio Muted');
    } else {
      if (desktopText) desktopText.textContent = 'Audio ON';
      if (desktopIcon) {
        desktopIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>`;
      }
      window.soundFX.playSuccess();
      this.showToast('Tesla UI Audio Active');
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

window.app = new ResponsiveAppController();

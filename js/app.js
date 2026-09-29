// =============================================================================
// VOZX RideCompare — Exact "Get Started" UI Interaction Controller
// =============================================================================

class GetStartedController {
  constructor() {
    this.toastTimeout = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Keyboard support: Enter key triggers "Get Started"
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.onGetStarted();
        }
      });
    });
  }

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
    this.showToast('Welcome to VOZX RideCompare! 🚀');
  }

  onLogin() {
    if (window.soundFX) {
      window.soundFX.playTap();
    }
    this.showToast('Login portal opening...');
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }
}

window.app = new GetStartedController();

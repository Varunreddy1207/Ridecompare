// =============================================================================
// VOZX RideCompare — Audio Synthesizer (Disabled)
// All button click and interaction sounds removed across all devices per request
// =============================================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
  }

  init() {
    // Sound permanently disabled across all devices
  }

  playTap() {
    // Sound permanently disabled across all devices
  }

  playGetStarted() {
    // Sound permanently disabled across all devices
  }

  playConfirm() {
    // Sound permanently disabled across all devices
  }

  playError() {
    // Sound permanently disabled across all devices
  }

  toggleMute() {
    this.isMuted = true;
    return true;
  }
}

window.soundFX = new SoundFX();

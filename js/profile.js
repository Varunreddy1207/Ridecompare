/**
 * VOZX RideCompare - User Profile & Edit Profile Management System
 * Handles profile data persistence (localStorage), interactive modal editing,
 * avatar accent theming, and real-time DOM synchronization across all viewports.
 */

(function () {
  const DEFAULT_PROFILE = {
    name: 'Varun Reddy',
    email: 'varunreddy@gmail.com',
    phone: '+91 98765 43210',
    city: 'Ichalkaranji, Kolhapur',
    ridePref: 'all',
    avatarAccent: 'blue'
  };

  const ACCENT_COLORS = {
    blue: { bg: '#93C5FD', text: '#1E3A8A' },
    purple: { bg: '#C4B5FD', text: '#4C1D95' },
    emerald: { bg: '#A7F3D0', text: '#064E3B' },
    amber: { bg: '#FDE68A', text: '#78350F' }
  };

  let currentProfile = Object.assign({}, DEFAULT_PROFILE);
  let tempAvatarAccent = 'blue';

  function loadProfile() {
    try {
      const saved = localStorage.getItem('ridecompare_user_profile');
      if (saved) {
        currentProfile = Object.assign({}, DEFAULT_PROFILE, JSON.parse(saved));
      }
    } catch (e) {
      currentProfile = Object.assign({}, DEFAULT_PROFILE);
    }
    tempAvatarAccent = currentProfile.avatarAccent || 'blue';
    renderProfile();
  }

  function renderProfile() {
    // 1. Update text fields in all views
    const nameEl = document.getElementById('profile-display-name');
    const sideNameEl = document.getElementById('sidebar-profile-name');
    const emailEl = document.getElementById('profile-display-email');
    const phoneEl = document.getElementById('profile-display-phone');

    if (nameEl) nameEl.textContent = currentProfile.name;
    if (sideNameEl) sideNameEl.textContent = currentProfile.name;
    if (emailEl) emailEl.textContent = currentProfile.email;
    if (phoneEl) phoneEl.textContent = currentProfile.phone || '+91 98765 43210';

    // 2. Avatar Accents
    const accent = ACCENT_COLORS[currentProfile.avatarAccent] || ACCENT_COLORS.blue;
    const avatars = document.querySelectorAll('#profile-avatar-display, #sidebar-avatar-badge, #edit-modal-avatar-preview');
    avatars.forEach((av) => {
      av.style.setProperty('background-color', accent.bg, 'important');
      const svg = av.querySelector('svg');
      if (svg) svg.style.setProperty('color', accent.text, 'important');
    });

    // Sync with window.app if available
    if (window.app) {
      window.app.userProfile = currentProfile;
    }
  }

  function updateModalTheme() {
    const isDarkMode = document.body.classList.contains('theme-dark') || 
                       document.documentElement.getAttribute('data-theme') === 'dark';
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
      labels.forEach((l) => l.style.removeProperty('color'));
      inputs.forEach((inp) => {
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
      labels.forEach((l) => l.style.setProperty('color', '#334155', 'important'));
      inputs.forEach((inp) => {
        inp.style.setProperty('background-color', '#F8FAFC', 'important');
        inp.style.setProperty('border-color', '#CBD5E1', 'important');
        inp.style.setProperty('color', '#0F172A', 'important');
      });
    }
  }

  function updateAccentButtons(selectedKey) {
    const btns = document.querySelectorAll('.avatar-accent-btn');
    btns.forEach((btn) => {
      const key = btn.getAttribute('data-accent');
      if (key === selectedKey) {
        btn.classList.add('ring-2', 'ring-blue-500', 'border-white', 'scale-110');
      } else {
        btn.classList.remove('ring-2', 'ring-blue-500', 'border-white', 'scale-110');
      }
    });
  }

  function openEditProfileModal() {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    const modal = document.getElementById('edit-profile-modal');
    if (!modal) return;

    const nameInp = document.getElementById('edit-profile-name');
    const emailInp = document.getElementById('edit-profile-email');
    const phoneInp = document.getElementById('edit-profile-phone');
    const cityInp = document.getElementById('edit-profile-city');
    const prefInp = document.getElementById('edit-profile-pref');

    if (nameInp) nameInp.value = currentProfile.name;
    if (emailInp) emailInp.value = currentProfile.email;
    if (phoneInp) phoneInp.value = currentProfile.phone || '';
    if (cityInp) cityInp.value = currentProfile.city || '';
    if (prefInp) prefInp.value = currentProfile.ridePref || 'all';

    tempAvatarAccent = currentProfile.avatarAccent || 'blue';
    updateAccentButtons(tempAvatarAccent);

    modal.classList.add('show');
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.setProperty('opacity', '1', 'important');
    modal.style.setProperty('visibility', 'visible', 'important');
    modal.style.setProperty('pointer-events', 'auto', 'important');
    updateModalTheme();
  }

  function closeEditProfileModal() {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.setProperty('opacity', '0', 'important');
      modal.style.setProperty('visibility', 'hidden', 'important');
      modal.style.setProperty('pointer-events', 'none', 'important');
      setTimeout(() => {
        if (!modal.classList.contains('show')) {
          modal.style.setProperty('display', 'none', 'important');
        }
      }, 300);
    }
  }

  function selectAvatarTheme(colorKey) {
    if (window.soundFX && window.soundFX.playTap) window.soundFX.playTap();
    tempAvatarAccent = colorKey;
    updateAccentButtons(colorKey);

    const accent = ACCENT_COLORS[colorKey] || ACCENT_COLORS.blue;
    const modalAv = document.getElementById('edit-modal-avatar-preview');
    if (modalAv) {
      modalAv.style.setProperty('background-color', accent.bg, 'important');
      const svg = modalAv.querySelector('svg');
      if (svg) svg.style.setProperty('color', accent.text, 'important');
    }
  }

  function saveProfile(e) {
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
      if (window.app && window.app.showToast) window.app.showToast('⚠️ Please enter your full name');
      if (nameInp) nameInp.focus();
      return;
    }
    if (!newEmail || !newEmail.includes('@')) {
      if (window.app && window.app.showToast) window.app.showToast('⚠️ Please enter a valid email address');
      if (emailInp) emailInp.focus();
      return;
    }

    currentProfile = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      city: newCity,
      ridePref: newPref,
      avatarAccent: tempAvatarAccent || 'blue'
    };

    localStorage.setItem('ridecompare_user_profile', JSON.stringify(currentProfile));
    renderProfile();
    closeEditProfileModal();

    if (window.soundFX && window.soundFX.playGetStarted) {
      window.soundFX.playGetStarted();
    }
    if (window.app && window.app.showToast) {
      window.app.showToast('Profile updated successfully! ✨');
    }
  }

  // Global & window.app bindings
  window.openEditProfileModal = openEditProfileModal;
  window.closeEditProfileModal = closeEditProfileModal;
  window.selectAvatarTheme = selectAvatarTheme;
  window.saveProfile = saveProfile;

  // Bind to window.app when loaded
  function bindToApp() {
    if (window.app) {
      window.app.openEditProfileModal = openEditProfileModal;
      window.app.closeEditProfileModal = closeEditProfileModal;
      window.app.selectAvatarTheme = selectAvatarTheme;
      window.app.saveProfile = saveProfile;
      window.app.initUserProfile = loadProfile;
      window.app.renderUserProfile = renderProfile;
      window.app.updateEditProfileModalTheme = updateModalTheme;
      window.app.userProfile = currentProfile;
    }
  }

  // Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    bindToApp();

    // Close on backdrop click
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditProfileModal();
      });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeEditProfileModal();
    });
  });

  // Run immediately in case DOM is already ready
  if (document.readyState !== 'loading') {
    loadProfile();
    bindToApp();
  }
})();
